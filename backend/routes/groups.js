const express = require('express');
const { getSupabase } = require('../config/supabase');
const { authMiddleware, requireCompleteProfile } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const router = express.Router();

// @route   GET /api/groups
// @desc    Get all study groups (with filters)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { subject, experienceLevel, studyStyle, status = 'active' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { status };

    // Add filters
    if (subject) {
      query.subject = new RegExp(subject, 'i');
    }
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }
    if (studyStyle) {
      query.studyStyle = studyStyle;
    }

    const groups = await StudyGroup.find(query)
      .populate('creator', 'name university')
      .populate('members.user', 'name university')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalGroups = await StudyGroup.countDocuments(query);

    res.json({
      groups,
      currentPage: page,
      totalPages: Math.ceil(totalGroups / limit),
      totalGroups,
      hasNextPage: page < Math.ceil(totalGroups / limit),
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({
      message: 'Error retrieving study groups',
    });
  }
});

// @route   GET /api/groups/my-groups
// @desc    Get current user's study groups
// @access  Private
router.get('/my-groups', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await StudyGroup.find({
      $or: [{ creator: userId }, { 'members.user': userId }],
    })
      .populate('creator', 'name university')
      .populate('members.user', 'name university')
      .sort({ createdAt: -1 });

    res.json({
      groups,
    });
  } catch (error) {
    console.error('Get my groups error:', error);
    res.status(500).json({
      message: 'Error retrieving your study groups',
    });
  }
});

// @route   GET /api/groups/:groupId
// @desc    Get study group by ID
// @access  Private
router.get('/:groupId', authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await StudyGroup.findById(groupId)
      .populate('creator', 'name university year major')
      .populate('members.user', 'name university year major')
      .populate('joinRequests.user', 'name university year major');

    if (!group) {
      return res.status(404).json({
        message: 'Study group not found',
      });
    }

    res.json({
      group,
    });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({
      message: 'Error retrieving study group',
    });
  }
});

// @route   POST /api/groups
// @desc    Create a new study group
// @access  Private
router.post('/', authMiddleware, requireCompleteProfile, async (req, res) => {
  try {
    const {
      name,
      description,
      subject,
      tags,
      maxMembers,
      experienceLevel,
      studyStyle,
      studyGoals,
      schedule,
      location,
      isPrivate,
      requiresApproval,
    } = req.body;

    const userId = req.user._id;

    // Validation
    if (!name || !subject) {
      return res.status(400).json({
        message: 'Group name and subject are required',
      });
    }

    const group = new StudyGroup({
      name: name.trim(),
      description: description?.trim(),
      subject: subject.trim(),
      tags: tags || [],
      creator: userId,
      maxMembers: maxMembers || 6,
      experienceLevel: experienceLevel || 'mixed',
      studyStyle: studyStyle || 'mixed',
      studyGoals: studyGoals || [],
      schedule: schedule || {},
      location: location || {},
      isPrivate: isPrivate || false,
      requiresApproval: requiresApproval || false,
    });

    await group.save();

    // Add creator to the group as admin
    group.addMember(userId, 'admin');
    await group.save();

    // Add group to user's studyGroups array
    await User.findByIdAndUpdate(userId, {
      $push: { studyGroups: group._id },
    });

    const populatedGroup = await StudyGroup.findById(group._id)
      .populate('creator', 'name university')
      .populate('members.user', 'name university');

    res.status(201).json({
      message: 'Study group created successfully',
      group: populatedGroup,
    });
  } catch (error) {
    console.error('Create group error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors,
      });
    }

    res.status(500).json({
      message: 'Error creating study group',
    });
  }
});

// @route   POST /api/groups/:groupId/join
// @desc    Join a study group
// @access  Private
router.post('/:groupId/join', authMiddleware, requireCompleteProfile, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { message } = req.body; // Optional message for join request
    const userId = req.user._id;

    const group = await StudyGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: 'Study group not found',
      });
    }

    if (group.status !== 'active') {
      return res.status(400).json({
        message: 'Cannot join inactive study group',
      });
    }

    if (group.isFull()) {
      return res.status(400).json({
        message: 'Study group is full',
      });
    }

    if (group.isMember(userId)) {
      return res.status(400).json({
        message: 'You are already a member of this group',
      });
    }

    // Check if group requires approval
    if (group.requiresApproval) {
      // Check if there's already a pending request
      const existingRequest = group.joinRequests.find(
        req => req.user.toString() === userId.toString() && req.status === 'pending'
      );

      if (existingRequest) {
        return res.status(400).json({
          message: 'You already have a pending join request for this group',
        });
      }

      // Add join request
      group.joinRequests.push({
        user: userId,
        message: message || '',
        status: 'pending',
      });

      await group.save();

      res.json({
        message: 'Join request submitted successfully. Waiting for approval.',
      });
    } else {
      // Join immediately
      group.addMember(userId);
      await group.save();

      // Add group to user's studyGroups array
      await User.findByIdAndUpdate(userId, {
        $push: { studyGroups: groupId },
      });

      res.json({
        message: 'Successfully joined the study group',
      });
    }
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({
      message: 'Error joining study group',
    });
  }
});

