const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
      index: true,
    },
    passwordHash: {
      type: String,
      required: function () {
        return this.provider === 'local';
      },
      select: false, // Do not return passwordHash in queries by default
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
    },
    picture: {
      type: String,
      default: '',
      trim: true,
    },
    skills: {
      type: [String],
      default: [
        'DSA & Algorithms',
        'System Design',
        'React.js',
        'Node.js',
        'Python',
        'AI / ML',
        'Problem Solving',
        'Behavioral',
      ],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      immutable: true, // Prevent user role tampering
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Helper to strip sensitive fields
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    _id: this._id.toString(),
    name: this.name,
    email: this.email,
    picture: this.picture || '',
    skills: this.skills || [],
    provider: this.provider,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('User', userSchema);
