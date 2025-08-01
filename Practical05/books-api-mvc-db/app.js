const express = require("express");
const path = require("path");
require('dotenv').config();

// Import controllers and middleware
const BookController = require("./controllers/bookController");
const { validateBook } = require("./middlewares/bookValidation");
const { getConnection, closeConnection } = require("./dbConfig");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Serve static files from the 'public' directory ---
// When a request comes in for a static file (like /index.html, /styles.css, /script.js),
// Express will look for it in the 'public' folder relative to the project root.
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.get("/books", BookController.getAllBooks);
app.get("/books/:id", BookController.getBookById);
app.post("/books", validateBook, BookController.createBook);
app.put("/books/:id", validateBook, BookController.updateBook);
app.delete("/books/:id", BookController.deleteBook);

// Root route for API info
app.get("/api", (req, res) => {
  res.json({
    message: "Books API with MVC and View Layer",
    version: "1.0.0",
    endpoints: {
      "GET /books": "Get all books",
      "GET /books/:id": "Get book by ID",
      "POST /books": "Create new book",
      "PUT /books/:id": "Update book",
      "DELETE /books/:id": "Delete book"
    }
  });
});

// 404 handler for undefined API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
app.listen(port, async () => {
  try {
    // Test database connection
    await getConnection();
    console.log("✅ Database connection established successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    console.log("⚠️  Server is running but database is not connected");
  }

  console.log(`🚀 Books API Server running on http://localhost:${port}`);
  console.log(`📁 Static files served from: ${path.join(__dirname, "public")}`);
  console.log(`🌐 Frontend available at: http://localhost:${port}/index.html`);
  console.log(`📋 API info available at: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Gracefully shutting down...');
  try {
    await closeConnection();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Gracefully shutting down...');
  try {
    await closeConnection();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

module.exports = app;
