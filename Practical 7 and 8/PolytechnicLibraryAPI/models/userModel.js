const { sql, getConnection } = require("../dbConfig");

class User {
  constructor(user_id, username, passwordHash, role, created_date) {
    this.user_id = user_id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.role = role;
    this.created_date = created_date;
  }

  // Create a new user
  static async createUser(username, passwordHash, role) {
    try {
      const connection = await getConnection();
      const request = connection.request();
      
      const result = await request
        .input("username", sql.NVarChar, username)
        .input("passwordHash", sql.NVarChar, passwordHash)
        .input("role", sql.NVarChar, role)
        .query(`
          INSERT INTO Users (username, passwordHash, role) 
          OUTPUT INSERTED.user_id, INSERTED.username, INSERTED.role, INSERTED.created_date
          VALUES (@username, @passwordHash, @role)
        `);

      return new User(
        result.recordset[0].user_id,
        result.recordset[0].username,
        passwordHash,
        result.recordset[0].role,
        result.recordset[0].created_date
      );
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  }

  // Get user by username
  static async getUserByUsername(username) {
    try {
      const connection = await getConnection();
      const request = connection.request();
      
      const result = await request
        .input("username", sql.NVarChar, username)
        .query("SELECT * FROM Users WHERE username = @username");

      if (result.recordset.length === 0) {
        return null;
      }

      const user = result.recordset[0];
      return new User(
        user.user_id,
        user.username,
        user.passwordHash,
        user.role,
        user.created_date
      );
    } catch (err) {
      console.error("Error getting user by username:", err);
      throw err;
    }
  }

  // Get user by ID
  static async getUserById(userId) {
    try {
      const connection = await getConnection();
      const request = connection.request();
      
      const result = await request
        .input("userId", sql.Int, userId)
        .query("SELECT * FROM Users WHERE user_id = @userId");

      if (result.recordset.length === 0) {
        return null;
      }

      const user = result.recordset[0];
      return new User(
        user.user_id,
        user.username,
        user.passwordHash,
        user.role,
        user.created_date
      );
    } catch (err) {
      console.error("Error getting user by ID:", err);
      throw err;
    }
  }

  // Get all users (for admin purposes)
  static async getAllUsers() {
    try {
      const connection = await getConnection();
      const request = connection.request();
      
      const result = await request.query(`
        SELECT user_id, username, role, created_date 
        FROM Users 
        ORDER BY created_date DESC
      `);

      return result.recordset.map(user => ({
        user_id: user.user_id,
        username: user.username,
        role: user.role,
        created_date: user.created_date
      }));
    } catch (err) {
      console.error("Error getting all users:", err);
      throw err;
    }
  }

  // Check if username exists
  static async usernameExists(username) {
    try {
      const user = await User.getUserByUsername(username);
      return user !== null;
    } catch (err) {
      console.error("Error checking if username exists:", err);
      throw err;
    }
  }
}

module.exports = User;
