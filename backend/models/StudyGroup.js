const mongoose = require("mongoose");

const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      maxlength: [100, "Group name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Group creator and members
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],

    // Group settings
    maxMembers: {
      type: Number,
      required: true,
      min: 2,
      max: 20,
      default: 6,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    requiresApproval: {
      type: Boolean,
      default: false,
    },

    // Study preferences for this group
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "mixed"],
      default: "mixed",
    },
    studyStyle: {
      type: String,
      enum: ["discussion", "quiet", "problem-solving", "mixed"],
      default: "mixed",
    },
    studyGoals: [
      {
        type: String,
        enum: [
          "exam-prep",
          "assignment-help",
          "concept-review",
          "project-work",
          "general-study",
        ],
      },
    ],

    // Meeting schedule
    schedule: {
      frequency: {
        type: String,
        enum: ["weekly", "biweekly", "monthly", "flexible"],
        default: "weekly",
      },
      dayOfWeek: {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      },
      timeSlot: {
        type: String,
        enum: ["morning", "afternoon", "evening"],
      },
      duration: {
        type: Number, // in hours
        min: 1,
        max: 8,
        default: 2,
      },
    },

    // Location (could be physical or virtual)
    location: {
      type: {
        type: String,
        enum: ["physical", "virtual", "hybrid"],
        default: "physical",
      },
      address: String,
      room: String,
      platform: String, // for virtual meetings (Zoom, Teams, etc.)
      meetingLink: String,
    },

    // Group status
    status: {
      type: String,
      enum: ["active", "inactive", "completed", "cancelled"],
      default: "active",
    },

    // Join requests for groups that require approval
    joinRequests: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: String,
        requestedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],

    // Study sessions history
    sessions: [
      {
        date: {
          type: Date,
          required: true,
        },
        duration: Number, // in minutes
        attendees: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        notes: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    // Analytics
    totalSessions: {
      type: Number,
      default: 0,
    },
    totalStudyHours: {
      type: Number,
      default: 0,
    },

    // Group completion date (if applicable)
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
studyGroupSchema.index({ subject: 1, status: 1 });
studyGroupSchema.index({ creator: 1 });
studyGroupSchema.index({ "members.user": 1 });
studyGroupSchema.index({ tags: 1 });
studyGroupSchema.index({ experienceLevel: 1, studyStyle: 1 });

// Virtual for current member count
studyGroupSchema.virtual("currentMemberCount").get(function () {
  return this.members.length;
});

// Virtual for available spots
studyGroupSchema.virtual("availableSpots").get(function () {
  return this.maxMembers - this.members.length;
});

// Check if group is full
studyGroupSchema.methods.isFull = function () {
  return this.members.length >= this.maxMembers;
};

// Check if user is a member
studyGroupSchema.methods.isMember = function (userId) {
  return this.members.some(
    (member) => member.user.toString() === userId.toString()
  );
};

// Check if user is admin/creator
studyGroupSchema.methods.isAdmin = function (userId) {
  const member = this.members.find(
    (member) => member.user.toString() === userId.toString()
  );
  return (
    (member && member.role === "admin") ||
    this.creator.toString() === userId.toString()
  );
};

// Add member to group
studyGroupSchema.methods.addMember = function (userId, role = "member") {
  if (this.isFull() || this.isMember(userId)) {
    return false;
  }

  this.members.push({
    user: userId,
    role: role,
    joinedAt: new Date(),
  });

  return true;
};

// Remove member from group
studyGroupSchema.methods.removeMember = function (userId) {
  this.members = this.members.filter(
    (member) => member.user.toString() !== userId.toString()
  );
};

// Add study session
studyGroupSchema.methods.addSession = function (sessionData) {
  this.sessions.push(sessionData);
  this.totalSessions += 1;
  if (sessionData.duration) {
    this.totalStudyHours += sessionData.duration / 60; // convert minutes to hours
  }
};

// Ensure creator is added as admin member
studyGroupSchema.pre("save", function (next) {
  if (this.isNew && !this.isMember(this.creator)) {
    this.addMember(this.creator, "admin");
  }
  next();
});

// Transform toJSON to include virtuals
studyGroupSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("StudyGroup", studyGroupSchema);
