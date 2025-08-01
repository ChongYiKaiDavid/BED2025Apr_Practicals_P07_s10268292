# Practical 03 - Node.js with SQL Server Integration

This practical demonstrates basic CRUD operations using Node.js, Express, and Microsoft SQL Server.

## Project Structure

```
Practical03/
├── books-api-db/           # Task 1: Extended Books API
│   ├── app.js             # Main application with all CRUD operations
│   ├── dbConfig.js        # Database configuration
│   ├── package.json       # Project dependencies
│   └── database_setup.sql # SQL script to create Books table
├── students-api/          # Task 2: Students API from scratch
│   ├── app.js             # Students API with full CRUD
│   ├── dbConfig.js        # Database configuration
│   ├── package.json       # Project dependencies
│   └── students_table_setup.sql # SQL script to create Students table
└── Reflection_QA_PartA.txt # Reflection on learning experience
```

## Prerequisites

1. Microsoft SQL Server Express installed and running
2. SQL Server Management Studio (SSMS)
3. Node.js installed
4. TCP/IP protocol enabled for SQL Server
5. Mixed mode authentication configured

## Database Setup

### Step 1: Configure SQL Server
1. Enable TCP/IP protocol in SQL Server Configuration Manager
2. Set authentication mode to mixed mode in SSMS
3. Create a login user `booksapi_user` with appropriate permissions

### Step 2: Create Database and Tables
1. Execute `books-api-db/database_setup.sql` in SSMS to create the Books table
2. Execute `students-api/students_table_setup.sql` in SSMS to create the Students table

## Installation and Running

### Books API (Port 3000)
```bash
cd books-api-db
npm install
node app.js
```

### Students API (Port 3001)
```bash
cd students-api
npm install
node app.js
```

## API Endpoints

### Books API (http://localhost:3000)
- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `POST /books` - Create new book
- `PUT /books/:id` - Update book by ID
- `DELETE /books/:id` - Delete book by ID

### Students API (http://localhost:3001)
- `GET /students` - Get all students
- `GET /students/:id` - Get student by ID
- `POST /students` - Create new student
- `PUT /students/:id` - Update student by ID
- `DELETE /students/:id` - Delete student by ID

## Testing with Postman

### Books API Examples

**Create a Book:**
```
POST http://localhost:3000/books
Content-Type: application/json

{
  "title": "New Book Title",
  "author": "Author Name"
}
```

**Update a Book:**
```
PUT http://localhost:3000/books/1
Content-Type: application/json

{
  "title": "Updated Title",
  "author": "Updated Author"
}
```

### Students API Examples

**Create a Student:**
```
POST http://localhost:3001/students
Content-Type: application/json

{
  "name": "John Doe",
  "address": "123 Main Street"
}
```

**Update a Student:**
```
PUT http://localhost:3001/students/1
Content-Type: application/json

{
  "name": "Jane Smith",
  "address": "456 Oak Avenue"
}
```

## Key Learning Points

### Good Practices Demonstrated:
- Database connection management with proper cleanup
- Parameterized queries to prevent SQL injection
- Appropriate HTTP status codes (200, 201, 404, 500)
- Error handling with try-catch-finally blocks
- Graceful server shutdown handling

### Areas for Improvement (Future Practicals):
- Input validation and sanitization
- Code organization with MVC architecture
- Environment variables for configuration
- Connection pooling optimization
- Comprehensive testing

## Database Schema

### Books Table
```sql
CREATE TABLE Books (
  id INT IDENTITY(1,1) PRIMARY KEY,
  title VARCHAR(50) NOT NULL UNIQUE,
  author VARCHAR(50) NOT NULL
);
```

### Students Table
```sql
CREATE TABLE Students (
  student_id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255)
);
```

## Configuration

Update the database credentials in `dbConfig.js` files:
```javascript
module.exports = {
  user: "your_username",        // Your SQL Server login
  password: "your_password",    // Your SQL Server password
  server: "localhost",
  database: "bed_db",
  trustServerCertificate: true,
  options: {
    port: 1433,
    connectionTimeout: 60000,
  },
};
```

## Troubleshooting

1. **Connection Errors**: Verify SQL Server is running and credentials are correct
2. **Port Conflicts**: Ensure ports 3000 and 3001 are available
3. **Database Not Found**: Make sure `bed_db` database exists
4. **Permission Errors**: Verify user has appropriate database permissions

## Notes

- This implementation follows the practical requirements with all database logic embedded in route handlers
- No input validation is implemented (as specified in the practical instructions)
- Future practicals will introduce MVC architecture and proper validation
- Both APIs use the same database (`bed_db`) but different tables
