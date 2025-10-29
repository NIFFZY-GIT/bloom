-- First, insert all categories
INSERT INTO "Category" (name, image, color, "bgColor", description, animation) VALUES
('Beaches & Coastal', '/images/categories/beaches.png', '#1e40af', 'linear-gradient(135deg, #1e40af, #3b82f6)', 'Pristine beaches and coastal destinations with golden sands and turquoise waters', 'waves'),
('Rainforests & Natural', '/images/categories/rainforests.png', '#059669', 'linear-gradient(135deg, #059669, #10b981)', 'Lush rainforests and natural reserves teeming with biodiversity', 'forest'),
('National Parks & Wildlife', '/images/categories/wildlife.png', '#92400e', 'linear-gradient(135deg, #92400e, #b45309)', 'Wildlife sanctuaries and national parks for incredible animal encounters', 'wildlife'),
('Cultural Heritage', '/images/categories/cultural.png', '#7c3aed', 'linear-gradient(135deg, #7c3aed, #8b5cf6)', 'Ancient cities and UNESCO World Heritage sites', 'heritage'),
('Hill Country', '/images/categories/hill-country.png', '#0d9488', 'linear-gradient(135deg, #0d9488, #14b8a6)', 'Scenic highlands with tea plantations and cool climates', 'mountains'),
('Religious & Spiritual', '/images/categories/temples.png', '#dc2626', 'linear-gradient(135deg, #dc2626, #ef4444)', 'Sacred temples, churches, and spiritual sites', 'spiritual'),
('Urban & Modern', '/images/categories/urban.png', '#4f46e5', 'linear-gradient(135deg, #4f46e5, #6366f1)', 'Modern cities with contemporary attractions', 'urban'),
('Waterfalls & Lakes', '/images/categories/waterfalls.png', '#0891b2', 'linear-gradient(135deg, #0891b2, #06b6d4)', 'Majestic waterfalls and serene lakes', 'waterfalls'),
('Adventure & Eco', '/images/categories/adventure.png', '#65a30d', 'linear-gradient(135deg, #65a30d, #84cc16)', 'Thrilling adventures and eco-tourism experiences', 'adventure'),
('Village & Cultural', '/images/categories/village.png', '#db2777', 'linear-gradient(135deg, #db2777, #ec4899)', 'Traditional village life and cultural experiences', 'village'),
('Fortresses & Colonial', '/images/categories/fortresses.png', '#d97706', 'linear-gradient(135deg, #d97706, #f59e0b)', 'Historic fortresses and colonial architecture', 'fortresses');

-- Then insert places (using categoryId from above)
-- Beaches & Coastal (categoryId = 1)
INSERT INTO "Place" (name, description, image, "categoryId") VALUES
('Mirissa', 'A beautiful crescent-shaped beach known for whale watching and vibrant beach cafes. Perfect for surfing and sunset views.', '/images/places/mirissa.png', 1),
('Hikkaduwa', 'Famous for its coral reefs, surfing spots, and lively nightlife. A paradise for snorkeling and diving enthusiasts.', '/images/places/hikkaduwa.png', 1),
('Arugam Bay', 'World-class surfing destination on the east coast', '/images/places/Arugam.jpg', 1),
('Pasikudah', 'Calm shallow waters perfect for swimming', '/images/places/Pasikudah.jpg', 1);

-- Rainforests & Natural (categoryId = 2)
INSERT INTO "Place" (name, description, image, "categoryId") VALUES
('Sinharaja Forest', 'UNESCO World Heritage rainforest with incredible biodiversity', '/images/places/Sinharaja.jpg', 2),
('Kanneliya', 'Ancient rainforest reserve with unique flora and fauna', '/images/places/Kanneliya.jpg', 2);

-- National Parks & Wildlife (categoryId = 3)
INSERT INTO "Place" (name, description, image, "categoryId") VALUES
('Yala National Park', 'Famous for leopards and diverse wildlife', '/images/places/mirissa.png', 3),
('Udawalawe', 'Elephant sanctuary and wildlife park', '/images/places/hikkaduwa.png', 3),
('Wilpattu', 'Largest national park with leopards and sloth bears', '/images/places/Arugam.jpg', 3),
('Minneriya', 'Famous for elephant gathering', '/images/places/Pasikudah.jpg', 3);
