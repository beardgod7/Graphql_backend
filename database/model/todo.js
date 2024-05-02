
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define a Task schema for tasks related to users
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a task title!'],
  },
  description: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false, // Default to incomplete
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
});

taskSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Define the User schema with tasks
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email!'],
    unique: true, // Set the email field as unique
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [4, 'Password should be greater than 4 characters'],
    select: false, // Don't return this field by default in queries
  },
  phoneNumber: {
    type: String,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task', // Reference to the Task model
    },
  ],
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate JWT token for authentication
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
  return token;
};

// Compare entered password with stored hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the user schema and the task schema models
const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

module.exports = {
  User,
  Task,
};
