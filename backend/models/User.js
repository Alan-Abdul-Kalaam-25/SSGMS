const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
      index: true, // Using single index declaration
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    university: {
      type: String,
      required: [true, "University is required"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Academic year is required"],
      enum: ["freshman", "sophomore", "junior", "senior", "graduate"],
    },
    major: {
      type: String,
      required: [true, "Major is required"],
      trim: true,
    },

    // Study preferences
    subjects: [
      {
        type: String,
        trim: true,
      },
    ],
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
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "mixed"],
      default: "intermediate",
    },
    preferredGroupSize: {
      type: String,
      enum: ["small", "medium", "large"], // small: 2-3, medium: 4-6, large: 7+
      default: "medium",
    },
    studyStyle: {
      type: String,
      enum: ["discussion", "quiet", "problem-solving", "mixed"],
      default: "mixed",
    },

    // Availability (weekly schedule)
    availability: {
      monday: {
        morning: { type: Boolean, default: false },
        afternoon: { type: Boolean, default: false },
        evening: { type: Boolean, default: false },
      },
      tuesday: {
        morning: { type: Boolean, default: false },
        afternoon: { type: Boolean, default: false },
        evening: { type: Boolean, default: false },
      },
      wednesday: {
        morning: { type: Boolean, default: false },
        afternoon: { type: Boolean, default: false },
        evening: { type: Boolean, default: false },
      },
      thursday: {
        morning: { type: Boolean, default: false },
        afternoon: { type: Boolean, default: false },
        evening: { type: Boolean, default: false },
      },
      friday: {
        morning: { type: Boolean, default: false },
        afternoon: { type: Boolean, default: false },
        evening: { type: Boolean, default: false },
      },
      saturday: {
        morning: { type: Boolean, default: false },
        afternoon: { type: Boolean, default: false },
        evening: { type: Boolean, default: false },
      },
      sunday: {
        morning: { type: Boolean, default: false },
        afternoon: { type: Boolean, default: false },
        evening: { type: Boolean, default: false },
      },
    },

    // Study groups the user is part of
    studyGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyGroup",
      },
    ],

    // Profile completion status
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Timestamps
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for faster queries
userSchema.index({ subjects: 1 });
userSchema.index({ university: 1, year: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if profile is complete
userSchema.methods.isProfileComplete = function () {
  return !!(
    this.name &&
    this.email &&
    this.university &&
    this.year &&
    this.major &&
    this.subjects.length > 0 &&
    this.studyGoals.length > 0
  );
};

// Update profile completion status
userSchema.pre("save", function (next) {
  this.profileCompleted = this.isProfileComplete();
  next();
});

// Transform toJSON to remove sensitive data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
