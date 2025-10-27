-- Create a custom type for user roles
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

-- Create the users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

UPDATE users
SET role = 'ADMIN'
WHERE email = 'admin@gmail.com';

-- Create a custom type for difficulty levels
CREATE TYPE tour_difficulty AS ENUM ('Easy', 'Moderate', 'Challenging', 'Expert');

-- Create the tour_packages table
CREATE TABLE tour_packages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    duration INTEGER NOT NULL, -- Assuming duration is in days
    image_path VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    highlights JSONB, -- Using JSONB is efficient for arrays of text
    includes JSONB,
    difficulty tour_difficulty NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 0.00,
    reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tour_packages_updated_at
BEFORE UPDATE ON tour_packages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();




-- Optional cleanup if you created these objects before
DROP TABLE IF EXISTS bookings CASCADE;
DROP TYPE IF EXISTS booking_status;

-- Booking status values used across the admin UI
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- Main bookings table (App Router code expects these columns)
CREATE TABLE bookings (
    id              SERIAL PRIMARY KEY,
    package_id      INTEGER REFERENCES tour_packages(id) ON DELETE SET NULL,
    user_id         INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    customer_name   VARCHAR(255) NOT NULL,
    customer_email  VARCHAR(255) NOT NULL,
    customer_phone  VARCHAR(50),
    preferred_date  DATE NOT NULL,
    number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0),
    special_requests TEXT,
    status          booking_status NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful indexes for admin views
CREATE INDEX idx_bookings_package_id ON bookings(package_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Keep updated_at in sync automatically
CREATE OR REPLACE FUNCTION set_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bookings_set_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE PROCEDURE set_bookings_updated_at();





CREATE TABLE IF NOT EXISTS tour_package_images (
    id SERIAL PRIMARY KEY,
    package_id INTEGER NOT NULL REFERENCES tour_packages(id) ON DELETE CASCADE,
    image_path VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tour_package_images_package
    ON tour_package_images(package_id, sort_order);











CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(255),
    category VARCHAR(100),
    duration VARCHAR(50),
    location VARCHAR(255),
    highlights JSONB, -- Or TEXT[] for a simple array of strings
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Next, the main custom_packages table
CREATE TABLE custom_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Or SERIAL PRIMARY KEY for integer IDs
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Finally, the join table to link them
CREATE TABLE custom_package_places (
    custom_package_id UUID REFERENCES custom_packages(id) ON DELETE CASCADE, -- Use INTEGER if custom_packages.id is SERIAL
    place_id INTEGER REFERENCES places(id) ON DELETE RESTRICT,
    display_order INTEGER NOT NULL,
    PRIMARY KEY (custom_package_id, place_id)
);

-- Add indexes for better performance on foreign keys
CREATE INDEX ON custom_package_places (custom_package_id);
CREATE INDEX ON custom_package_places (place_id);















BEGIN;

-- 1) Enrich existing bookings with payment tracking
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS booking_reference VARCHAR(64),
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS receipt_url TEXT,
  ADD COLUMN IF NOT EXISTS receipt_uploaded_at TIMESTAMPTZ;

-- Optional, but handy to ensure references stay unique if you generate your own codes
CREATE UNIQUE INDEX IF NOT EXISTS bookings_booking_reference_uq
  ON bookings (booking_reference);

-- 2) Dedicated table for detailed receipt history (keeps multiple uploads/audit trail)
CREATE TABLE IF NOT EXISTS booking_receipts (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by TEXT  -- store staff/user identifier if you have one
);

CREATE INDEX IF NOT EXISTS booking_receipts_booking_id_idx
  ON booking_receipts (booking_id);

COMMIT;



CREATE TABLE gallery_items (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    avatar VARCHAR(255),
    rating NUMERIC(2, 1) CHECK (rating >= 0 AND rating <= 5),
    text TEXT NOT NULL
);


ALTER TABLE bookings 
ADD COLUMN dietary_preferences TEXT,
ADD COLUMN food_allergies TEXT;
--ADD COLUMN special_requests TEXT;

-- Optional: Add comments to document the columns
COMMENT ON COLUMN bookings.dietary_preferences IS 'Dietary preferences (e.g., vegetarian, vegan, halal, kosher)';
COMMENT ON COLUMN bookings.food_allergies IS 'Food allergies and intolerances';
COMMENT ON COLUMN bookings.special_requests IS 'Any other special requirements or requests';

ALTER TABLE bookings ADD COLUMN food_and_special_requests TEXT;

select *from bookings;
