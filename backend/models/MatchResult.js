const mongoose = require("mongoose");

const matchResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matches: [
      {
        group: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "StudyGroup",
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        matchType: {
          type: String,
          enum: ["existing_group", "potential_partner", "new_group_suggestion"],
          required: true,
        },
        compatibilityScore: {
          type: Number,
          min: 0,
          max: 100,
          required: true,
        },
        matchFactors: {
          subjectMatch: {
            score: Number,
            weight: Number,
            commonSubjects: [String],
          },
          scheduleMatch: {
            score: Number,
            weight: Number,
            commonTimeSlots: [String],
          },
          experienceMatch: {
            score: Number,
            weight: Number,
            levelCompatibility: String,
          },
          studyStyleMatch: {
            score: Number,
            weight: Number,
            styleCompatibility: String,
          },
          goalMatch: {
            score: Number,
            weight: Number,
            commonGoals: [String],
          },
          locationMatch: {
            score: Number,
            weight: Number,
            distance: Number, // if applicable
          },
        },
        reasons: [String], // Human-readable explanations for the match

        // User interaction with this match
        viewed: {
          type: Boolean,
          default: false,
        },
        viewedAt: Date,
        interested: {
          type: Boolean,
          default: false,
        },
        contacted: {
          type: Boolean,
          default: false,
        },
        contactedAt: Date,
        joined: {
          type: Boolean,
          default: false,
        },
        joinedAt: Date,
        dismissed: {
          type: Boolean,
          default: false,
        },
        dismissedAt: Date,
        dismissReason: String,
      },
    ],

    // Matching criteria used
    searchCriteria: {
      subjects: [String],
      experienceLevel: String,
      studyStyle: String,
      preferredGroupSize: String,
      availability: Object,
      maxDistance: Number, // if location-based matching
      studyGoals: [String],
    },

    // Algorithm metadata
    algorithmVersion: {
      type: String,
      default: "1.0",
    },
    processingTime: Number, // milliseconds
    totalCandidates: Number,

    // Result status
    status: {
      type: String,
      enum: ["active", "expired", "completed"],
      default: "active",
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
matchResultSchema.index({ user: 1, status: 1 });
matchResultSchema.index({ user: 1, createdAt: -1 });
matchResultSchema.index({ expiresAt: 1 });
matchResultSchema.index({ "matches.group": 1 });
matchResultSchema.index({ "matches.user": 1 });

// Virtual for top matches (highest compatibility scores)
matchResultSchema.virtual("topMatches").get(function () {
  return this.matches
    .filter((match) => !match.dismissed)
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, 5);
});

// Method to mark match as viewed
matchResultSchema.methods.markMatchViewed = function (matchId) {
  const match = this.matches.id(matchId);
  if (match) {
    match.viewed = true;
    match.viewedAt = new Date();
  }
};

// Method to mark interest in a match
matchResultSchema.methods.markInterested = function (matchId) {
  const match = this.matches.id(matchId);
  if (match) {
    match.interested = true;
  }
};

// Method to dismiss a match
matchResultSchema.methods.dismissMatch = function (matchId, reason) {
  const match = this.matches.id(matchId);
  if (match) {
    match.dismissed = true;
    match.dismissedAt = new Date();
    match.dismissReason = reason;
  }
};

// Method to mark match as contacted/joined
matchResultSchema.methods.markMatchAction = function (matchId, action) {
  const match = this.matches.id(matchId);
  if (match) {
    if (action === "contacted") {
      match.contacted = true;
      match.contactedAt = new Date();
    } else if (action === "joined") {
      match.joined = true;
      match.joinedAt = new Date();
    }
  }
};

// Static method to cleanup expired results
matchResultSchema.statics.cleanupExpired = function () {
  return this.deleteMany({
    status: "active",
    expiresAt: { $lt: new Date() },
  });
};

// Pre-save middleware to auto-expire
matchResultSchema.pre("save", function (next) {
  if (this.expiresAt < new Date() && this.status === "active") {
    this.status = "expired";
  }
  next();
});

// Transform toJSON to include virtuals
matchResultSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("MatchResult", matchResultSchema);
