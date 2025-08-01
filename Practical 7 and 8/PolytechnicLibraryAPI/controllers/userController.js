const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require('dotenv').config();

class UserController {
  // User Registration
  static async registerUser(req, res) {
    try {
      const { username, password, role } = req.body;

      // Check if username already exists
      const existingUser = await User.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ 
          message: "Username already exists. Please choose a different username." 
        });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create the user
      const newUser = await User.createUser(username, hashedPassword, role);

      // Return success response (without password hash)
      res.status(201).json({
        message: "User registered successfully",
        user: {
          user_id: newUser.user_id,
          username: newUser.username,
          role: newUser.role,
          created_date: newUser.created_date
        }
      });

    } catch (error) {
      console.error("Error in user registration:", error);
      res.status(500).json({ 
        message: "Internal server error. Please try again later." 
      });
    }
  }

  // User Login
  static async loginUser(req, res) {
    try {
      const { username, password } = req.body;

      // Get user by username
      const user = await User.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ 
          message: "Invalid credentials. Please check your username and password." 
        });
      }

      // Compare password with hashed password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          message: "Invalid credentials. Please check your username and password." 
        });
      }

      // Generate JWT token
      const tokenPayload = {
        id: user.user_id,
        username: user.username,
        role: user.role
      };

      const jwtSecret = process.env.JWT_SECRET || "your_super_secret_jwt_key_change_this_in_production";
      const token = jwt.sign(tokenPayload, jwtSecret, { 
        expiresIn: "24h" // Token expires in 24 hours
      });

      // Return success response with token
      res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
          user_id: user.user_id,
          username: user.username,
          role: user.role
        }
      });

    } catch (error) {
      console.error("Error in user login:", error);
      res.status(500).json({ 
        message: "Internal server error. Please try again later." 
      });
    }
  }

  // Get User Profile (for authenticated users)
  static async getUserProfile(req, res) {
    try {
      const userId = req.user.id; // From JWT token

      const user = await User.getUserById(userId);
      if (!user) {
        return res.status(404).json({ 
          message: "User not found." 
        });
      }

      // Return user profile (without password hash)
      res.status(200).json({
        user: {
          user_id: user.user_id,
          username: user.username,
          role: user.role,
          created_date: user.created_date
        }
      });

    } catch (error) {
      console.error("Error getting user profile:", error);
      res.status(500).json({ 
        message: "Internal server error. Please try again later." 
      });
    }
  }

  // Get All Users (for librarians only)
  static async getAllUsers(req, res) {
    try {
      const users = await User.getAllUsers();

      res.status(200).json({
        message: "Users retrieved successfully",
        count: users.length,
        users: users
      });

    } catch (error) {
      console.error("Error getting all users:", error);
      res.status(500).json({ 
        message: "Internal server error. Please try again later." 
      });
    }
  }

  // Verify Token (for testing purposes)
  static async verifyToken(req, res) {
    try {
      // If we reach here, the token is valid (middleware passed)
      res.status(200).json({
        message: "Token is valid",
        user: {
          id: req.user.id,
          username: req.user.username,
          role: req.user.role
        }
      });

    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(500).json({ 
        message: "Internal server error. Please try again later." 
      });
    }
  }
}

module.exports = UserController;
