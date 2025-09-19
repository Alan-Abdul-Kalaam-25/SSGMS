/**
 * Environment Configuration Utility
 * Centralizes and validates all environment variables
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment-specific .env file
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config(); // Load default .env as fallback

/**
 * Configuration object with all environment variables
 */
const config = {
  // Node Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // Server Configuration
  port: parseInt(process.env.PORT) || 3001,
  apiVersion: process.env.API_VERSION || 'v1',

  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/studymatcher',
    name: process.env.DB_NAME || 'studymatcher',
  },

  // Authentication & Security
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
  },

  // CORS & Frontend
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  },

  // Rate Limiting
  rateLimit: {
    window: parseInt(process.env.RATE_LIMIT_WINDOW) || 15, // minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    loginWindow: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW) || 15, // minutes
    loginMaxAttempts: parseInt(process.env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS) || 5,
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'simple',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
  },

  // Session & Cookies
  session: {
    secret: process.env.SESSION_SECRET,
    cookieSecure: process.env.COOKIE_SECURE === 'true',
    cookieHttpOnly: process.env.COOKIE_HTTP_ONLY !== 'false',
    cookieSameSite: process.env.COOKIE_SAME_SITE || 'lax',
  },

  // Feature Flags
  features: {
    enableUserRegistration: process.env.ENABLE_USER_REGISTRATION !== 'false',
    enableStudyGroupCreation: process.env.ENABLE_STUDY_GROUP_CREATION !== 'false',
    enableMatchingService: process.env.ENABLE_MATCHING_SERVICE !== 'false',
    enableEmailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true',
  },

  // Development/Production specific
  enableDetailedErrors: process.env.ENABLE_DETAILED_ERRORS === 'true',
  enableApiDocs: process.env.ENABLE_API_DOCS !== 'false',
  seedDatabase: process.env.SEED_DATABASE === 'true',

  // Email Configuration (optional)
  email: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: parseInt(process.env.SMTP_PORT) || 587,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    fromEmail: process.env.FROM_EMAIL,
  },

  // Monitoring (optional)
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    gaTrackingId: process.env.GA_TRACKING_ID,
  },
};

/**
 * Validate required environment variables
 */
function validateConfig() {
  const errors = [];

  // Required in all environments
  if (!config.auth.jwtSecret) {
    errors.push('JWT_SECRET is required');
  }

  // Production-specific requirements
  if (config.isProduction) {
    if (!config.session.secret) {
      errors.push('SESSION_SECRET is required in production');
    }

    if (config.auth.jwtSecret === 'your-super-secure-jwt-secret-key-change-this-in-production') {
      errors.push('JWT_SECRET must be changed from default value in production');
    }

    if (!config.database.uri.includes('mongodb+srv://')) {
      console.warn('⚠️  Warning: Using local MongoDB in production is not recommended');
    }
  }

  // Development warnings
  if (config.isDevelopment) {
    if (config.auth.jwtSecret === 'your-super-secure-jwt-secret-key-change-this-in-production') {
      console.warn('⚠️  Warning: Using default JWT_SECRET in development');
    }
  }

  if (errors.length > 0) {
    console.error('❌ Configuration validation failed:');
    errors.forEach(error => console.error(`   - ${error}`));
    process.exit(1);
  }

  console.log(`✅ Configuration validated for ${config.nodeEnv} environment`);
}

/**
 * Display current configuration (safe for logging)
 */
function displayConfig() {
  const safeConfig = {
    nodeEnv: config.nodeEnv,
    port: config.port,
    apiVersion: config.apiVersion,
    database: {
      name: config.database.name,
      isLocal: config.database.uri.includes('localhost'),
    },
    auth: {
      jwtExpiresIn: config.auth.jwtExpiresIn,
      bcryptSaltRounds: config.auth.bcryptSaltRounds,
    },
    cors: {
      frontendUrl: config.cors.frontendUrl,
      allowedOrigins: config.cors.allowedOrigins,
    },
    features: config.features,
    logging: config.logging,
  };

  console.log('📋 Current Configuration:');
  console.log(JSON.stringify(safeConfig, null, 2));
}

module.exports = {
  config,
  validateConfig,
  displayConfig,
};
