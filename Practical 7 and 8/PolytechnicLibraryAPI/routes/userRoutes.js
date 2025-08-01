const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { authorize } = require("../middlewares/authMiddleware");
const { 
  validateUserRegistration, 
  validateUserLogin 
} = require("../middlewares/validationMiddleware");

// Public routes (no authentication required)
router.post("/register", validateUserRegistration, UserController.registerUser);
router.post("/login", validateUserLogin, UserController.loginUser);

// Protected routes (authentication required)
router.get("/profile", authorize(['member', 'librarian']), UserController.getUserProfile);
router.get("/verify-token", authorize(['member', 'librarian']), UserController.verifyToken);

// Librarian-only routes
router.get("/all", authorize(['librarian']), UserController.getAllUsers);

module.exports = router;
