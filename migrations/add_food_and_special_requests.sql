-- Add food_and_special_requests column to bookings table if it doesn't exist
-- Run this migration to enable food preferences and dietary requirements tracking

DO $$ 
BEGIN
    -- Check if the column already exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'food_and_special_requests'
    ) THEN
        -- Add the column
        ALTER TABLE bookings 
        ADD COLUMN food_and_special_requests TEXT;
        
        RAISE NOTICE 'Column food_and_special_requests added successfully';
    ELSE
        RAISE NOTICE 'Column food_and_special_requests already exists';
    END IF;
END $$;

-- Add a comment to document the column
COMMENT ON COLUMN bookings.food_and_special_requests IS 'Food preferences, dietary requirements, and allergies (e.g., "2 vegetarian, 1 vegan, 1 gluten-free")';

-- Verify the column exists
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name = 'food_and_special_requests';
