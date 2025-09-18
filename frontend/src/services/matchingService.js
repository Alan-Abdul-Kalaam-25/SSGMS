// Simple matching algorithm for study groups
// This is a basic implementation that can be enhanced later

/**
 * Calculate compatibility score between two users or user and group
 * @param {Object} user1 - First user object
 * @param {Object} user2 - Second user/group object
 * @returns {Object} - Match result with score and details
 */
const calculateCompatibilityScore = (user1, user2) => {
  let totalScore = 0;
  let maxScore = 0;
  const factors = {};

  // Subject compatibility (30% weight)
  const subjectWeight = 30;
  const commonSubjects =
    user1.subjects?.filter((subject) => user2.subjects?.includes(subject)) ||
    [];
  const subjectScore =
    commonSubjects.length > 0
      ? (commonSubjects.length /
          Math.max(user1.subjects?.length || 1, user2.subjects?.length || 1)) *
        100
      : 0;

  factors.subjectMatch = {
    score: Math.round(subjectScore),
    weight: subjectWeight,
    commonSubjects,
  };
  totalScore += subjectScore * (subjectWeight / 100);
  maxScore += subjectWeight;

  // Experience level compatibility (20% weight)
  const experienceWeight = 20;
  let experienceScore = 0;
  if (user1.experienceLevel === user2.experienceLevel) {
    experienceScore = 100;
  } else if (
    user1.experienceLevel === "mixed" ||
    user2.experienceLevel === "mixed"
  ) {
    experienceScore = 80;
  } else {
    // Different levels can still work together
    experienceScore = 50;
  }

  factors.experienceMatch = {
    score: experienceScore,
    weight: experienceWeight,
    levelCompatibility:
      user1.experienceLevel === user2.experienceLevel ? "same" : "different",
  };
  totalScore += experienceScore * (experienceWeight / 100);
  maxScore += experienceWeight;

  // Study style compatibility (20% weight)
  const styleWeight = 20;
  let styleScore = 0;
  if (user1.studyStyle === user2.studyStyle) {
    styleScore = 100;
  } else if (user1.studyStyle === "mixed" || user2.studyStyle === "mixed") {
    styleScore = 85;
  } else {
    styleScore = 60;
  }

  factors.studyStyleMatch = {
    score: styleScore,
    weight: styleWeight,
    styleCompatibility:
      user1.studyStyle === user2.studyStyle ? "same" : "different",
  };
  totalScore += styleScore * (styleWeight / 100);
  maxScore += styleWeight;

  // Schedule compatibility (20% weight)
  const scheduleWeight = 20;
  const scheduleScore = calculateScheduleCompatibility(
    user1.availability,
    user2.availability
  );

  factors.scheduleMatch = {
    score: Math.round(scheduleScore),
    weight: scheduleWeight,
    commonTimeSlots: getCommonTimeSlots(user1.availability, user2.availability),
  };
  totalScore += scheduleScore * (scheduleWeight / 100);
  maxScore += scheduleWeight;

  // Study goals compatibility (10% weight)
  const goalsWeight = 10;
  const commonGoals =
    user1.studyGoals?.filter((goal) => user2.studyGoals?.includes(goal)) || [];
  const goalsScore =
    commonGoals.length > 0
      ? (commonGoals.length /
          Math.max(
            user1.studyGoals?.length || 1,
            user2.studyGoals?.length || 1
          )) *
        100
      : 50; // Default score if no goals specified

  factors.goalMatch = {
    score: Math.round(goalsScore),
    weight: goalsWeight,
    commonGoals,
  };
  totalScore += goalsScore * (goalsWeight / 100);
  maxScore += goalsWeight;

  const finalScore = Math.round((totalScore / maxScore) * 100);

  return {
    compatibilityScore: Math.min(finalScore, 100),
    factors,
    reasons: generateMatchReasons(factors, finalScore),
  };
};

/**
 * Calculate schedule compatibility between two availability objects
 * @param {Object} availability1 - First user's availability
 * @param {Object} availability2 - Second user's availability
 * @returns {number} - Compatibility score (0-100)
 */
const calculateScheduleCompatibility = (availability1, availability2) => {
  if (!availability1 || !availability2) return 50; // Default score if no availability data

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
  let totalPossibleSlots = 0;

  days.forEach((day) => {
    timeSlots.forEach((slot) => {
      const user1Available = availability1[day]?.[slot] || false;
      const user2Available = availability2[day]?.[slot] || false;

      if (user1Available && user2Available) {
        commonSlots++;
      }

      if (user1Available || user2Available) {
        totalPossibleSlots++;
      }
    });
  });

  if (totalPossibleSlots === 0) return 50; // No availability data

  return (commonSlots / totalPossibleSlots) * 100;
};

/**
 * Get common time slots between two users
 * @param {Object} availability1 - First user's availability
 * @param {Object} availability2 - Second user's availability
 * @returns {Array} - Array of common time slots
 */
const getCommonTimeSlots = (availability1, availability2) => {
  if (!availability1 || !availability2) return [];

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
  const commonSlots = [];

  days.forEach((day) => {
    timeSlots.forEach((slot) => {
      const user1Available = availability1[day]?.[slot] || false;
      const user2Available = availability2[day]?.[slot] || false;

      if (user1Available && user2Available) {
        commonSlots.push(`${day} ${slot}`);
      }
    });
  });

  return commonSlots;
};

/**
 * Generate human-readable reasons for the match
 * @param {Object} factors - Match factors object
 * @param {number} score - Overall compatibility score
 * @returns {Array} - Array of reason strings
 */
