-- Quick Setup Script for Categories and Places
-- Run this in your PostgreSQL database

-- First, let's clear existing data (optional - remove if you want to keep existing data)
-- DELETE FROM "Place";
-- DELETE FROM "Category";

-- Insert Categories
INSERT INTO "Category" (name, image, color, "bgColor", description, animation) VALUES
('Beaches & Coastal', '/images/categories/beaches.png', '#1e40af', 'linear-gradient(135deg, #1e40af, #3b82f6)', 'Pristine beaches and coastal destinations with golden sands and turquoise waters', 'waves'),
('Rainforests & Natural', '/images/categories/rainforests.png', '#059669', 'linear-gradient(135deg, #059669, #10b981)', 'Lush rainforests and natural reserves teeming with biodiversity', 'forest'),
('National Parks & Wildlife', '/images/categories/wildlife.png', '#92400e', 'linear-gradient(135deg, #92400e, #b45309)', 'Wildlife sanctuaries and national parks for incredible animal encounters', 'wildlife')
ON CONFLICT DO NOTHING;

-- Insert Sample Places (using categoryId 1, 2, 3 - adjust if your IDs are different)
-- You can check your category IDs by running: SELECT id, name FROM "Category";

-- Places for Category 1 (Beaches & Coastal)
INSERT INTO "Place" (name, description, image, "categoryId") VALUES
('Mirissa Beach', 'A beautiful crescent-shaped beach known for whale watching and vibrant beach cafes. Perfect for surfing and sunset views.', '/images/places/mirissa.png', 1),
('Hikkaduwa Beach', 'Famous for its coral reefs, surfing spots, and lively nightlife. A paradise for snorkeling and diving enthusiasts.', '/images/places/hikkaduwa.png', 1),
('Arugam Bay', 'World-class surfing destination on the east coast with pristine waves and laid-back atmosphere.', '/images/places/Arugam.jpg', 1),
('Pasikudah', 'Calm shallow waters perfect for swimming, with beautiful sandy beaches and family-friendly resorts.', '/images/places/Pasikudah.jpg', 1)
ON CONFLICT DO NOTHING;

-- Places for Category 2 (Rainforests & Natural)
INSERT INTO "Place" (name, description, image, "categoryId") VALUES
('Sinharaja Forest Reserve', 'UNESCO World Heritage rainforest with incredible biodiversity and rare endemic species.', '/images/places/Sinharaja.jpg', 2),
('Kanneliya Forest Reserve', 'Ancient rainforest reserve with unique flora and fauna, ideal for nature walks and bird watching.', '/images/places/Kanneliya.jpg', 2)
ON CONFLICT DO NOTHING;

-- Places for Category 3 (National Parks & Wildlife)
INSERT INTO "Place" (name, description, image, "categoryId") VALUES
('Yala National Park', 'Famous for having the highest density of leopards in the world, along with elephants and diverse wildlife.', '/images/places/yala.jpg', 3),
('Udawalawe National Park', 'Home to large herds of elephants and an important wildlife conservation area.', '/images/places/udawalawe.jpg', 3)
ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT 'Categories:' as info, COUNT(*) as count FROM "Category"
UNION ALL
SELECT 'Places:', COUNT(*) FROM "Place";

-- View all data
SELECT c.name as category, COUNT(p.id) as place_count 
FROM "Category" c 
LEFT JOIN "Place" p ON c.id = p."categoryId" 
GROUP BY c.id, c.name 
ORDER BY c.id;