// @route   POST /api/groups/:groupId/leave
// @desc    Leave a study group
// @access  Private
router.post('/:groupId/leave', authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await StudyGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: 'Study group not found',
      });
    }

    if (!group.isMember(userId)) {
      return res.status(400).json({
        message: 'You are not a member of this group',
      });
    }

    // Creator cannot leave their own group (they must transfer ownership or delete)
    if (group.creator.toString() === userId.toString()) {
      return res.status(400).json({
        message: 'Group creator cannot leave. Please transfer ownership or delete the group.',
      });
    }

    // Remove member from group
    group.removeMember(userId);
    await group.save();

    // Remove group from user's studyGroups array
    await User.findByIdAndUpdate(userId, {
      $pull: { studyGroups: groupId },
    });

    res.json({
      message: 'Successfully left the study group',
    });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({
      message: 'Error leaving study group',
    });
  }
});

// @route   PUT /api/groups/:groupId
// @desc    Update study group (admin only)
// @access  Private
router.put('/:groupId', authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;
    const updates = req.body;

    const group = await StudyGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: 'Study group not found',
      });
    }

    // Check if user is admin
    if (!group.isAdmin(userId)) {
      return res.status(403).json({
        message: 'Only group admins can update group settings',
      });
    }

    // Fields that can be updated
    const allowedUpdates = [
      'name',
      'description',
      'subject',
      'tags',
      'maxMembers',
      'experienceLevel',
      'studyStyle',
      'studyGoals',
      'schedule',
      'location',
      'isPrivate',
      'requiresApproval',
    ];

    // Filter updates
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({
        message: 'No valid fields provided for update',
      });
    }

    const updatedGroup = await StudyGroup.findByIdAndUpdate(groupId, filteredUpdates, {
      new: true,
      runValidators: true,
    })
      .populate('creator', 'name university')
      .populate('members.user', 'name university');

    res.json({
      message: 'Study group updated successfully',
      group: updatedGroup,
    });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({
      message: 'Error updating study group',
    });
  }
});

// @route   POST /api/groups/match
// @desc    Find study group and partner matches for user
// @access  Private
router.post('/match', authMiddleware, requireCompleteProfile, async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      includeGroups = true,
      includeUsers = true,
      maxResults = 20,
      minScore = 60,
      refresh = false,
    } = req.body;

    const results = await matchingService.findMatches(userId, {
      includeGroups,
      includeUsers,
      maxResults,
      minScore,
      refresh,
    });

    res.json({
      message: 'Matches found successfully',
      matches: results.matches,
      fromCache: results.fromCache,
      generatedAt: results.generatedAt,
      processingTime: results.processingTime,
    });
  } catch (error) {
    console.error('Find matches error:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === 'User profile must be completed before finding matches') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: 'Error finding matches',
    });
  }
});

// @route   GET /api/groups/suggestions
// @desc    Get study group formation suggestions
// @access  Private
router.get('/suggestions', authMiddleware, requireCompleteProfile, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find users with similar interests who aren't in groups yet
    const similarUsers = await User.find({
      _id: { $ne: userId },
      isActive: true,
      profileCompleted: true,
      subjects: { $in: req.user.subjects },
      studyGroups: { $size: 0 }, // Users not in any groups yet
    })
      .select('name university subjects studyGoals experienceLevel studyStyle availability')
      .limit(20);

    // Generate group suggestions
    const suggestions = [];

    // Group by subjects
    const subjectGroups = {};
    req.user.subjects.forEach(subject => {
      const usersForSubject = similarUsers.filter(user => user.subjects.includes(subject));

      if (usersForSubject.length >= 2) {
        subjectGroups[subject] = usersForSubject.slice(0, 5); // Max 5 suggestions per subject
      }
    });

    Object.entries(subjectGroups).forEach(([subject, users]) => {
      suggestions.push({
        subject,
        suggestedPartners: users,
        reason: `Found ${users.length} students interested in ${subject}`,
        compatibilityEstimate: 75, // Simplified for now
      });
    });

    res.json({
      suggestions,
      count: suggestions.length,
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      message: 'Error generating group suggestions',
    });
  }
});

module.exports = router;
