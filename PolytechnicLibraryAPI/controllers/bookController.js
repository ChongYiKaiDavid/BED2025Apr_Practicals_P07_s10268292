const Book = require("../models/bookModel");

class BookController {
  // Get All Books (accessible by both members and librarians)
  static async getAllBooks(req, res) {
    try {
      const books = await Book.getAllBooks();

      res.status(200).json({
        message: "Books retrieved successfully",
        count: books.length,
        books: books
      });

    } catch (error) {
      console.error("Error getting all books:", error);
      res.status(500).json({ 
        message: "Internal server error. Please try again later." 
      });
    }
  }

  // Get Book by ID
  static async getBookById(req, res) {
    try {
      const { bookId } = req.params;

      // Validate book ID
      if (!bookId || isNaN(parseInt(bookId))) {
        return res.status(400).json({
          message: "Invalid book ID. Must be a valid number."
        });
      }

      const book = await Book.getBookById(parseInt(bookId));
      if (!book) {
        return res.status(404).json({
          message: "Book not found."
        });
      }

      res.status(200).json({
        message: "Book retrieved successfully",
        book: book
      });

    } catch (error) {
      console.error("Error getting book by ID:", error);
      res.status(500).json({ 
        message: "Internal server error. Please try again later." 
      });
    }
  }

  // Update Book Availability (accessible only by librarians)
  static async updateBookAvailability(req, res) {
    try {
      const { bookId } = req.params;
      const { availability } = req.body;

      // Check if book exists
      const existingBook = await Book.getBookById(parseInt(bookId));
      if (!existingBook) {
        return res.status(404).json({
          message: "Book not found."
        });
      }

      // Update book availability
      const updatedBook = await Book.updateBookAvailability(parseInt(bookId), availability);

      res.status(200).json({
        message: "Book availability updated successfully",
        book: updatedBook
      });

    } catch (error) {
      console.error("Error updating book availability:", error);
      res.status(500).json({ 
        message: "Internal server error. Please try again later." 
      });
    }
  }

  // Create New Book (accessible only by librarians)
  static async createBook(req, res) {
    try {
      const { title, author, availability } = req.body;

      const newBook = await Book.createBook(title, author, availability);

      res.status(201).json({
        message: "Book created successfully",
        book: newBook
      });

    } catch (error) {
      console.error("Error creating book:", error);
      res.status(500).json({ 
        message: "Internal server error. Please try again later." 
      });
    }
  }

  // Search Books by title or author
  static async searchBooks(req, res) {
    try {
      const { search } = req.query;

      if (!search || typeof search !== 'string' || search.trim().length === 0) {
        return res.status(400).json({
          message: "Search term is required and must be a non-empty string."
        });
      }

      const books = await Book.searchBooks(search.trim());

      res.status(200).json({
        message: "Search completed successfully",
        searchTerm: search.trim(),
        count: books.length,
        books: books
      });

    } catch (error) {
      console.error("Error searching books:", error);
      res.status(500).json({ 
        message: "Internal server error. Please try again later." 
      });
    }
  }

  // Get Available Books Only
  static async getAvailableBooks(req, res) {
    try {
      const books = await Book.getAvailableBooks();

      res.status(200).json({
        message: "Available books retrieved successfully",
        count: books.length,
        books: books
      });

    } catch (error) {
      console.error("Error getting available books:", error);
      res.status(500).json({ 
        message: "Internal server error. Please try again later." 
      });
    }
  }

  // Get Book Statistics (for librarians)
  static async getBookStatistics(req, res) {
    try {
      const allBooks = await Book.getAllBooks();
      const availableBooks = allBooks.filter(book => book.availability === 'Y');
      const unavailableBooks = allBooks.filter(book => book.availability === 'N');

      const statistics = {
        total_books: allBooks.length,
        available_books: availableBooks.length,
        unavailable_books: unavailableBooks.length,
        availability_percentage: allBooks.length > 0 ? 
          ((availableBooks.length / allBooks.length) * 100).toFixed(2) : 0
      };

      res.status(200).json({
        message: "Book statistics retrieved successfully",
        statistics: statistics
      });

    } catch (error) {
      console.error("Error getting book statistics:", error);
      res.status(500).json({ 
        message: "Internal server error. Please try again later." 
      });
    }
  }
}

module.exports = BookController;