const generateMatchReasons = (factors, score) => {
  const reasons = [];

  if (factors.subjectMatch.commonSubjects.length > 0) {
    reasons.push(
      `You both study ${factors.subjectMatch.commonSubjects.join(", ")}`
    );
  }

  if (factors.experienceMatch.score >= 80) {
    reasons.push("Similar experience levels for effective collaboration");
  }

  if (factors.studyStyleMatch.score >= 80) {
    reasons.push("Compatible study approaches and methods");
  }

  if (factors.scheduleMatch.commonTimeSlots.length >= 3) {
    reasons.push("Multiple overlapping time slots for study sessions");
  }

  if (factors.goalMatch.commonGoals.length > 0) {
    reasons.push(
      `Shared study goals: ${factors.goalMatch.commonGoals.join(", ")}`
    );
  }

  if (score >= 80) {
    reasons.push(
      "Highly compatible match with strong potential for productive collaboration"
    );
  } else if (score >= 60) {
    reasons.push("Good compatibility with room for mutual learning");
  }

  return reasons.slice(0, 3); // Limit to top 3 reasons
};

/**
 * Find matches for a user from a list of candidates
 * @param {Object} user - User looking for matches
 * @param {Array} candidates - Array of potential matches (users or groups)
 * @param {Object} options - Matching options
 * @returns {Array} - Array of match results sorted by compatibility score
 */
const findMatches = (user, candidates, options = {}) => {
  const {
    minScore = 50,
    maxResults = 10,
    matchType = "potential_partner",
  } = options;

  const matches = candidates
    .map((candidate) => {
      const compatibility = calculateCompatibilityScore(user, candidate);
      return {
        [matchType === "existing_group" ? "group" : "user"]: candidate,
        matchType,
        ...compatibility,
      };
    })
    .filter((match) => match.compatibilityScore >= minScore)
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, maxResults);

  return matches;
};

/**
 * Generate study group suggestions based on unmatched users
 * @param {Array} users - Array of users looking for matches
 * @param {Object} options - Group formation options
 * @returns {Array} - Array of suggested group compositions
 */
const generateGroupSuggestions = (users, options = {}) => {
  const { minGroupSize = 3, maxGroupSize = 6, subjectFocus = true } = options;

  const suggestions = [];

  if (subjectFocus) {
    // Group by common subjects
    const subjectGroups = {};

    users.forEach((user) => {
      user.subjects?.forEach((subject) => {
        if (!subjectGroups[subject]) {
          subjectGroups[subject] = [];
        }
        subjectGroups[subject].push(user);
      });
    });

    Object.entries(subjectGroups).forEach(([subject, subjectUsers]) => {
      if (subjectUsers.length >= minGroupSize) {
        // Find the best combination of users for this subject
        const bestCombination = findBestGroupCombination(
          subjectUsers,
          minGroupSize,
          maxGroupSize
        );

        if (bestCombination.length >= minGroupSize) {
          suggestions.push({
            subject,
            suggestedMembers: bestCombination,
            estimatedCompatibility:
              calculateGroupCompatibility(bestCombination),
            reason: `Study group for ${subject} with ${bestCombination.length} compatible members`,
          });
        }
      }
    });
  }

  return suggestions.sort(
    (a, b) => b.estimatedCompatibility - a.estimatedCompatibility
  );
};

/**
 * Find the best combination of users for a group
 * @param {Array} users - Array of users
 * @param {number} minSize - Minimum group size
 * @param {number} maxSize - Maximum group size
 * @returns {Array} - Best combination of users
 */
const findBestGroupCombination = (users, minSize, maxSize) => {
  // Simple algorithm: pick users with best average compatibility
  // In a more advanced version, this could use more sophisticated algorithms

  if (users.length <= maxSize) {
    return users;
  }

  // Calculate compatibility matrix
  const compatibilityMatrix = {};
  users.forEach((user, i) => {
    compatibilityMatrix[user._id] = {};
    users.forEach((otherUser, j) => {
      if (i !== j) {
        const compatibility = calculateCompatibilityScore(user, otherUser);
        compatibilityMatrix[user._id][otherUser._id] =
          compatibility.compatibilityScore;
      }
    });
  });

  // Simple greedy selection based on average compatibility
  const selected = [users[0]]; // Start with first user

  while (selected.length < maxSize && selected.length < users.length) {
    let bestCandidate = null;
    let bestScore = -1;

    users.forEach((candidate) => {
      if (!selected.find((s) => s._id === candidate._id)) {
        // Calculate average compatibility with already selected users
        const avgCompatibility =
          selected.reduce((sum, selectedUser) => {
            return (
              sum + (compatibilityMatrix[candidate._id][selectedUser._id] || 0)
            );
          }, 0) / selected.length;

        if (avgCompatibility > bestScore) {
          bestScore = avgCompatibility;
          bestCandidate = candidate;
        }
      }
    });

    if (bestCandidate) {
      selected.push(bestCandidate);
    } else {
      break;
    }
  }

  return selected;
};

/**
 * Calculate overall compatibility score for a group
 * @param {Array} users - Array of users in the group
 * @returns {number} - Group compatibility score
 */
const calculateGroupCompatibility = (users) => {
  if (users.length < 2) return 0;

  let totalCompatibility = 0;
  let comparisons = 0;

  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const compatibility = calculateCompatibilityScore(users[i], users[j]);
      totalCompatibility += compatibility.compatibilityScore;
      comparisons++;
    }
  }

  return comparisons > 0 ? totalCompatibility / comparisons : 0;
};

export {
  calculateCompatibilityScore,
  findMatches,
  generateGroupSuggestions,
  calculateGroupCompatibility,
  calculateScheduleCompatibility,
  getCommonTimeSlots,
};
