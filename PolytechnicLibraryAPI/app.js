const express = require("express");
const cors = require("cors");
require('dotenv').config();

// Import routes
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

// Import database connection
const { getConnection, closeConnection } = require("./dbConfig");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Request logging middleware (for development)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Polytechnic Library API",
    version: "1.0.0",
    status: "Server is running successfully",
    endpoints: {
      users: "/users",
      books: "/books"
    },
    documentation: "Please refer to the README.md file for API documentation"
  });
});

// API routes
app.use("/users", userRoutes);
app.use("/books", bookRoutes);

// Test database connection endpoint
app.get("/test-db", async (req, res) => {
  try {
    const connection = await getConnection();
    res.status(200).json({
      message: "Database connection successful",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: error.message
    });
  }
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    requestedUrl: req.originalUrl,
    method: req.method,
    availableRoutes: [
      "GET /",
      "POST /users/register",
      "POST /users/login",
      "GET /users/profile",
      "GET /books",
      "PUT /books/:bookId/availability"
    ]
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  
  // Handle specific error types
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: "Invalid JSON format in request body"
    });
  }
  
  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      message: "Request body too large"
    });
  }

  // Generic error response
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? error.message : "Something went wrong"
  });
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT. Gracefully shutting down...');
  try {
    await closeConnection();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM. Gracefully shutting down...');
  try {
    await closeConnection();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`🚀 Polytechnic Library API Server started successfully!`);
  console.log(`📍 Server is running on http://localhost:${PORT}`);
  console.log(`🕒 Started at: ${new Date().toISOString()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Test database connection on startup
  try {
    await getConnection();
    console.log(`✅ Database connection established successfully`);
  } catch (error) {
    console.error(`❌ Database connection failed:`, error.message);
    console.log(`⚠️  Server is running but database is not connected`);
  }
  
  console.log('\n📚 Available endpoints:');
  console.log('   GET  /                              - API information');
  console.log('   GET  /test-db                       - Test database connection');
  console.log('   POST /users/register                - User registration');
  console.log('   POST /users/login                   - User login');
  console.log('   GET  /users/profile                 - Get user profile (auth required)');
  console.log('   GET  /books                         - Get all books (auth required)');
  console.log('   GET  /books/available               - Get available books (auth required)');
  console.log('   GET  /books/search?search=term      - Search books (auth required)');
  console.log('   GET  /books/:id                     - Get book by ID (auth required)');
  console.log('   POST /books                         - Create book (librarian only)');
  console.log('   PUT  /books/:id/availability        - Update book availability (librarian only)');
  console.log('\n🔧 Ready to accept requests...\n');
});

module.exports = app;
