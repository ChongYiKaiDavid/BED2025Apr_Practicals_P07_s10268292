const { sql, getConnection } = require("../dbConfig");

class Book {
  constructor(book_id, title, author, availability, created_date) {
    this.book_id = book_id;
    this.title = title;
    this.author = author;
    this.availability = availability;
    this.created_date = created_date;
  }

  // Get all books
  static async getAllBooks() {
    try {
      const connection = await getConnection();
      const request = connection.request();
      
      const result = await request.query(`
        SELECT book_id, title, author, availability, created_date 
        FROM Books 
        ORDER BY title ASC
      `);

      return result.recordset.map(book => new Book(
        book.book_id,
        book.title,
        book.author,
        book.availability,
        book.created_date
      ));
    } catch (err) {
      console.error("Error getting all books:", err);
      throw err;
    }
  }

  // Get book by ID
  static async getBookById(bookId) {
    try {
      const connection = await getConnection();
      const request = connection.request();
      
      const result = await request
        .input("bookId", sql.Int, bookId)
        .query("SELECT * FROM Books WHERE book_id = @bookId");

      if (result.recordset.length === 0) {
        return null;
      }

      const book = result.recordset[0];
      return new Book(
        book.book_id,
        book.title,
        book.author,
        book.availability,
        book.created_date
      );
    } catch (err) {
      console.error("Error getting book by ID:", err);
      throw err;
    }
  }

  // Update book availability
  static async updateBookAvailability(bookId, availability) {
    try {
      const connection = await getConnection();
      const request = connection.request();
      
      const result = await request
        .input("bookId", sql.Int, bookId)
        .input("availability", sql.Char, availability)
        .query(`
          UPDATE Books 
          SET availability = @availability 
          OUTPUT INSERTED.book_id, INSERTED.title, INSERTED.author, INSERTED.availability, INSERTED.created_date
          WHERE book_id = @bookId
        `);

      if (result.recordset.length === 0) {
        return null;
      }

      const book = result.recordset[0];
      return new Book(
        book.book_id,
        book.title,
        book.author,
        book.availability,
        book.created_date
      );
    } catch (err) {
      console.error("Error updating book availability:", err);
      throw err;
    }
  }

  // Create a new book (for librarians)
  static async createBook(title, author, availability = 'Y') {
    try {
      const connection = await getConnection();
      const request = connection.request();
      
      const result = await request
        .input("title", sql.NVarChar, title)
        .input("author", sql.NVarChar, author)
        .input("availability", sql.Char, availability)
        .query(`
          INSERT INTO Books (title, author, availability) 
          OUTPUT INSERTED.book_id, INSERTED.title, INSERTED.author, INSERTED.availability, INSERTED.created_date
          VALUES (@title, @author, @availability)
        `);

      const book = result.recordset[0];
      return new Book(
        book.book_id,
        book.title,
        book.author,
        book.availability,
        book.created_date
      );
    } catch (err) {
      console.error("Error creating book:", err);
      throw err;
    }
  }

  // Search books by title or author
  static async searchBooks(searchTerm) {
    try {
      const connection = await getConnection();
      const request = connection.request();
      
      const result = await request
        .input("searchTerm", sql.NVarChar, `%${searchTerm}%`)
        .query(`
          SELECT book_id, title, author, availability, created_date 
          FROM Books 
          WHERE title LIKE @searchTerm OR author LIKE @searchTerm
          ORDER BY title ASC
        `);

      return result.recordset.map(book => new Book(
        book.book_id,
        book.title,
        book.author,
        book.availability,
        book.created_date
      ));
    } catch (err) {
      console.error("Error searching books:", err);
      throw err;
    }
  }

  // Get available books only
  static async getAvailableBooks() {
    try {
      const connection = await getConnection();
      const request = connection.request();
      
      const result = await request.query(`
        SELECT book_id, title, author, availability, created_date 
        FROM Books 
        WHERE availability = 'Y'
        ORDER BY title ASC
      `);

      return result.recordset.map(book => new Book(
        book.book_id,
        book.title,
        book.author,
        book.availability,
        book.created_date
      ));
    } catch (err) {
      console.error("Error getting available books:", err);
      throw err;
    }
  }
}

module.exports = Book;
