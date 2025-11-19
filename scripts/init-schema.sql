-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'RESTAURANT_OWNER',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);

-- Create Restaurant table
CREATE TABLE IF NOT EXISTS "Restaurant" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  phone TEXT,
  email TEXT,
  logo TEXT,
  theme TEXT NOT NULL DEFAULT 'light',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Restaurant_userId_idx" ON "Restaurant"("userId");

-- Create Category table
CREATE TABLE IF NOT EXISTS "Category" (
  id TEXT PRIMARY KEY,
  "restaurantId" TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Category_restaurantId_idx" ON "Category"("restaurantId");

-- Create Dish table
CREATE TABLE IF NOT EXISTS "Dish" (
  id TEXT PRIMARY KEY,
  "categoryId" TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("categoryId") REFERENCES "Category"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Dish_categoryId_idx" ON "Dish"("categoryId");

-- Create Menu table
CREATE TABLE IF NOT EXISTS "Menu" (
  id TEXT PRIMARY KEY,
  "restaurantId" TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  "isPublic" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Menu_restaurantId_idx" ON "Menu"("restaurantId");
CREATE INDEX IF NOT EXISTS "Menu_slug_idx" ON "Menu"(slug);
