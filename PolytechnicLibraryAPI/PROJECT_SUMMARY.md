# Polytechnic Library API - Project Summary

## 🎯 Project Overview

The Polytechnic Library API is a complete backend solution for managing library operations with secure user authentication and role-based authorization. This project fulfills all requirements for Practical 7 & 8.

## ✅ Features Implemented

### 🔐 Authentication & Authorization
- ✅ User registration with password hashing (bcryptjs)
- ✅ JWT-based authentication with 24-hour token expiration
- ✅ Role-based access control (member vs librarian)
- ✅ Secure middleware for token verification
- ✅ Input validation and sanitization

### 📚 Book Management
- ✅ View all books (members & librarians)
- ✅ Search books by title/author
- ✅ Filter available books only
- ✅ Update book availability (librarians only)
- ✅ Create new books (librarians only)
- ✅ Book statistics dashboard (librarians only)

### 🗄️ Database Integration
- ✅ Microsoft SQL Server integration
- ✅ Proper database schema with Users and Books tables
- ✅ SQL injection prevention with parameterized queries
- ✅ Sample data for testing

## 🏗️ Project Structure

```
PolytechnicLibraryAPI/
├── controllers/           # Business logic
│   ├── userController.js
│   └── bookController.js
├── middlewares/          # Authentication & validation
│   ├── authMiddleware.js
│   └── validationMiddleware.js
├── models/              # Database models
│   ├── userModel.js
│   └── bookModel.js
├── routes/              # API endpoints
│   ├── userRoutes.js
│   └── bookRoutes.js
├── sql/                 # Database scripts
│   └── create_tables.sql
├── postman/             # API testing collection
│   └── PolytechnicLibraryAPI.postman_collection.json
├── test/                # Testing documentation
│   └── testing-guide.md
├── app.js               # Main application file
├── dbConfig.js          # Database configuration
├── package.json         # Dependencies
├── .env                 # Environment variables
├── .gitignore          # Git ignore rules
└── README.md           # Complete documentation
```

## 🛠️ Technologies Used

- **Backend Framework**: Node.js + Express.js
- **Database**: Microsoft SQL Server with mssql driver
- **Authentication**: JSON Web Tokens (jsonwebtoken)
- **Password Security**: bcryptjs for hashing
- **Environment Management**: dotenv
- **CORS Support**: cors middleware

## 📋 API Endpoints

### Public Endpoints
- `GET /` - API information
- `GET /test-db` - Database connection test
- `POST /users/register` - User registration
- `POST /users/login` - User authentication

### Protected Endpoints (Authentication Required)
- `GET /users/profile` - Get user profile
- `GET /users/verify-token` - Verify JWT token
- `GET /books` - Get all books
- `GET /books/available` - Get available books
- `GET /books/search` - Search books
- `GET /books/:id` - Get specific book

### Librarian-Only Endpoints
- `GET /users/all` - Get all users
- `POST /books` - Create new book
- `PUT /books/:id/availability` - Update book availability
- `GET /books/admin/statistics` - Book statistics

## 🔒 Security Features

1. **Password Security**: All passwords hashed with bcryptjs (10 salt rounds)
2. **JWT Authentication**: Secure token-based authentication
3. **Role-Based Authorization**: Middleware prevents unauthorized access
4. **Input Validation**: Comprehensive validation for all inputs
5. **SQL Injection Prevention**: Parameterized queries only
6. **Error Handling**: Secure error messages without sensitive data exposure

## 🚀 Quick Start Guide

### 1. Database Setup
```sql
-- Execute sql/create_tables.sql in SQL Server Management Studio
-- This creates the database, tables, and sample data
```

### 2. Environment Configuration
```bash
# Update .env file with your database credentials
DB_USER=your_username
DB_PASSWORD=your_password
DB_SERVER=localhost
DB_DATABASE=PolytechnicLibrary
JWT_SECRET=your_secure_secret_key
```

### 3. Start the Server
```bash
npm install    # Install dependencies
npm start      # Start the server
# OR
npm run dev    # Start with auto-reload (development)
```

### 4. Test the API
- Server runs on `http://localhost:3000`
- Import Postman collection from `/postman/` folder
- Follow the testing guide in `/test/testing-guide.md`

## 🧪 Testing

### Automated Testing
- Postman collection with pre-configured requests
- Environment variables for easy token management
- Comprehensive test scenarios

### Manual Testing
- Detailed testing guide with curl commands
- Step-by-step validation procedures
- Error scenario testing

## 📚 User Roles & Permissions

### Library Members
- ✅ Register and login
- ✅ View all books
- ✅ Search books
- ✅ View available books
- ❌ Cannot update book availability
- ❌ Cannot create new books

### Librarians
- ✅ All member permissions
- ✅ Update book availability
- ✅ Create new books
- ✅ View user statistics
- ✅ Access admin features

## 🔧 Technical Implementation Details

### Authentication Flow
1. User registers with username, password, and role
2. Password is hashed using bcryptjs
3. User logs in with credentials
4. Server validates and returns JWT token
5. Client includes token in Authorization header
6. Middleware verifies token and extracts user info
7. Role-based authorization checks user permissions

### Database Design
- **Users Table**: Stores user credentials and roles
- **Books Table**: Stores book information and availability
- **Indexes**: Optimized for common queries
- **Constraints**: Ensure data integrity

### Error Handling
- Consistent error response format
- Appropriate HTTP status codes
- Secure error messages
- Comprehensive logging

## 📖 Documentation

- **README.md**: Complete setup and usage guide
- **API Documentation**: Detailed endpoint descriptions
- **Testing Guide**: Step-by-step testing instructions
- **Code Comments**: Clear explanations throughout codebase

## 🎓 Learning Outcomes Achieved

1. **Authentication Implementation**: Secure user registration and login
2. **Authorization System**: Role-based access control
3. **Database Integration**: CRUD operations with SQL Server
4. **API Design**: RESTful endpoints with proper HTTP methods
5. **Security Best Practices**: Password hashing, JWT tokens, input validation
6. **Error Handling**: Comprehensive error management
7. **Code Organization**: MVC architecture with clear separation of concerns

## 🚀 Deployment Ready

The application is production-ready with:
- Environment variable configuration
- Graceful shutdown handling
- Comprehensive error handling
- Security best practices
- Documentation and testing resources

## 👥 Team Collaboration Features

- Clear code structure for easy collaboration
- Comprehensive documentation
- Git-ready with proper .gitignore
- Testing resources for team validation
- Environment setup instructions

This implementation provides a robust foundation for the Polytechnic Library system and demonstrates all the key concepts required for the practical assignment.
