-- PostgreSQL Schema for Templyfast Store

-- Drop tables if they exist to allow re-running the script
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS action_type CASCADE;

-- 1. Create ENUM type for activity_logs
CREATE TYPE action_type AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- 2. Create `users` table
-- This table is inferred from authController.js for admin management
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' NOT NULL
);

-- 3. Create `products` table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    file_url VARCHAR(500),
    category VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    quantity INTEGER DEFAULT 0 NOT NULL,
    product_links TEXT -- Inferred from productController.js
);

-- 4. Create `product_images` table
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

-- 5. Create `sales` table
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    product_id INTEGER, -- Can be NULL if product is deleted but sale record remains
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10, 2) NOT NULL,
    download_token VARCHAR(100) UNIQUE,
    download_expires TIMESTAMP WITH TIME ZONE, -- Allowing NULL for flexibility, review if 'NOT NULL' is desired with a default
    downloads_count INTEGER DEFAULT 0,
    stripe_session_id VARCHAR(255) UNIQUE, -- From migration_add_stripe_session_id_to_sales.sql
    CONSTRAINT fk_product_sale
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE SET NULL -- If product is deleted, set product_id to NULL
);

-- 6. Create `messages` table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'new' NOT NULL -- Inferred from messageController.js
);

-- 7. Create `activity_logs` table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    action_type action_type NOT NULL, -- Using the custom ENUM type
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add an index for faster querying by entity for activity_logs
CREATE INDEX idx_activity_logs_entity ON activity_logs (entity_type, entity_id);

-- Optional: Add a default admin user (replace 'admin' and 'your_hashed_password' with actual values)
-- INSERT INTO users (username, password_hash, role) VALUES ('admin', '$2a$10$YOUR_BCRYPT_HASH_HERE', 'admin');
-- You would generate this hash using bcrypt in your application.
-- For example, for password 'password123', the hash could be '$2b$10$dks.XAieHs0WTcb1pmGlQ.KbpNmjQwUdtgZZz4dtLfXUrePZrrbSK'
-- Make sure to replace '$2a$10$YOUR_BCRYPT_HASH_HERE' with a newly generated hash for security.

