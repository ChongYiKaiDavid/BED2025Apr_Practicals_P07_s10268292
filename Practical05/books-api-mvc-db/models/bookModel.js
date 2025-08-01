const { sql, getConnection } = require("../dbConfig");

class Book {
  constructor(id, title, author) {
    this.id = id;
    this.title = title;
    this.author = author;
  }

  // Get all books
  static async getAllBooks() {
    try {
      const connection = await getConnection();
      const request = connection.request();
      const result = await request.query("SELECT id, title, author FROM Books ORDER BY id");
      
      return result.recordset.map(row => new Book(row.id, row.title, row.author));
    } catch (err) {
      console.error("Error in getAllBooks:", err);
      throw err;
    }
  }

  // Get book by ID
  static async getBookById(id) {
    try {
      const connection = await getConnection();
      const request = connection.request();
      request.input("id", sql.Int, id);
      const result = await request.query("SELECT id, title, author FROM Books WHERE id = @id");
      
      if (result.recordset.length === 0) {
        return null;
      }
      
      const row = result.recordset[0];
      return new Book(row.id, row.title, row.author);
    } catch (err) {
      console.error("Error in getBookById:", err);
      throw err;
    }
  }

  // Create a new book
  static async createBook(title, author) {
    try {
      const connection = await getConnection();
      const request = connection.request();
      request.input("title", sql.VarChar, title);
      request.input("author", sql.VarChar, author);
      
      const result = await request.query(`
        INSERT INTO Books (title, author) 
        VALUES (@title, @author);
        SELECT SCOPE_IDENTITY() AS id;
      `);
      
      const newId = result.recordset[0].id;
      return new Book(newId, title, author);
    } catch (err) {
      console.error("Error in createBook:", err);
      throw err;
    }
  }

  // Update a book
  static async updateBook(id, title, author) {
    try {
      const connection = await getConnection();
      const request = connection.request();
      request.input("id", sql.Int, id);
      request.input("title", sql.VarChar, title);
      request.input("author", sql.VarChar, author);
      
      const result = await request.query(`
        UPDATE Books 
        SET title = @title, author = @author 
        WHERE id = @id
      `);
      
      if (result.rowsAffected[0] === 0) {
        return null; // Book not found
      }
      
      return new Book(id, title, author);
    } catch (err) {
      console.error("Error in updateBook:", err);
      throw err;
    }
  }

  // Delete a book
  static async deleteBook(id) {
    try {
      const connection = await getConnection();
      const request = connection.request();
      request.input("id", sql.Int, id);
      
      const result = await request.query("DELETE FROM Books WHERE id = @id");
      
      return result.rowsAffected[0] > 0;
    } catch (err) {
      console.error("Error in deleteBook:", err);
      throw err;
    }
  }
}

module.exports = Book;
