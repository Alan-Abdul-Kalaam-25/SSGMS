const { User, StudyGroup, MatchResult } = require("../models");

/**
 * Advanced matching service for finding compatible study partners and groups
 */
class MatchingService {
  constructor() {
    this.weights = {
      subject: 0.3, // 30% - Most important factor
      schedule: 0.25, // 25% - Very important for actual meetings
      experience: 0.2, // 20% - Important for learning level
      studyStyle: 0.15, // 15% - Learning approach compatibility
      goals: 0.1, // 10% - Nice to have alignment
    };
  }

  /**
   * Find matches for a user
   * @param {ObjectId} userId - User ID to find matches for
   * @param {Object} options - Matching options
   * @returns {Object} - Match results
   */
  async findMatches(userId, options = {}) {
    try {
      const {
        includeGroups = true,
        includeUsers = true,
        maxResults = 20,
        minScore = 60,
        refresh = false,
      } = options;

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (!user.profileCompleted) {
        throw new Error(
          "User profile must be completed before finding matches"
        );
      }

      // Check for existing recent results (unless refresh is requested)
      if (!refresh) {
        const existingResults = await MatchResult.findOne({
          user: userId,
          status: "active",
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
        }).populate("matches.group matches.user");

        if (existingResults) {
          return {
            matches: existingResults.matches.filter((m) => !m.dismissed),
            fromCache: true,
            generatedAt: existingResults.createdAt,
          };
        }
      }

      const startTime = Date.now();
      const matches = [];

      // Find user matches
      if (includeUsers) {
        const userMatches = await this.findUserMatches(user, {
          maxResults: Math.floor(maxResults * 0.6),
          minScore,
        });
        matches.push(...userMatches);
      }

      // Find group matches
      if (includeGroups) {
        const groupMatches = await this.findGroupMatches(user, {
          maxResults: Math.floor(maxResults * 0.4),
          minScore,
        });
        matches.push(...groupMatches);
      }

      // Sort all matches by compatibility score
      matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      // Limit to maxResults
      const finalMatches = matches.slice(0, maxResults);

      // Save results to database
      const matchResult = new MatchResult({
        user: userId,
        matches: finalMatches,
        searchCriteria: this.extractSearchCriteria(user),
        algorithmVersion: "2.0",
        processingTime: Date.now() - startTime,
        totalCandidates: matches.length,
      });

      await matchResult.save();

      return {
        matches: finalMatches,
        fromCache: false,
        generatedAt: new Date(),
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      console.error("Matching service error:", error);
      throw error;
    }
  }

  /**
   * Find compatible users for study partnerships
   * @param {Object} user - User object
   * @param {Object} options - Search options
   * @returns {Array} - Array of user matches
   */
  async findUserMatches(user, options = {}) {
    const { maxResults = 10, minScore = 60 } = options;

    // Build query for potential matches
    const query = {
      _id: { $ne: user._id }, // Exclude self
      isActive: true,
      profileCompleted: true,
      // Must have at least one common subject
      subjects: { $in: user.subjects },
    };

    // Add university filter (prefer same university)
    if (user.university) {
      query.university = user.university;
    }

    const candidates = await User.find(query)
      .select(
        "name university year major subjects studyGoals experienceLevel studyStyle availability"
      )
      .limit(maxResults * 3) // Get more candidates to filter from
      .lean();

    const matches = [];

    for (const candidate of candidates) {
      const compatibility = this.calculateUserCompatibility(user, candidate);

      if (compatibility.compatibilityScore >= minScore) {
        matches.push({
          user: candidate._id,
          matchType: "potential_partner",
          compatibilityScore: compatibility.compatibilityScore,
          matchFactors: compatibility.factors,
          reasons: compatibility.reasons,
        });
      }
    }

    return matches
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, maxResults);
  }

