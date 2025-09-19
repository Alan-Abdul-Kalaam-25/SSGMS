const express = require('express');
const { getSupabase } = require('../config/supabase');
const { authMiddleware, requireCompleteProfile } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const router = express.Router();

// @route   GET /api/users/profile/:userId
// @desc    Get user profile by ID (public info only)
// @access  Private
router.get('/profile/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const supabase = getSupabase();

    // Get user profile from profiles table
    const { data: user, error } = await supabase
      .from('profiles')
      .select(
        `
        id,
        first_name,
        last_name,
        university,
        field_of_study,
        year_of_study,
        bio,
        profile_completed,
        created_at
      `
      )
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    logger.errorWithStack('Get user profile error', error);
    res.status(500).json({
      message: 'Error retrieving user profile',
    });
  }
});

// @route   GET /api/users/search
// @desc    Search for users with similar interests
// @access  Private
router.get('/search', authMiddleware, requireCompleteProfile, async (req, res) => {
  try {
    const { subjects, experienceLevel, studyStyle, university } = req.query;
    const currentUserId = req.user._id;

    let query = {
      _id: { $ne: currentUserId }, // Exclude current user
      isActive: true,
      profileCompleted: true,
    };

    // Add filters based on query parameters
    if (subjects) {
      const subjectArray = subjects.split(',').map(s => s.trim());
      query.subjects = { $in: subjectArray };
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (studyStyle) {
      query.studyStyle = studyStyle;
    }

    if (university) {
      query.university = new RegExp(university, 'i'); // Case insensitive
    }

    const users = await User.find(query)
      .select('name university year major subjects studyGoals experienceLevel studyStyle')
      .limit(20)
      .sort({ createdAt: -1 });

    res.json({
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({
      message: 'Error searching users',
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('studyGroups');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const activeGroups = user.studyGroups.filter(group => group.status === 'active');
    const completedGroups = user.studyGroups.filter(group => group.status === 'completed');

    // Calculate total study hours across all groups
    let totalStudyHours = 0;
    user.studyGroups.forEach(group => {
      totalStudyHours += group.totalStudyHours || 0;
    });

    const stats = {
      totalGroups: user.studyGroups.length,
      activeGroups: activeGroups.length,
      completedGroups: completedGroups.length,
      totalStudyHours: Math.round(totalStudyHours * 10) / 10, // Round to 1 decimal
      profileCompletionRate: user.isProfileComplete() ? 100 : 75, // Simplified calculation
      joinDate: user.createdAt,
      lastActive: user.lastLogin,
    };

    res.json({
      stats,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      message: 'Error retrieving user statistics',
    });
  }
});

module.exports = router;
