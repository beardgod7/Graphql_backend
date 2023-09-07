const ErrorHandler = require("../utils/ErrorHandler");
const { ApolloServer } = require('apollo-server-express');
const User = require('../../database_service/database/model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      return await User.findById(id);
    },
  },
  Mutation: {
    signup: async (_, { name, email, password,addresses,phoneNumber, }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return (new ErrorHandler("User already exists", 400));;
      }
  
      try {
        const user = new User({ name, email, password, addresses, phoneNumber });
  
        // Save the user to the database
        await user.save();
  
        return user;
      } catch (error) {
        return (new ErrorHandler(error.message, 500));
      }
    },
    login: async (_, { email, password }) => {
      try {
        // Validate input: Check if email and password are empty or null
        if (!email || !password) {
          throw new Error("Please provide all fields!");
        }
  
        // Find the user by email
        const user = await User.findOne({ email }).select("+password")
  
        // If the user doesn't exist, throw an error
        if (!user) {
          throw new Error("User not found");
        }
  
        // Check if the provided password matches the stored hashed password
        const passwordMatch = await user.comparePassword(password);
  
        // If the passwords don't match, throw an error
        if (!passwordMatch) {
          throw new Error("Invalid password");
        }
  
        return "Login successful";
      } catch (error) {
        throw new Error(error.message); // Throw the error to trigger GraphQL error handling
      }
    },
  },
};
module.exports = resolvers;
