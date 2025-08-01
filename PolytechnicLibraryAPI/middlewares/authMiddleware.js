const jwt = require("jsonwebtoken");
require('dotenv').config();

// Middleware to verify JWT token
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      message: "Access denied. No token provided." 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_super_secret_jwt_key_change_this_in_production");
    req.user = decoded; // Attach decoded user information to the request object
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Token has expired. Please login again." 
      });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: "Invalid token." 
      });
    } else {
      return res.status(403).json({ 
        message: "Token verification failed." 
      });
    }
  }
};

// Middleware to verify user role
const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: "User not authenticated." 
      });
    }

    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${userRole}` 
      });
    }

    next();
  };
};

// Combined middleware for JWT verification and role authorization
const authorize = (allowedRoles = []) => {
  return [verifyJWT, verifyRole(allowedRoles)];
};

module.exports = {
  verifyJWT,
  verifyRole,
  authorize
};
