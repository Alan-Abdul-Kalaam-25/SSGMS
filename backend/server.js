const express = require('express');
const cors = require('cors');

// Load and validate configuration
const { config, validateConfig, displayConfig } = require('./config/env');
const { initializeSupabase, testConnection } = require('./config/supabase');
const { logger, createRequestLogger, createErrorLogger } = require('./utils/logger');
const {
  createGeneralRateLimit,
  createAuthRateLimit,
  configureHelmet,
  createSanitizationMiddleware,
  createRequestSizeLimiter,
  createSecurityMonitor,
} = require('./middleware/security');

// Validate configuration on startup
validateConfig();

const app = express();

// Display configuration in development
if (config.isDevelopment) {
  displayConfig();
}

// Security middleware (should be early in the middleware stack)
app.use(configureHelmet());
app.use(createSecurityMonitor());
app.use(createRequestSizeLimiter());
app.use(createSanitizationMiddleware());

// General rate limiting
app.use(createGeneralRateLimit());

// CORS middleware
app.use(
  cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(createRequestLogger());

// Routes with specific rate limiting for auth
app.use('/api/auth', createAuthRateLimit(), require('./routes/auth'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'StudyMatcher API is running',
    version: config.apiVersion,
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// API documentation endpoint (development only)
if (config.enableApiDocs) {
  app.get('/api/docs', (req, res) => {
    res.json({
      message: 'API Documentation',
      version: config.apiVersion,
      endpoints: {
        auth: {
          'POST /api/auth/signup': 'Register a new user',
          'POST /api/auth/login': 'Login user',
          'POST /api/auth/logout': 'Logout user',
          'GET /api/auth/me': 'Get current user profile',
        },
        users: {
          'GET /api/users/profile': 'Get user profile',
          'PUT /api/users/profile': 'Update user profile',
          'GET /api/users/search': 'Search users',
          'GET /api/users/stats': 'Get user statistics',
        },
        groups: {
          'GET /api/groups': 'Get all groups',
          'POST /api/groups': 'Create new group',
          'GET /api/groups/:id': 'Get group by ID',
          'PUT /api/groups/:id': 'Update group',
          'DELETE /api/groups/:id': 'Delete group',
          'POST /api/groups/:id/join': 'Join group',
          'POST /api/groups/:id/leave': 'Leave group',
        },
      },
    });
  });
}

// Error logging middleware
app.use(createErrorLogger());

// Error handling middleware
app.use((err, req, res, next) => {
  // Don't log validation errors as errors (they're expected)
  if (err.name !== 'ValidationError') {
    logger.errorWithStack('Server error', err, {
      url: req.originalUrl,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
    });
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.errors || [err.message],
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    message: config.enableDetailedErrors
      ? err.message
      : 'An error occurred while processing your request',
    ...(config.enableDetailedErrors && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
  });

  res.status(404).json({
    message: 'Route not found',
    requestedPath: req.originalUrl,
  });
});

// Initialize Supabase and start server
async function startServer() {
  try {
    // Initialize Supabase
    initializeSupabase();

    // Test Supabase connection
    const isConnected = await testConnection();
    if (!isConnected) {
      logger.warn('Supabase connection test failed, but continuing...');
    }

    // Start the server
    app.listen(config.port, () => {
      logger.info(`Server started successfully`, {
        port: config.port,
        environment: config.nodeEnv,
        apiVersion: config.apiVersion,
        supabaseConnected: isConnected,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', {
      error: error.message,
    });
    process.exit(1);
  }
}

// Start the server
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
