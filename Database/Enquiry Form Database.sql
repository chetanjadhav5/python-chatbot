CREATE DATABASE IF NOT EXISTS enquiries_db;
USE enquiries_db;

CREATE TABLE IF NOT EXISTS enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-increment for unique IDs
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM enquiries;
DELETE FROM enquiries WHERE id = 1;
TRUNCATE TABLE enquiries;