# Polytechnic Library API

A secure backend API for the Polytechnic Library System built with Node.js, Express, and Microsoft SQL Server. This API provides user authentication, authorization, and book management functionalities for library members and librarians.

## Features

### User Management
- ✅ User registration for members and librarians
- ✅ Secure login with JWT authentication
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control

### Book Management
- ✅ View all books (members & librarians)
- ✅ Search books by title or author
- ✅ View available books only
- ✅ Update book availability (librarians only)
- ✅ Create new books (librarians only)
- ✅ Book statistics (librarians only)

### Security Features
- ✅ JWT-based authentication
- ✅ Role-based authorization middleware
- ✅ Input validation and sanitization
- ✅ Password strength requirements
- ✅ Secure error handling

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: Microsoft SQL Server
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Custom middleware
- **Environment**: dotenv

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Microsoft SQL Server
- npm or yarn package manager

### 1. Clone/Download the Project
```bash
# Navigate to your project directory
cd PolytechnicLibraryAPI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
1. Ensure Microsoft SQL Server is running
2. Execute the SQL script to create database and tables:
   ```sql
   -- Run the contents of sql/create_tables.sql in SQL Server Management Studio
   ```

### 4. Environment Configuration
1. Update the `.env` file with your database credentials:
   ```env
   # Database Configuration
   DB_USER=your_actual_username
   DB_PASSWORD=your_actual_password
   DB_SERVER=localhost
   DB_DATABASE=PolytechnicLibrary
   DB_PORT=1433

   # JWT Secret Key (change this to a strong, unique key)
   JWT_SECRET=your_very_secure_and_long_secret_key_here

   # Server Configuration
   PORT=3000
   ```

### 5. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### 🏠 General Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | API information | No |
| GET | `/test-db` | Test database connection | No |

#### 👤 User Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/users/register` | Register new user | No | - |
| POST | `/users/login` | User login | No | - |
| GET | `/users/profile` | Get user profile | Yes | member, librarian |
| GET | `/users/verify-token` | Verify JWT token | Yes | member, librarian |
| GET | `/users/all` | Get all users | Yes | librarian |

#### 📚 Book Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/books` | Get all books | Yes | member, librarian |
| GET | `/books/available` | Get available books | Yes | member, librarian |
| GET | `/books/search?search=term` | Search books | Yes | member, librarian |
| GET | `/books/:id` | Get book by ID | Yes | member, librarian |
| POST | `/books` | Create new book | Yes | librarian |
| PUT | `/books/:id/availability` | Update book availability | Yes | librarian |
| GET | `/books/admin/statistics` | Get book statistics | Yes | librarian |

### Request/Response Examples

#### User Registration
```http
POST /users/register
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123",
  "role": "member"
}
```

#### User Login
```http
POST /users/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

#### Update Book Availability
```http
PUT /books/1/availability
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "availability": "N"
}
```

#### Create New Book
```http
POST /books
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "New Book Title",
  "author": "Author Name",
  "availability": "Y"
}
```

## Database Schema

### Users Table
```sql
user_id (INT, PRIMARY KEY, IDENTITY)
username (NVARCHAR(255), UNIQUE, NOT NULL)
passwordHash (NVARCHAR(255), NOT NULL)
role (NVARCHAR(20), NOT NULL) -- 'member' or 'librarian'
created_date (DATETIME, DEFAULT GETDATE())
```

### Books Table
```sql
book_id (INT, PRIMARY KEY, IDENTITY)
title (NVARCHAR(255), NOT NULL)
author (NVARCHAR(255), NOT NULL)
availability (CHAR(1), NOT NULL) -- 'Y' or 'N'
created_date (DATETIME, DEFAULT GETDATE())
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Example error response:
```json
{
  "message": "Invalid credentials. Please check your username and password."
}
```

## Validation Rules

### User Registration
- Username: 3-50 characters, unique
- Password: 6-128 characters, must contain at least one letter and one number
- Role: must be 'member' or 'librarian'

### Book Management
- Title: 1-255 characters, required
- Author: 1-255 characters, required
- Availability: 'Y' or 'N'

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to version control
2. **JWT Secret**: Use a strong, unique secret key in production
3. **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds
4. **Input Validation**: All inputs are validated and sanitized
5. **SQL Injection Prevention**: Using parameterized queries
6. **CORS**: Configured for cross-origin requests

## Development

### Project Structure
```
PolytechnicLibraryAPI/
├── controllers/
│   ├── userController.js
│   └── bookController.js
├── middlewares/
│   ├── authMiddleware.js
│   └── validationMiddleware.js
├── models/
│   ├── userModel.js
│   └── bookModel.js
├── routes/
│   ├── userRoutes.js
│   └── bookRoutes.js
├── sql/
│   └── create_tables.sql
├── app.js
├── dbConfig.js
├── package.json
├── .env
└── README.md
```

### Running Tests
```bash
# Test database connection
curl http://localhost:3000/test-db

# Test API info
curl http://localhost:3000/
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify SQL Server is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **JWT Token Errors**
   - Check if token is included in Authorization header
   - Verify token format: `Bearer <token>`
   - Check if token has expired (24 hours)

3. **Permission Denied**
   - Verify user role matches endpoint requirements
   - Check if user is properly authenticated

### Debug Mode
Set `NODE_ENV=development` in your `.env` file for detailed error messages.

## Contributing

This is a practical assignment project. For team collaboration:

1. Use version control effectively
2. Follow the established code structure
3. Add clear comments to your code
4. Test your changes thoroughly

## License

This project is for educational purposes as part of the BED (Backend Development) practical assignments.

## Team Information

**Practical**: 7 & 8 - Polytechnic Library API  
**Course**: Backend Development (BED)  
**Academic Year**: 2025

---

**Note**: This API is designed for educational purposes and includes security best practices suitable for learning environments. For production deployment, additional security measures should be implemented.
