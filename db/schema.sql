-- Create Database
CREATE DATABASE IF NOT EXISTS expense_tracker_db;
USE expense_tracker_db;

-- Table: Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Table: Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    expense_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type ENUM('Cash', 'Card', 'UPI', 'Other') NOT NULL,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE expenses
ADD COLUMN category VARCHAR(50) DEFAULT 'Other';