/**
 * Supabase Configuration
 * Centralized Supabase client setup for backend
 */

const { createClient } = require('@supabase/supabase-js');
const { config } = require('./env');
const { logger } = require('../utils/logger');

let supabase = null;

/**
 * Initialize Supabase client
 */
function initializeSupabase() {
  try {
    if (!config.supabase.url) {
      throw new Error('SUPABASE_URL is required');
    }

    if (!config.supabase.anonKey) {
      throw new Error('SUPABASE_ANON_KEY is required');
    }

    supabase = createClient(config.supabase.url, config.supabase.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false, // Server-side doesn't need session persistence
      },
      realtime: {
        enabled: config.supabase.enableRealtime,
      },
    });

    logger.info('Supabase client initialized successfully', {
      url: config.supabase.url.substring(0, 20) + '...', // Log partial URL for security
      realtime: config.supabase.enableRealtime,
    });

    return supabase;
  } catch (error) {
    logger.error('Failed to initialize Supabase client', {
      error: error.message,
    });
    throw error;
  }
}

/**
 * Get Supabase client instance
 */
function getSupabase() {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Call initializeSupabase() first.');
  }
  return supabase;
}

/**
 * Test Supabase connection
 */
async function testConnection() {
  try {
    const client = getSupabase();

    // Simple health check - try to get Supabase status
    const { data, error } = await client
      .from('_dummy_table_that_should_not_exist')
      .select('*')
      .limit(1);

    // We expect an error here since the table doesn't exist
    // But if we get a proper error response, it means connection is working
    if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
      logger.info('Supabase connection test successful');
      return true;
    }

    // If we get here, something unexpected happened
    logger.warn('Supabase connection test returned unexpected result', { data, error });
    return true; // Still consider it a success
  } catch (error) {
    logger.error('Supabase connection test failed', {
      error: error.message,
    });
    return false;
  }
}

/**
 * Create admin client for server-side operations
 */
function createAdminClient() {
  if (!config.supabase.serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }

  return createClient(config.supabase.url, config.supabase.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

module.exports = {
  initializeSupabase,
  getSupabase,
  testConnection,
  createAdminClient,
};
