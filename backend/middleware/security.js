/**
 * Security Middleware
 * Rate limiting, security headers, and other security measures
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { config } = require('../config/env');
const { logger } = require('./logger');

/**
 * Create general rate limiter
 */
function createGeneralRateLimit() {
  return rateLimit({
    windowMs: config.rateLimit.window * 60 * 1000, // Convert minutes to milliseconds
    max: config.rateLimit.maxRequests,
    message: {
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: config.rateLimit.window,
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      logger.security('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.originalUrl,
        method: req.method,
      });

      res.status(429).json({
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: `${config.rateLimit.window} minutes`,
      });
    },
  });
}

/**
 * Create strict rate limiter for authentication endpoints
 */
function createAuthRateLimit() {
  return rateLimit({
    windowMs: config.rateLimit.loginWindow * 60 * 1000,
    max: config.rateLimit.loginMaxAttempts,
    skipSuccessfulRequests: true, // Don't count successful requests
    message: {
      message: 'Too many login attempts from this IP, please try again later.',
      retryAfter: config.rateLimit.loginWindow,
    },
    handler: (req, res) => {
      logger.security('Authentication rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        email: req.body?.email || 'unknown',
      });

      res.status(429).json({
        message: 'Too many login attempts from this IP, please try again later.',
        retryAfter: `${config.rateLimit.loginWindow} minutes`,
      });
    },
  });
}

/**
 * Configure Helmet security headers
 */
function configureHelmet() {
  return helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },

    // HTTP Strict Transport Security
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },

    // X-Frame-Options
    frameguard: { action: 'deny' },

    // X-Content-Type-Options
    noSniff: true,

    // Referrer Policy
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

    // Remove X-Powered-By header
    hidePoweredBy: true,

    // X-Download-Options for IE8+
    ieNoOpen: true,

    // X-XSS-Protection
    xssFilter: true,
  });
}

/**
 * Input sanitization middleware
 */
function createSanitizationMiddleware() {
  return (req, res, next) => {
    // Sanitize common injection attempts
    const sanitizeString = str => {
      if (typeof str !== 'string') return str;

      // Remove potential script tags
      str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      // Remove potential SQL injection patterns
      str = str.replace(/('|(\\')|(;)|(--)|(\s*;\s*)|(\s*;\s*$))/gi, '');

      return str.trim();
    };

    // Recursively sanitize object
    const sanitizeObject = obj => {
      if (obj === null || typeof obj !== 'object') {
        return typeof obj === 'string' ? sanitizeString(obj) : obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }

      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    };

    // Sanitize request body
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }

    next();
  };
}

/**
 * Request size limiter
 */
function createRequestSizeLimiter() {
  return (req, res, next) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const contentLength = parseInt(req.get('content-length') || '0');

    if (contentLength > maxSize) {
      logger.security('Request size limit exceeded', {
        ip: req.ip,
        size: contentLength,
        maxSize,
        url: req.originalUrl,
      });

      return res.status(413).json({
        message: 'Request entity too large',
        maxSize: '10MB',
      });
    }

    next();
  };
}

/**
 * IP whitelist/blacklist middleware
 */
function createIPFilter(options = {}) {
  const { whitelist = [], blacklist = [] } = options;

  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;

    // Check blacklist first
    if (blacklist.length > 0 && blacklist.includes(clientIP)) {
      logger.security('Blocked IP attempt', {
        ip: clientIP,
        userAgent: req.get('User-Agent'),
        url: req.originalUrl,
      });

      return res.status(403).json({
        message: 'Access denied',
      });
    }

    // Check whitelist (if configured)
    if (whitelist.length > 0 && !whitelist.includes(clientIP)) {
      logger.security('Non-whitelisted IP attempt', {
        ip: clientIP,
        userAgent: req.get('User-Agent'),
        url: req.originalUrl,
      });

      return res.status(403).json({
        message: 'Access denied',
      });
    }

    next();
  };
}

/**
 * Security monitoring middleware
 */
function createSecurityMonitor() {
  return (req, res, next) => {
    // Monitor suspicious patterns
    const userAgent = req.get('User-Agent') || '';
    const suspicious = [/bot/i, /crawler/i, /spider/i, /scraper/i, /hack/i, /scan/i];

    const isSuspicious = suspicious.some(pattern => pattern.test(userAgent));

    if (isSuspicious) {
      logger.security('Suspicious user agent detected', {
        ip: req.ip,
        userAgent,
        url: req.originalUrl,
        method: req.method,
      });
    }

    // Monitor for common attack patterns in URLs
    const attackPatterns = [
      /\.\./, // Directory traversal
      /union.*select/i, // SQL injection
      /<script/i, // XSS
      /javascript:/i, // XSS
      /vbscript:/i, // XSS
    ];

    const url = req.originalUrl;
    const hasAttackPattern = attackPatterns.some(pattern => pattern.test(url));

    if (hasAttackPattern) {
      logger.security('Attack pattern detected in URL', {
        ip: req.ip,
        userAgent,
        url,
        method: req.method,
      });

      return res.status(400).json({
        message: 'Invalid request',
      });
    }

    next();
  };
}

module.exports = {
  createGeneralRateLimit,
  createAuthRateLimit,
  configureHelmet,
  createSanitizationMiddleware,
  createRequestSizeLimiter,
  createIPFilter,
  createSecurityMonitor,
};
