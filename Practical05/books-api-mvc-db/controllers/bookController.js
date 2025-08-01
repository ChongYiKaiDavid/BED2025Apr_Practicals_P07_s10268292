const Book = require("../models/bookModel");

class BookController {
  // GET /books - Get all books
  static async getAllBooks(req, res) {
    try {
      const books = await Book.getAllBooks();
      res.json(books);
    } catch (error) {
      console.error("Error in getAllBooks:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /books/:id - Get book by ID
  static async getBookById(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const book = await Book.getBookById(id);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.json(book);
    } catch (error) {
      console.error("Error in getBookById:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /books - Create new book
  static async createBook(req, res) {
    try {
      const { title, author } = req.body;
      const newBook = await Book.createBook(title, author);
      res.status(201).json(newBook);
    } catch (error) {
      console.error("Error in createBook:", error);
      
      // Handle unique constraint violation
      if (error.number === 2627) {
        return res.status(400).json({ message: "A book with this title already exists" });
      }
      
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT /books/:id - Update book
  static async updateBook(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const { title, author } = req.body;
      const updatedBook = await Book.updateBook(id, title, author);
      
      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.json(updatedBook);
    } catch (error) {
      console.error("Error in updateBook:", error);
      
      // Handle unique constraint violation
      if (error.number === 2627) {
        return res.status(400).json({ message: "A book with this title already exists" });
      }
      
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE /books/:id - Delete book
  static async deleteBook(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const deleted = await Book.deleteBook(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error in deleteBook:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = BookController;
