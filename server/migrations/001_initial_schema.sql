-- Initial database schema migration for PostgreSQL
-- Migration: 001_initial_schema.sql
-- Created: 2025-07-17

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create places table
CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8) DEFAULT 0,
    longitude DECIMAL(11, 8) DEFAULT 0,
    place_id VARCHAR(255),
    url TEXT,
    notes TEXT,
    rating DECIMAL(2, 1),
    source_list VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create place_categories junction table
CREATE TABLE place_categories (
    place_id UUID REFERENCES places(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (place_id, category_id)
);

-- Create performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_places_user_id ON places(user_id);
CREATE INDEX idx_places_name ON places(name);
CREATE INDEX idx_places_address ON places(address);
CREATE INDEX idx_places_coordinates ON places(latitude, longitude);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_place_categories_place_id ON place_categories(place_id);
CREATE INDEX idx_place_categories_category_id ON place_categories(category_id);

-- Create full-text search indexes for better search performance
CREATE INDEX idx_places_name_gin ON places USING gin(to_tsvector('english', name));
CREATE INDEX idx_places_address_gin ON places USING gin(to_tsvector('english', address));
CREATE INDEX idx_places_notes_gin ON places USING gin(to_tsvector('english', notes));
