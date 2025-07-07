const bookModel = require("../models/bookModel");

// Get all books
async function getAllBooks(req, res) {
  try {
    const books = await bookModel.getAllBooks();
    res.json(books);
  } catch (error) {

    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving books" });

  }
}



// Get book by ID
async function getBookById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const book = await bookModel.getBookById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving book" });
  }
}

// Create new book
async function createBook(req, res) {
  try {
    const newBook = await bookModel.createBook(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating book" });
  }
}
async function updateBook (req,res){
  try{
  const id = parseInt(req.params.id);
  const bookData = req.body;
  const change = await bookModel.updateBook(bookData,id);
  
  res.status(200).json(change)}
  catch(error){
      console.error("Controller error:", error);
    res.status(500).json({ error: "Error change book" });
    
  }

  
  
}
async function deleteBook(req,res){
    try{
      const id = req.params.id;
      const deletion  = await bookModel.deleteBook(id)
      res.status(204).json("Delete succeed")
    }
    catch(error){
       console.error("Controller error:", error);
    res.status(500).json({ error: "Error change book" });
    }

  }
module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};