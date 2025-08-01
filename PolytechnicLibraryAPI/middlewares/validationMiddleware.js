// Validation middleware for user registration
const validateUserRegistration = (req, res, next) => {
  const { username, password, role } = req.body;

  // Check if all required fields are provided
  if (!username || !password || !role) {
    return res.status(400).json({
      message: "Missing required fields. Please provide username, password, and role."
    });
  }

  // Validate username
  if (typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).json({
      message: "Username must be at least 3 characters long."
    });
  }

  if (username.trim().length > 50) {
    return res.status(400).json({
      message: "Username must not exceed 50 characters."
    });
  }

  // Validate password strength
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long."
    });
  }

  if (password.length > 128) {
    return res.status(400).json({
      message: "Password must not exceed 128 characters."
    });
  }

  // Check password complexity (at least one letter and one number)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must contain at least one letter and one number."
    });
  }

  // Validate role
  const allowedRoles = ['member', 'librarian'];
  if (!allowedRoles.includes(role.toLowerCase())) {
    return res.status(400).json({
      message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`
    });
  }

  // Normalize the data
  req.body.username = username.trim().toLowerCase();
  req.body.role = role.toLowerCase();
  
  next();
};

// Validation middleware for user login
const validateUserLogin = (req, res, next) => {
  const { username, password } = req.body;

  // Check if all required fields are provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Missing required fields. Please provide username and password."
    });
  }

  // Basic validation
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      message: "Username and password must be strings."
    });
  }

  if (username.trim().length === 0 || password.length === 0) {
    return res.status(400).json({
      message: "Username and password cannot be empty."
    });
  }

  // Normalize username
  req.body.username = username.trim().toLowerCase();
  
  next();
};

// Validation middleware for book availability update
const validateBookAvailability = (req, res, next) => {
  const { availability } = req.body;
  const { bookId } = req.params;

  // Validate book ID
  if (!bookId || isNaN(parseInt(bookId))) {
    return res.status(400).json({
      message: "Invalid book ID. Must be a valid number."
    });
  }

  // Check if availability is provided
  if (availability === undefined || availability === null) {
    return res.status(400).json({
      message: "Availability field is required."
    });
  }

  // Validate availability value
  const validAvailability = ['Y', 'N', 'y', 'n'];
  if (!validAvailability.includes(availability)) {
    return res.status(400).json({
      message: "Invalid availability value. Must be 'Y' or 'N'."
    });
  }

  // Normalize availability to uppercase
  req.body.availability = availability.toUpperCase();
  
  next();
};

// Validation middleware for book creation
const validateBookCreation = (req, res, next) => {
  const { title, author, availability } = req.body;

  // Check if required fields are provided
  if (!title || !author) {
    return res.status(400).json({
      message: "Missing required fields. Please provide title and author."
    });
  }

  // Validate title
  if (typeof title !== 'string' || title.trim().length < 1) {
    return res.status(400).json({
      message: "Title must be a non-empty string."
    });
  }

  if (title.trim().length > 255) {
    return res.status(400).json({
      message: "Title must not exceed 255 characters."
    });
  }

  // Validate author
  if (typeof author !== 'string' || author.trim().length < 1) {
    return res.status(400).json({
      message: "Author must be a non-empty string."
    });
  }

  if (author.trim().length > 255) {
    return res.status(400).json({
      message: "Author must not exceed 255 characters."
    });
  }

  // Validate availability if provided
  if (availability !== undefined) {
    const validAvailability = ['Y', 'N', 'y', 'n'];
    if (!validAvailability.includes(availability)) {
      return res.status(400).json({
        message: "Invalid availability value. Must be 'Y' or 'N'."
      });
    }
    req.body.availability = availability.toUpperCase();
  } else {
    req.body.availability = 'Y'; // Default to available
  }

  // Normalize the data
  req.body.title = title.trim();
  req.body.author = author.trim();
  
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateBookAvailability,
  validateBookCreation
};
