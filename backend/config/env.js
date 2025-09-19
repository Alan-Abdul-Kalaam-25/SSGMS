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

  // Supabase Configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    enableRealtime: process.env.SUPABASE_ENABLE_REALTIME !== 'false',
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

  // Required Supabase configuration
  if (!config.supabase.url) {
    errors.push('SUPABASE_URL is required');
  }

  if (!config.supabase.anonKey) {
    errors.push('SUPABASE_ANON_KEY is required');
  }

  // Production-specific requirements
  if (config.isProduction) {
    if (!config.session.secret) {
      errors.push('SESSION_SECRET is required in production');
    }

    if (!config.supabase.serviceRoleKey) {
      errors.push('SUPABASE_SERVICE_ROLE_KEY is required in production');
    }

    // Validate Supabase URL format
    if (
      !config.supabase.url.startsWith('https://') ||
      !config.supabase.url.includes('.supabase.co')
    ) {
      console.warn('⚠️  Warning: Supabase URL format seems incorrect');
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
    supabase: {
      url: config.supabase.url ? config.supabase.url.substring(0, 30) + '...' : 'not set',
      hasAnonKey: !!config.supabase.anonKey,
      hasServiceRoleKey: !!config.supabase.serviceRoleKey,
      realtimeEnabled: config.supabase.enableRealtime,
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
