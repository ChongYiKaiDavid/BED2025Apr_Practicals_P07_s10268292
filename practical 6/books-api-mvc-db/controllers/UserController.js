const userModel = require("../models/UserContorller.js");

async function getAllUsers(req, res) {
  try {
    const user = await userModel.getAllUsers;
    res.json(user);
  } catch (error) {

    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving User" });

  }
}



// Get book by ID
async function getUserById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await userModel.getUserById;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving user" });
  }
}

// Create new book
async function createUser(req, res) {
  try {
    const user = await userModel.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating user " });
  }
}
async function updateUser (req,res){
  try{
  const id = parseInt(req.params.id);
  const user = req.body;
  const change = await userModel.updateUser(id,user);
  
  res.status(200).json(change)}
  catch(error){
      console.error("Controller error:", error);
    res.status(500).json({ error: "Error change user" });
    
  }

  
  
}
async function deleteUser(req,res){
    try{
      const id = req.params.id;
      const deletion  = await userModel.deleteUser(id)
      res.status(204).json("Delete succeed")
    }
    catch(error){
       console.error("Controller error:", error);
    res.status(500).json({ error: "Error change book" });
    }

  }
  async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params

  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }

  try {
    const users = await User.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error("Controller error in searchUsers:", error);
    res.status(500).json({ message: "Error searching users" });
  }
}
async function getUsersWithBooks(req, res) {
  try {
    const users = await User.getUsersWithBooks();
    res.json(users);
  } catch (error) {
    console.error("Controller error in getUsersWithBooks:", error);
    res.status(500).json({ message: "Error fetching users with books" });
  }
}
module.exports = {
  getAllUsers,getUserById,deleteUser,createUser,updateUser, searchUsers, getUsersWithBooks,
};