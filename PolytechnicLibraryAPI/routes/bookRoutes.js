const express = require("express");
const router = express.Router();
const BookController = require("../controllers/bookController");
const { authorize } = require("../middlewares/authMiddleware");
const { 
  validateBookAvailability,
  validateBookCreation 
} = require("../middlewares/validationMiddleware");

// Routes accessible by both members and librarians
router.get("/", authorize(['member', 'librarian']), BookController.getAllBooks);
router.get("/available", authorize(['member', 'librarian']), BookController.getAvailableBooks);
router.get("/search", authorize(['member', 'librarian']), BookController.searchBooks);
router.get("/:bookId", authorize(['member', 'librarian']), BookController.getBookById);

// Routes accessible only by librarians
router.post("/", authorize(['librarian']), validateBookCreation, BookController.createBook);
router.put("/:bookId/availability", authorize(['librarian']), validateBookAvailability, BookController.updateBookAvailability);
router.get("/admin/statistics", authorize(['librarian']), BookController.getBookStatistics);

module.exports = router;
