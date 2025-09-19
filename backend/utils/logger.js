/**
 * Centralized Logging Utility
 * Replaces console.log/error with structured logging
 */

const { config } = require('../config/env');

/**
 * Log levels in order of severity
 */
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

/**
 * Get current timestamp in ISO format
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Format log message based on configuration
 */
function formatMessage(level, message, meta = {}) {
  const timestamp = getTimestamp();

  if (config.logging.format === 'json') {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
      env: config.nodeEnv,
      service: 'ssgms-backend',
    });
  }

  // Simple format for development
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
}

/**
 * Check if log level should be output
 */
function shouldLog(level) {
  const currentLevel = LOG_LEVELS[config.logging.level] || LOG_LEVELS.info;
  const messageLevel = LOG_LEVELS[level] || LOG_LEVELS.info;
  return messageLevel <= currentLevel;
}

/**
 * Logger class with different log levels
 */
class Logger {
  error(message, meta = {}) {
    if (shouldLog('error')) {
      console.error(formatMessage('error', message, meta));
    }
  }

  warn(message, meta = {}) {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message, meta));
    }
  }

  info(message, meta = {}) {
    if (shouldLog('info')) {
      console.log(formatMessage('info', message, meta));
    }
  }

  debug(message, meta = {}) {
    if (shouldLog('debug')) {
      console.log(formatMessage('debug', message, meta));
    }
  }

  /**
   * Log HTTP requests
   */
  request(req, res, duration) {
    if (!config.logging.enableRequestLogging) return;

    const meta = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
    };

    if (req.user) {
      meta.userId = req.user._id;
    }

    this.info(`${req.method} ${req.originalUrl}`, meta);
  }

  /**
   * Log authentication events
   */
  auth(event, userId, meta = {}) {
    this.info(`Auth: ${event}`, {
      userId,
      event,
      ...meta,
    });
  }

  /**
   * Log database operations
   */
  database(operation, collection, meta = {}) {
    this.debug(`DB: ${operation} on ${collection}`, meta);
  }

  /**
   * Log application events
   */
  event(eventName, meta = {}) {
    this.info(`Event: ${eventName}`, meta);
  }

  /**
   * Log errors with stack trace in development
   */
  errorWithStack(message, error, meta = {}) {
    const errorMeta = {
      ...meta,
      error: {
        name: error.name,
        message: error.message,
        ...(config.enableDetailedErrors && { stack: error.stack }),
      },
    };

    this.error(message, errorMeta);
  }

  /**
   * Log security events
   */
  security(event, meta = {}) {
    this.warn(`Security: ${event}`, {
      event,
      timestamp: getTimestamp(),
      ...meta,
    });
  }
}

/**
 * Create request logging middleware
 */
function createRequestLogger() {
  return (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.request(req, res, duration);
    });

    next();
  };
}

/**
 * Express error logging middleware
 */
function createErrorLogger() {
  return (err, req, res, next) => {
    logger.errorWithStack('Request error', err, {
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
    });

    next(err);
  };
}

// Create singleton logger instance
const logger = new Logger();

module.exports = {
  logger,
  createRequestLogger,
  createErrorLogger,
  LOG_LEVELS,
};
