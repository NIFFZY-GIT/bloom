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










CREATE TABLE IF NOT EXISTS custom_places (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    image_path      VARCHAR(255),
    category        VARCHAR(40) NOT NULL,
    default_duration_minutes INTEGER CHECK (default_duration_minutes >= 0),
    base_price      NUMERIC(10,2) DEFAULT 0 CHECK (base_price >= 0),
    location        VARCHAR(255),
    highlights      TEXT[],
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Master record for every custom package request
CREATE TABLE IF NOT EXISTS custom_packages (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(160) NOT NULL,
    description         TEXT,
    total_duration_minutes INTEGER CHECK (total_duration_minutes >= 0),
    total_price         NUMERIC(10,2) DEFAULT 0 CHECK (total_price >= 0),
    pace                VARCHAR(20) NOT NULL DEFAULT 'moderate',      -- relaxed | moderate | fast
    transport           VARCHAR(20) NOT NULL DEFAULT 'walking',       -- walking | public | private
    wants_guide         BOOLEAN NOT NULL DEFAULT FALSE,
    wants_meals         BOOLEAN NOT NULL DEFAULT FALSE,
    wants_photography   BOOLEAN NOT NULL DEFAULT FALSE,
    contact_name        VARCHAR(150) NOT NULL,
    contact_email       VARCHAR(180) NOT NULL,
    contact_phone       VARCHAR(40),
    preferred_date      DATE,
    guests              INTEGER NOT NULL DEFAULT 1 CHECK (guests > 0),
    special_requests    TEXT,
    status              VARCHAR(20) NOT NULL DEFAULT 'NEW',           -- NEW | IN_PROGRESS | SENT | CLOSED
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Places attached to each custom package
CREATE TABLE IF NOT EXISTS custom_package_places (
    id              SERIAL PRIMARY KEY,
    custom_package_id INTEGER NOT NULL REFERENCES custom_packages(id) ON DELETE CASCADE,
    place_id        INTEGER REFERENCES custom_places(id),             -- optional link to catalog
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    image_path      VARCHAR(255),
    category        VARCHAR(40),
    duration_label  VARCHAR(40),
    duration_minutes INTEGER CHECK (duration_minutes >= 0),
    price           NUMERIC(10,2) DEFAULT 0 CHECK (price >= 0),
    location        VARCHAR(255),
    highlights      TEXT[],
    display_order   INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional gallery images uploaded with a custom package
CREATE TABLE IF NOT EXISTS custom_package_images (
    id              SERIAL PRIMARY KEY,
    custom_package_id INTEGER NOT NULL REFERENCES custom_packages(id) ON DELETE CASCADE,
    image_path      VARCHAR(255) NOT NULL,
    alt_text        VARCHAR(150),
    sort_order      INTEGER DEFAULT 1,
    uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Keep updated_at in sync
CREATE OR REPLACE FUNCTION set_updated_at_custom_packages()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_custom_packages_updated_at
BEFORE UPDATE ON custom_packages
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_custom_packages();

-- Supporting indexes
CREATE INDEX IF NOT EXISTS idx_custom_package_places_package
    ON custom_package_places(custom_package_id, display_order);

CREATE INDEX IF NOT EXISTS idx_custom_packages_status
    ON custom_packages(status);


















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