/**
 * Pre-deployment validation script
 * Checks configuration and dependencies before deployment
 */

const { config, validateConfig } = require('./config/env');
const { logger } = require('./utils/logger');
const mongoose = require('mongoose');

async function validateEnvironment() {
  console.log('🔍 Validating environment configuration...\n');

  try {
    // 1. Validate configuration
    validateConfig();

    // 2. Test database connection
    console.log('📊 Testing database connection...');
    await mongoose.connect(config.database.uri);
    logger.info('Database connection successful');
    await mongoose.connection.close();

    // 3. Check required directories
    const fs = require('fs');
    const path = require('path');

    const requiredDirs = ['logs', 'uploads'];
    for (const dir of requiredDirs) {
      const dirPath = path.join(__dirname, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        logger.info(`Created directory: ${dir}`);
      }
    }

    // 4. Validate JWT secret strength (production only)
    if (config.isProduction) {
      if (config.auth.jwtSecret.length < 32) {
        throw new Error('JWT secret must be at least 32 characters in production');
      }
    }

    // 5. Environment-specific validations
    if (config.isProduction) {
      console.log('🚀 Production environment validations...');

      // Check MongoDB Atlas connection
      if (!config.database.uri.includes('mongodb+srv://')) {
        console.warn('⚠️  Warning: Not using MongoDB Atlas in production');
      }

      // Check HTTPS endpoints
      if (!config.cors.frontendUrl.startsWith('https://')) {
        console.warn('⚠️  Warning: Frontend URL is not HTTPS in production');
      }

      // Check secure cookies
      if (!config.session.cookieSecure) {
        console.warn('⚠️  Warning: Secure cookies not enabled in production');
      }
    }

    console.log('\n✅ Environment validation completed successfully!');
    console.log('\n📋 Configuration Summary:');
    console.log(`   Environment: ${config.nodeEnv}`);
    console.log(`   Port: ${config.port}`);
    console.log(
      `   Database: ${config.database.uri.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas'}`
    );
    console.log(`   Frontend URL: ${config.cors.frontendUrl}`);
    console.log(`   Log Level: ${config.logging.level}`);
    console.log(
      `   Features: Registration=${config.features.enableUserRegistration}, Groups=${config.features.enableStudyGroupCreation}, Matching=${config.features.enableMatchingService}`
    );

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Environment validation failed:');
    console.error(`   ${error.message}`);
    console.error('\nPlease fix the configuration and try again.');
    process.exit(1);
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateEnvironment();
}

module.exports = { validateEnvironment };
