-- Create Database
CREATE DATABASE PolytechnicLibrary;
GO

USE PolytechnicLibrary;
GO

-- Create Users Table
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(255) UNIQUE NOT NULL,
    passwordHash NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL CHECK (role IN ('member', 'librarian')),
    created_date DATETIME DEFAULT GETDATE()
);

-- Create Books Table
CREATE TABLE Books (
    book_id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    author NVARCHAR(255) NOT NULL,
    availability CHAR(1) NOT NULL CHECK (availability IN ('Y', 'N')) DEFAULT 'Y',
    created_date DATETIME DEFAULT GETDATE()
);

-- Insert sample books
INSERT INTO Books (title, author, availability) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Y'),
('To Kill a Mockingbird', 'Harper Lee', 'Y'),
('1984', 'George Orwell', 'N'),
('Pride and Prejudice', 'Jane Austen', 'Y'),
('The Catcher in the Rye', 'J.D. Salinger', 'N'),
('Lord of the Flies', 'William Golding', 'Y'),
('Animal Farm', 'George Orwell', 'Y'),
('Brave New World', 'Aldous Huxley', 'N'),
('The Lord of the Rings', 'J.R.R. Tolkien', 'Y'),
('Harry Potter and the Philosopher''s Stone', 'J.K. Rowling', 'Y');

-- Create sample users (passwords will be hashed in the application)
-- Note: These are just placeholders, actual users should register through the API
-- Default librarian: username='librarian', password='password123'
-- Default member: username='member', password='password123'
