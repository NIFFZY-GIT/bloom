-- ============================================================================
-- Bloom Tours Database Schema
-- Complete database setup for tour package booking system
-- ============================================================================

-- Drop database if exists and create new one
DROP DATABASE IF EXISTS Bloom_db;
CREATE DATABASE Bloom_db;

-- Connect to the database
\c Bloom_db;

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================

-- User role enum
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

-- Tour difficulty levels
CREATE TYPE tour_difficulty AS ENUM ('Easy', 'Moderate', 'Challenging', 'Expert');

-- Booking status enum
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- TOUR PACKAGES TABLE
-- ============================================================================

CREATE TABLE tour_packages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    duration INTEGER NOT NULL, -- Duration in days
    image_path VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    highlights JSONB, -- Array of highlight text
    includes JSONB, -- Array of what's included
    difficulty tour_difficulty NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 0.00,
    reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for tour packages
CREATE INDEX idx_tour_packages_category ON tour_packages(category);
CREATE INDEX idx_tour_packages_difficulty ON tour_packages(difficulty);

-- ============================================================================
-- TOUR PACKAGE IMAGES TABLE (Gallery for each package)
-- ============================================================================

CREATE TABLE tour_package_images (
    id SERIAL PRIMARY KEY,
    package_id INTEGER NOT NULL REFERENCES tour_packages(id) ON DELETE CASCADE,
    image_path VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for tour package images
CREATE INDEX idx_tour_package_images_package ON tour_package_images(package_id, sort_order);

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    package_id INTEGER REFERENCES tour_packages(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    preferred_date DATE NOT NULL,
    number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0),
    special_requests TEXT,
    dietary_preferences TEXT,
    food_allergies TEXT,
    food_and_special_requests TEXT,
    booking_reference VARCHAR(64) UNIQUE,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    receipt_url TEXT,
    receipt_uploaded_at TIMESTAMPTZ,
    status booking_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for bookings
CREATE INDEX idx_bookings_package_id ON bookings(package_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_reference ON bookings(booking_reference);

-- Add comments to document columns
COMMENT ON COLUMN bookings.dietary_preferences IS 'Dietary preferences (e.g., vegetarian, vegan, halal, kosher)';
COMMENT ON COLUMN bookings.food_allergies IS 'Food allergies and intolerances';
COMMENT ON COLUMN bookings.special_requests IS 'Any other special requirements or requests';
COMMENT ON COLUMN bookings.booking_reference IS 'Unique reference code for the booking';
COMMENT ON COLUMN bookings.payment_status IS 'Payment status: pending, paid, refunded, etc.';

-- ============================================================================
-- BOOKING RECEIPTS TABLE (Payment receipt history)
-- ============================================================================

CREATE TABLE booking_receipts (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    mime_type TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    uploaded_by TEXT
);

-- Create indexes for booking receipts
CREATE INDEX idx_booking_receipts_booking_id ON booking_receipts(booking_id);

-- ============================================================================
-- PLACES TABLE (For custom package creation)
-- ============================================================================

CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(255),
    gallery_images JSONB DEFAULT '[]'::jsonb,
    category VARCHAR(100),
    duration VARCHAR(50),
    location VARCHAR(255),
    highlights JSONB,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for places
CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_location ON places(location);

-- Add comment for gallery_images
COMMENT ON COLUMN places.gallery_images IS 'Array of image URLs/paths for the place gallery. First image is the main image.';

-- ============================================================================
-- CUSTOM PACKAGES TABLE (User-created custom tour packages)
-- ============================================================================

CREATE TABLE custom_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_duration_minutes INTEGER,
    total_duration_label VARCHAR(50),
    guests INTEGER NOT NULL DEFAULT 1,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    start_date DATE,
    end_date DATE,
    food_and_special_requests TEXT,
    additional_info TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    quotation_pdf_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for custom packages
CREATE INDEX idx_custom_packages_status ON custom_packages(status);
CREATE INDEX idx_custom_packages_contact_email ON custom_packages(contact_email);
CREATE INDEX idx_custom_packages_created_at ON custom_packages(created_at DESC);

-- Add comment for quotation_pdf_path
COMMENT ON COLUMN custom_packages.quotation_pdf_path IS 'Path to the uploaded quotation PDF file';

-- ============================================================================
-- CUSTOM PACKAGE PLACES (Join table for custom packages and places)
-- ============================================================================

CREATE TABLE custom_package_places (
    custom_package_id UUID REFERENCES custom_packages(id) ON DELETE CASCADE,
    place_id INTEGER REFERENCES places(id) ON DELETE RESTRICT,
    display_order INTEGER NOT NULL,
    PRIMARY KEY (custom_package_id, place_id)
);

-- Create indexes for custom package places
CREATE INDEX idx_custom_package_places_custom_package_id ON custom_package_places(custom_package_id);
CREATE INDEX idx_custom_package_places_place_id ON custom_package_places(place_id);

-- ============================================================================
-- GALLERY ITEMS TABLE (For main gallery page)
-- ============================================================================

CREATE TABLE gallery_items (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for gallery items
CREATE INDEX idx_gallery_items_category ON gallery_items(category);

-- ============================================================================
-- REVIEWS TABLE (Customer testimonials)
-- ============================================================================

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    avatar VARCHAR(255),
    rating NUMERIC(2, 1) CHECK (rating >= 0 AND rating <= 5),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for reviews
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tour_packages
CREATE TRIGGER trigger_tour_packages_updated_at
BEFORE UPDATE ON tour_packages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to bookings
CREATE TRIGGER trigger_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to places
CREATE TRIGGER trigger_places_updated_at
BEFORE UPDATE ON places
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to custom_packages
CREATE TRIGGER trigger_custom_packages_updated_at
BEFORE UPDATE ON custom_packages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (Optional - Create default admin user)
-- ============================================================================

-- Note: You should update the password hash with your actual admin password
-- The password should be hashed using bcrypt before insertion
-- Example: INSERT INTO users (username, email, password_hash, role) 
--          VALUES ('admin', 'admin@bloom.com', '$2b$10$...', 'ADMIN');

-- ============================================================================
-- DIRECTORY STRUCTURE FOR UPLOADS
-- ============================================================================

-- The following directories should be created in public/uploads/:
-- - custom_places/     (for place images)
-- - packages/          (for package gallery images)
-- - gallery/           (for gallery items)
-- - reviews/           (for review portrait images)
-- - quotations/        (for custom package quotation PDFs)

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. All timestamps use TIMESTAMP WITH TIME ZONE for proper timezone handling
-- 2. JSONB is used for arrays to allow efficient querying and indexing
-- 3. Foreign keys use appropriate ON DELETE actions to maintain data integrity
-- 4. Indexes are created on frequently queried columns for performance
-- 5. The gallery_images column in places table stores an array of image paths
-- 6. Custom packages use UUID for better security and distributed systems support
-- 7. Booking references should be unique for tracking purposes
-- 8. All updated_at columns are automatically maintained by triggers

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
