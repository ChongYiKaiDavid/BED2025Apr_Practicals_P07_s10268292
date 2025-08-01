-- SQL Script for Students Table
-- Execute this in your bed_db database

USE bed_db;
GO

-- Create Students Table
CREATE TABLE Students (
  student_id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(100) NOT NULL, -- Student name is required
  address VARCHAR(255) -- Address is optional
);

-- Insert sample students data
INSERT INTO Students (name, address)
VALUES
  ('John Smith', '123 Main Street, Anytown'),
  ('Jane Doe', '456 Oak Avenue, Somewhere'),
  ('Mike Johnson', '789 Pine Road, Elsewhere');

-- Verify data
SELECT * FROM Students;
