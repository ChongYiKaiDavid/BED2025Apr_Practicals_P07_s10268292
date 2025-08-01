# API Testing Guide

This document provides a step-by-step guide to test the Polytechnic Library API manually.

## Prerequisites
1. Server is running on `http://localhost:3000`
2. Database is connected and tables are created
3. Use a tool like Postman, Insomnia, or curl

## Testing Steps

### 1. Test Basic API Functionality

#### Get API Information
```bash
curl -X GET http://localhost:3000/
```
Expected: 200 OK with API information

#### Test Database Connection
```bash
curl -X GET http://localhost:3000/test-db
```
Expected: 200 OK if database is connected

### 2. User Registration Testing

#### Register a Member
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testmember",
    "password": "password123",
    "role": "member"
  }'
```
Expected: 201 Created with user details

#### Register a Librarian
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testlibrarian",
    "password": "password123",
    "role": "librarian"
  }'
```
Expected: 201 Created with user details

#### Test Registration Validation
```bash
# Invalid role
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "role": "admin"
  }'
```
Expected: 400 Bad Request with validation error

```bash
# Weak password
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser2",
    "password": "123",
    "role": "member"
  }'
```
Expected: 400 Bad Request with password validation error

### 3. User Login Testing

#### Login as Member
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testmember",
    "password": "password123"
  }'
```
Expected: 200 OK with JWT token
**Save the token for subsequent requests**

#### Login as Librarian
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testlibrarian",
    "password": "password123"
  }'
```
Expected: 200 OK with JWT token
**Save the token for subsequent requests**

#### Test Invalid Login
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testmember",
    "password": "wrongpassword"
  }'
```
Expected: 401 Unauthorized

### 4. Protected Routes Testing

#### Get User Profile (with valid token)
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```
Expected: 200 OK with user profile

#### Get User Profile (without token)
```bash
curl -X GET http://localhost:3000/users/profile
```
Expected: 401 Unauthorized

### 5. Book Management Testing

#### Get All Books (as authenticated user)
```bash
curl -X GET http://localhost:3000/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```
Expected: 200 OK with list of books

#### Get Available Books Only
```bash
curl -X GET http://localhost:3000/books/available \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```
Expected: 200 OK with available books

#### Search Books
```bash
curl -X GET "http://localhost:3000/books/search?search=gatsby" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```
Expected: 200 OK with search results

#### Get Book by ID
```bash
curl -X GET http://localhost:3000/books/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```
Expected: 200 OK with book details

### 6. Librarian-Only Features Testing

#### Update Book Availability (as Librarian)
```bash
curl -X PUT http://localhost:3000/books/1/availability \
  -H "Authorization: Bearer LIBRARIAN_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "availability": "N"
  }'
```
Expected: 200 OK with updated book

#### Update Book Availability (as Member)
```bash
curl -X PUT http://localhost:3000/books/1/availability \
  -H "Authorization: Bearer MEMBER_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "availability": "Y"
  }'
```
Expected: 403 Forbidden

#### Create New Book (as Librarian)
```bash
curl -X POST http://localhost:3000/books \
  -H "Authorization: Bearer LIBRARIAN_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Test Book",
    "author": "Test Author",
    "availability": "Y"
  }'
```
Expected: 201 Created with new book

#### Get Book Statistics (as Librarian)
```bash
curl -X GET http://localhost:3000/books/admin/statistics \
  -H "Authorization: Bearer LIBRARIAN_JWT_TOKEN_HERE"
```
Expected: 200 OK with book statistics

### 7. Error Handling Testing

#### Invalid Book ID
```bash
curl -X GET http://localhost:3000/books/999 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```
Expected: 404 Not Found

#### Invalid Availability Value
```bash
curl -X PUT http://localhost:3000/books/1/availability \
  -H "Authorization: Bearer LIBRARIAN_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "availability": "INVALID"
  }'
```
Expected: 400 Bad Request

### 8. Token Expiration Testing

#### Use Expired Token
Wait for token to expire (24 hours) or manually create an expired token for testing.
```bash
curl -X GET http://localhost:3000/books \
  -H "Authorization: Bearer EXPIRED_TOKEN"
```
Expected: 401 Unauthorized with token expiration message

## Expected HTTP Status Codes

- `200` - Success (GET, PUT requests)
- `201` - Created (POST requests)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Common Test Scenarios

### Authentication Flow
1. Register → Login → Get Profile → Access Protected Routes
2. Test with both member and librarian roles
3. Test without authentication (should fail)

### Authorization Flow
1. Login as member → Try librarian-only routes (should fail)
2. Login as librarian → Access all routes (should succeed)

### Data Validation
1. Test with missing required fields
2. Test with invalid data types
3. Test with data exceeding length limits
4. Test with special characters

### Error Scenarios
1. Access non-existent resources
2. Use malformed requests
3. Use expired/invalid tokens
4. Access endpoints with wrong HTTP methods

## Postman Collection

Import the Postman collection from `/postman/PolytechnicLibraryAPI.postman_collection.json` for easier testing with a GUI interface.

## Notes
- Replace `YOUR_JWT_TOKEN_HERE` with actual tokens from login responses
- Some sample books are inserted by the SQL script
- User passwords are hashed, so they cannot be retrieved in plain text
- Tokens expire after 24 hours and need to be refreshed by logging in again
