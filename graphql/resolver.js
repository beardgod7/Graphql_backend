const ErrorHandler = require("../utils/ErrorHandler");
const { ApolloServer } = require('apollo-server-express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Task } = require('../database/model/todo'); 


const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      try {
        const user = await User.findById(id).populate('tasks'); 
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        throw new Error(error.message); 
      }
    },
    getTasks: async () => {
      try {
        return await Task.find();
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getTaskById: async (_, { id }) => {
      try {
        const task = await Task.findById(id);
        if (!task) {
          throw new Error("Task not found");
        }
        return task;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    signup: async (_, { name, email, password, addresses, phoneNumber }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const user = new User({
          name,
          email,
          password: hashedPassword,
          addresses,
          phoneNumber,
        });

        await user.save(); // Save the new user to the database
        return user;
      } catch (error) {
        throw new Error(error.message); // Pass through any caught errors
      }
    },
    login: async (_, { email, password }) => {
      try {
        if (!email || !password) {
          throw new Error("Please provide all fields");
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
          throw new Error("User not found");
        }

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
          throw new Error("Invalid password");
        }

        // Optionally return a JWT token if required for authentication
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: process.env.JWT_EXPIRES,
          }
        );

        return {
          message: "Login successful",
          token, // Return a token if JWT-based authentication is used
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    createTask: async (_, { userId, title, description, dueDate }) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }

        const task = new Task({
          title,
          description,
          dueDate,
        });

        await task.save();

        user.tasks.push(task._id);
        await user.save(); // Save the updated user with the new task

        return task;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateTask: async (_, { id, title, description, isCompleted, dueDate }) => {
      try {
        const task = await Task.findById(id);
        if (!task) {
          throw new Error("Task not found");
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (typeof isCompleted === "boolean") task.isCompleted = isCompleted;
        if (dueDate) task.dueDate = dueDate;

        task.updatedAt = new Date(); // Update the updatedAt timestamp
        await task.save(); // Save the updated task

        return task;
      } catch (error) {
        throw new Error(error.message); // Handle and pass through errors
      }
    },
    deleteTask: async (_, { id }) => {
      try {
        const task = await Task.findByIdAndDelete(id); // Delete the task
        if (!task) {
          throw new Error("Task not found");
        }
        return true; // Return true on successful deletion
      } catch (error) {
        throw new Error(error.message); // Pass through caught errors
      }
    },
  },
};

module.exports = resolvers;
