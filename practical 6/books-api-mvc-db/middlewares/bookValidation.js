const Joi = require("joi"); // Import Joi for validation

// Validation schema for books (used for POST/PUT)
const bookSchema = Joi.object({
  title : Joi.string().min(1).max(50).required().messages({
    "string.base": "name must be a string",
    "string.empty": "name cannot be empty",
    "string.min": "name must be at least 1 character long",
    "string.max": "name cannot exceed 50 characters",
    "any.required": "name is required",
  }),
  author: Joi.string().min(1).max(50).required().messages({
    "string.base": "address must be a string",
    "string.empty": "address cannot be empty",
    "string.min": "address must be at least 1 character long",
    "string.max": "address cannot exceed 50 characters",
    "any.required": "address is required",
  }),
  // Add validation for other fields if necessary (e.g., year, genre)
});

// Middleware to validate book data (for POST/PUT)
function validateBook(req, res, next) {
  // Validate the request body against the bookSchema
  const { error } = bookSchema.validate(req.body, { abortEarly: false }); // abortEarly: false collects all errors

  if (error) {
    // If validation fails, format the error messages and send a 400 response
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  // If validation succeeds, pass control to the next middleware/route handler
  next();
}

// Middleware to validate book ID from URL parameters (for GET by ID, PUT, DELETE)
function validateBookId(req, res, next) {
  // Parse the ID from request parameters
  const id = parseInt(req.params.id);

  // Check if the parsed ID is a valid positive number
  if (isNaN(id) || id <= 0) {
    // If not valid, send a 400 response
    return res
      .status(400)
      .json({ error: "Invalid book ID. ID must be a positive number" });
  }

  // If validation succeeds, pass control to the next middleware/route handler
  next();
}

module.exports = {
  validateBook,
  validateBookId,
};