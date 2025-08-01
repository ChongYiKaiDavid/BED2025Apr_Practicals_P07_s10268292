const Joi = require("joi");

// Validation schema for creating/updating a book
const bookSchema = Joi.object({
  title: Joi.string().min(1).max(50).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 1 character long",
    "string.max": "Title must not exceed 50 characters",
    "any.required": "Title is required"
  }),
  author: Joi.string().min(1).max(50).required().messages({
    "string.empty": "Author is required",
    "string.min": "Author must be at least 1 character long",
    "string.max": "Author must not exceed 50 characters",
    "any.required": "Author is required"
  })
});

// Middleware to validate book data
const validateBook = (req, res, next) => {
  const { error, value } = bookSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({ 
      message: "Validation error", 
      errors: errorMessages 
    });
  }
  
  // Replace req.body with validated and sanitized data
  req.body = value;
  next();
};

module.exports = { validateBook };
