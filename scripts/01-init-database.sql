-- Create initial database schema for Digital Menu Management System
-- Run this script after Prisma migrations

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_restaurant_user_id ON "Restaurant"("userId");
CREATE INDEX IF NOT EXISTS idx_category_restaurant_id ON "Category"("restaurantId");
CREATE INDEX IF NOT EXISTS idx_dish_category_id ON "Dish"("categoryId");
CREATE INDEX IF NOT EXISTS idx_menu_restaurant_id ON "Menu"("restaurantId");
CREATE INDEX IF NOT EXISTS idx_menu_slug ON "Menu"(slug);

-- Create fulltext index for restaurant search
CREATE INDEX IF NOT EXISTS idx_restaurant_fulltext ON "Restaurant" USING GIN(
  to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, ''))
);
