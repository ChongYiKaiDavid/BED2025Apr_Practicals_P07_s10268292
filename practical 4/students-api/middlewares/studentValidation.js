const Joi = require("joi");

// Schema for validating student info (POST/PUT)
const studentSchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 1 character",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),
  address: Joi.string().min(1).max(100).required().messages({
    "string.base": "Address must be a string",
    "string.empty": "Address cannot be empty",
    "string.min": "Address must be at least 1 character",
    "string.max": "Address cannot exceed 100 characters",
    "any.required": "Address is required",
  }),
});

// Middleware for validating student body
function validateStudent(req, res, next) {
  const { error } = studentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    return res.status(400).json({ error: message });
  }
  next();
}

// Middleware for validating student ID in URL param
function validateStudentId(req, res, next) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return res
      .status(400)
      .json({ error: "Invalid student ID. ID must be a positive number." });
  }
  next();
}

module.exports = {
  validateStudent,
  validateStudentId,
};
