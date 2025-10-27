-- Migration: Add food and special requirements field to bookings table
-- Run this SQL in your database to add a simple text field for all dietary/food-related information

-- Add a single TEXT column to store all food-related and special requirements
ALTER TABLE bookings 
ADD COLUMN food_and_special_requests TEXT;

-- Add comment for documentation
COMMENT ON COLUMN bookings.food_and_special_requests IS 'Food preferences, dietary requirements, allergies, and other special requests for all guests in the booking';

-- Example content:
-- "Guest 1 (John): Vegetarian, no nuts
--  Guest 2 (Mary): No dietary restrictions
--  Guest 3 (Tom): Vegan, allergic to shellfish
--  Additional: Celebrating anniversary, need quiet table"
