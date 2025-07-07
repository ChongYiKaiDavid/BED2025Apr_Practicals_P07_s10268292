
const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();


// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware (Parsing request bodies)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// --- Add other general middleware here (e.g., logging, security headers) ---





// Routes for books
// Apply middleware *before* the controller function for routes that need it
// existing code above
const userController = require("controllers/UserController"); // Note: Changed to userController for consistency

// ... existing code in between

app.post("/users", userController.createUser); // Create user
app.get("/users", userController.getAllUsers); // Get all users
app.get("/users/:id", userController.getUserById); // Get user by ID
app.put("/users/:id", userController.updateUser); // Update user
app.delete("/users/:id", userController.deleteUser); // Delete user
app.get("/users/search", userController.searchUsers);
// ... existing code after
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close();
  console.log("Database connections closed");
  process.exit(0);
});