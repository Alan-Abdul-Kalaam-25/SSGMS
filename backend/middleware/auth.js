const { getSupabase } = require('../config/supabase');

// Middleware to verify Supabase JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    if (!token) {
      return res.status(401).json({
        message: 'Access denied. Invalid token format.',
      });
    }

    const supabase = getSupabase();

    // Verify the JWT token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        message: 'Access denied. Invalid token.',
      });
    }

    // Get additional user profile data from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Error fetching user profile:', profileError);
      return res.status(500).json({
        message: 'Error fetching user profile.',
      });
    }

    // Combine Supabase user data with profile data
    req.user = {
      id: user.id,
      email: user.email,
      emailConfirmed: user.email_confirmed_at !== null,
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at,
      ...profile, // Merge profile data if it exists
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      message: 'Internal server error during authentication.',
    });
  }
};

// Middleware to check if user profile is complete
const requireCompleteProfile = (req, res, next) => {
  if (!req.user.profileCompleted) {
    return res.status(403).json({
      message: 'Please complete your profile before accessing this feature.',
      profileCompleted: false,
    });
  }
  next();
};

// Middleware for optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    if (!token) {
      return next();
    }

    const supabase = getSupabase();

    // Verify the JWT token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (!error && user) {
      // Get additional user profile data from the profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Combine Supabase user data with profile data
      req.user = {
        id: user.id,
        email: user.email,
        emailConfirmed: user.email_confirmed_at !== null,
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
        ...profile, // Merge profile data if it exists
      };
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};

module.exports = {
  authMiddleware,
  requireCompleteProfile,
  optionalAuth,
};