  /**
   * Find compatible study groups
   * @param {Object} user - User object
   * @param {Object} options - Search options
   * @returns {Array} - Array of group matches
   */
  async findGroupMatches(user, options = {}) {
    const { maxResults = 10, minScore = 60 } = options;

    // Build query for active groups with available spots
    const query = {
      status: "active",
      // Must have available spots
      $expr: { $lt: [{ $size: "$members" }, "$maxMembers"] },
      // Must share at least one subject
      subject: { $in: user.subjects },
      // User not already a member
      "members.user": { $ne: user._id },
    };

    const groups = await StudyGroup.find(query)
      .populate("creator", "name university year major subjects")
      .populate(
        "members.user",
        "name university year major subjects studyGoals experienceLevel studyStyle availability"
      )
      .limit(maxResults * 2)
      .lean();

    const matches = [];

    for (const group of groups) {
      const compatibility = this.calculateGroupCompatibility(user, group);

      if (compatibility.compatibilityScore >= minScore) {
        matches.push({
          group: group._id,
          matchType: "existing_group",
          compatibilityScore: compatibility.compatibilityScore,
          matchFactors: compatibility.factors,
          reasons: compatibility.reasons,
        });
      }
    }

    return matches
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, maxResults);
  }

  /**
   * Calculate compatibility between two users
   * @param {Object} user1 - First user
   * @param {Object} user2 - Second user
   * @returns {Object} - Compatibility analysis
   */
  calculateUserCompatibility(user1, user2) {
    const factors = {};
    let totalScore = 0;

    // Subject compatibility
    const commonSubjects = this.findCommonElements(
      user1.subjects,
      user2.subjects
    );
    const subjectScore = this.calculateSubjectScore(
      user1.subjects,
      user2.subjects,
      commonSubjects
    );
    factors.subjectMatch = {
      score: subjectScore,
      weight: this.weights.subject * 100,
      commonSubjects,
    };
    totalScore += subjectScore * this.weights.subject;

    // Schedule compatibility
    const scheduleAnalysis = this.calculateScheduleCompatibility(
      user1.availability,
      user2.availability
    );
    factors.scheduleMatch = {
      score: scheduleAnalysis.score,
      weight: this.weights.schedule * 100,
      commonTimeSlots: scheduleAnalysis.commonSlots,
    };
    totalScore += scheduleAnalysis.score * this.weights.schedule;

    // Experience level compatibility
    const experienceScore = this.calculateExperienceCompatibility(
      user1.experienceLevel,
      user2.experienceLevel
    );
    factors.experienceMatch = {
      score: experienceScore,
      weight: this.weights.experience * 100,
      levelCompatibility: this.getExperienceCompatibilityDescription(
        user1.experienceLevel,
        user2.experienceLevel
      ),
    };
    totalScore += experienceScore * this.weights.experience;

    // Study style compatibility
    const styleScore = this.calculateStudyStyleCompatibility(
      user1.studyStyle,
      user2.studyStyle
    );
    factors.studyStyleMatch = {
      score: styleScore,
      weight: this.weights.studyStyle * 100,
      styleCompatibility: this.getStyleCompatibilityDescription(
        user1.studyStyle,
        user2.studyStyle
      ),
    };
    totalScore += styleScore * this.weights.studyStyle;

    // Study goals compatibility
    const commonGoals = this.findCommonElements(
      user1.studyGoals,
      user2.studyGoals
    );
    const goalsScore = this.calculateGoalsScore(
      user1.studyGoals,
      user2.studyGoals,
      commonGoals
    );
    factors.goalMatch = {
      score: goalsScore,
      weight: this.weights.goals * 100,
      commonGoals,
    };
    totalScore += goalsScore * this.weights.goals;

    const finalScore = Math.round(totalScore);
    const reasons = this.generateMatchReasons(factors, finalScore, "user");

    return {
      compatibilityScore: Math.min(finalScore, 100),
      factors,
      reasons,
    };
  }

  /**
   * Calculate compatibility between user and group
   * @param {Object} user - User object
   * @param {Object} group - Group object
   * @returns {Object} - Compatibility analysis
   */
  calculateGroupCompatibility(user, group) {
    const factors = {};
    let totalScore = 0;

    // Subject compatibility
    const userSubjects = user.subjects || [];
    const groupSubject = group.subject;
    const subjectMatch = userSubjects.includes(groupSubject);
    const subjectScore = subjectMatch ? 100 : 0;

    factors.subjectMatch = {
      score: subjectScore,
      weight: this.weights.subject * 100,
      commonSubjects: subjectMatch ? [groupSubject] : [],
    };
    totalScore += subjectScore * this.weights.subject;

    // Group member compatibility (average with existing members)
    const members = group.members.map((m) => m.user).filter(Boolean);
    let memberCompatibilitySum = 0;
    let memberCount = 0;

    members.forEach((member) => {
      if (member.subjects) {
        const memberCompatibility = this.calculateUserCompatibility(
          user,
          member
        );
        memberCompatibilitySum += memberCompatibility.compatibilityScore;
        memberCount++;
      }
    });

    const avgMemberCompatibility =
      memberCount > 0 ? memberCompatibilitySum / memberCount : 75;

    // Schedule compatibility with group schedule
    const scheduleScore = this.calculateGroupScheduleCompatibility(
      user.availability,
      group.schedule
    );
    factors.scheduleMatch = {
      score: scheduleScore,
      weight: this.weights.schedule * 100,
      commonTimeSlots: this.getGroupScheduleOverlap(
        user.availability,
        group.schedule
      ),
    };
    totalScore += scheduleScore * this.weights.schedule;

    // Experience level compatibility
    const experienceScore = this.calculateExperienceCompatibility(
      user.experienceLevel,
      group.experienceLevel
    );
    factors.experienceMatch = {
      score: experienceScore,
      weight: this.weights.experience * 100,
      levelCompatibility: this.getExperienceCompatibilityDescription(
        user.experienceLevel,
        group.experienceLevel
      ),
    };
    totalScore += experienceScore * this.weights.experience;

    // Study style compatibility
    const styleScore = this.calculateStudyStyleCompatibility(
      user.studyStyle,
      group.studyStyle
    );
    factors.studyStyleMatch = {
      score: styleScore,
      weight: this.weights.studyStyle * 100,
      styleCompatibility: this.getStyleCompatibilityDescription(
        user.studyStyle,
        group.studyStyle
      ),
    };
    totalScore += styleScore * this.weights.studyStyle;

    // Study goals compatibility
    const commonGoals = this.findCommonElements(
      user.studyGoals,
      group.studyGoals
    );
    const goalsScore = this.calculateGoalsScore(
      user.studyGoals,
      group.studyGoals,
      commonGoals
    );
    factors.goalMatch = {
      score: goalsScore,
      weight: this.weights.goals * 100,
      commonGoals,
    };
    totalScore += goalsScore * this.weights.goals;

    // Adjust score based on group size and member compatibility
    const groupSizeBonus = this.calculateGroupSizeBonus(
      group.members.length,
      group.maxMembers,
      user.preferredGroupSize
    );
    totalScore =
      totalScore * 0.8 + avgMemberCompatibility * 0.1 + groupSizeBonus * 0.1;

    const finalScore = Math.round(totalScore);
    const reasons = this.generateMatchReasons(factors, finalScore, "group", {
      groupName: group.name,
      memberCount: group.members.length,
      maxMembers: group.maxMembers,
    });

    return {
      compatibilityScore: Math.min(finalScore, 100),
      factors,
      reasons,
    };
  }

  // Helper methods for compatibility calculations
  findCommonElements(arr1 = [], arr2 = []) {
    return arr1.filter((item) => arr2.includes(item));
  }

  calculateSubjectScore(subjects1, subjects2, commonSubjects) {
    if (!subjects1?.length || !subjects2?.length) return 0;
    if (commonSubjects.length === 0) return 0;

    const maxSubjects = Math.max(subjects1.length, subjects2.length);
    return Math.round((commonSubjects.length / maxSubjects) * 100);
  }

  calculateScheduleCompatibility(availability1 = {}, availability2 = {}) {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const timeSlots = ["morning", "afternoon", "evening"];

    let commonSlots = 0;
    let totalUserSlots = 0;
    const commonSlotNames = [];

    days.forEach((day) => {
      timeSlots.forEach((slot) => {
        const user1Available = availability1[day]?.[slot] || false;
        const user2Available = availability2[day]?.[slot] || false;

        if (user1Available) totalUserSlots++;

        if (user1Available && user2Available) {
          commonSlots++;
          commonSlotNames.push(
            `${day.charAt(0).toUpperCase() + day.slice(1)} ${slot}`
          );
        }
      });
    });

    const score =
      totalUserSlots > 0
        ? Math.round((commonSlots / totalUserSlots) * 100)
        : 50;

    return {
      score,
      commonSlots: commonSlotNames,
    };
  }

  calculateExperienceCompatibility(level1, level2) {
    if (level1 === level2) return 100;
    if (level1 === "mixed" || level2 === "mixed") return 85;

    const levels = { beginner: 1, intermediate: 2, advanced: 3 };
    const diff = Math.abs((levels[level1] || 2) - (levels[level2] || 2));

    if (diff === 1) return 70;
    return 50;
  }

  calculateStudyStyleCompatibility(style1, style2) {
    if (style1 === style2) return 100;
    if (style1 === "mixed" || style2 === "mixed") return 80;
    return 60;
  }

  calculateGoalsScore(goals1 = [], goals2 = [], commonGoals) {
    if (!goals1.length || !goals2.length) return 50;
    if (commonGoals.length === 0) return 30;

    const maxGoals = Math.max(goals1.length, goals2.length);
    return Math.round((commonGoals.length / maxGoals) * 100);
  }

  calculateGroupScheduleCompatibility(userAvailability, groupSchedule) {
    if (!groupSchedule?.dayOfWeek || !groupSchedule?.timeSlot) return 75;

    const userSlot =
      userAvailability[groupSchedule.dayOfWeek]?.[groupSchedule.timeSlot];
    return userSlot ? 100 : 0;
  }

  getGroupScheduleOverlap(userAvailability, groupSchedule) {
    if (!groupSchedule?.dayOfWeek || !groupSchedule?.timeSlot) return [];

    const userSlot =
      userAvailability[groupSchedule.dayOfWeek]?.[groupSchedule.timeSlot];
    if (userSlot) {
      return [
        `${
          groupSchedule.dayOfWeek.charAt(0).toUpperCase() +
          groupSchedule.dayOfWeek.slice(1)
        } ${groupSchedule.timeSlot}`,
      ];
    }
    return [];
  }

  calculateGroupSizeBonus(currentSize, maxSize, userPreference) {
    const availableSpots = maxSize - currentSize;
    if (availableSpots <= 0) return 0;

    const sizePreferences = { small: 3, medium: 5, large: 8 };
    const preferredSize = sizePreferences[userPreference] || 5;

    const futureSize = currentSize + 1;
    const sizeDiff = Math.abs(futureSize - preferredSize);

    return Math.max(0, 100 - sizeDiff * 15);
  }

  getExperienceCompatibilityDescription(level1, level2) {
    if (level1 === level2) return "Same experience level";
    if (level1 === "mixed" || level2 === "mixed")
      return "Flexible experience matching";
    return "Different experience levels";
  }

  getStyleCompatibilityDescription(style1, style2) {
    if (style1 === style2) return "Matching study approaches";
    if (style1 === "mixed" || style2 === "mixed")
      return "Adaptable study styles";
    return "Different study approaches";
  }

  generateMatchReasons(factors, score, matchType, extra = {}) {
    const reasons = [];

    if (factors.subjectMatch.commonSubjects.length > 0) {
      reasons.push(
        `Common subjects: ${factors.subjectMatch.commonSubjects.join(", ")}`
      );
    }

    if (factors.scheduleMatch.commonTimeSlots.length >= 2) {
      reasons.push(
        `${factors.scheduleMatch.commonTimeSlots.length} overlapping time slots`
      );
    }

    if (factors.experienceMatch.score >= 85) {
      reasons.push("Compatible experience levels");
    }

    if (factors.studyStyleMatch.score >= 85) {
      reasons.push("Matching study styles");
    }

    if (matchType === "group" && extra.groupName) {
      reasons.push(
        `${extra.memberCount}/${extra.maxMembers} members in ${extra.groupName}`
      );
    }

    if (score >= 85) {
      reasons.push("Excellent compatibility for productive collaboration");
    } else if (score >= 70) {
      reasons.push("Good potential for effective study partnership");
    }

    return reasons.slice(0, 3);
  }

  extractSearchCriteria(user) {
    return {
      subjects: user.subjects || [],
      experienceLevel: user.experienceLevel,
      studyStyle: user.studyStyle,
      preferredGroupSize: user.preferredGroupSize,
      availability: user.availability,
      studyGoals: user.studyGoals || [],
    };
  }

  /**
   * Clean up expired match results
   */
  static async cleanupExpiredResults() {
    try {
      const result = await MatchResult.deleteMany({
        $or: [{ status: "expired" }, { expiresAt: { $lt: new Date() } }],
      });

      console.log(`Cleaned up ${result.deletedCount} expired match results`);
      return result.deletedCount;
    } catch (error) {
      console.error("Error cleaning up expired results:", error);
      throw error;
    }
  }
}

module.exports = MatchingService;
