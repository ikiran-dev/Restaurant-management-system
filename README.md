# Restaurant Management System

A complete full-stack solution for restaurants to create, manage, and share digital menus with QR code support.

## Features

- **Restaurant Management**: Create and manage multiple restaurants with detailed profiles
- **Menu Management**: Organize dishes into categories with pricing and descriptions
- **Digital Menus**: Beautiful, responsive public menu interface
- **QR Code Generation**: Generate and download QR codes for easy menu sharing
- **Authentication**: Secure login system with session management
- **Public Access**: Customers can view menus via unique URLs without authentication

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: Custom JWT-based sessions
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd digital-menu-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Update `.env.local` with your database credentials

5. Initialize the database:
\`\`\`bash
npm run db:push
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.



## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Restaurants
- `GET /api/restaurants` - List user's restaurants
- `POST /api/restaurants` - Create restaurant
- `GET /api/restaurants/[id]` - Get restaurant details
- `PATCH /api/restaurants/[id]` - Update restaurant
- `DELETE /api/restaurants/[id]` - Delete restaurant

### Categories
- `GET /api/categories?restaurantId=[id]` - List categories
- `POST /api/categories` - Create category
- `PATCH /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Dishes
- `GET /api/dishes?categoryId=[id]` - List dishes
- `POST /api/dishes` - Create dish
- `PATCH /api/dishes/[id]` - Update dish
- `DELETE /api/dishes/[id]` - Delete dish

### Menus
- `GET /api/menus?restaurantId=[id]` - List menus
- `POST /api/menus` - Create menu
- `PATCH /api/menus/[id]` - Update menu
- `DELETE /api/menus/[id]` - Delete menu

### Public API
- `GET /api/public/menu/[slug]` - Get public menu by slug

## Database Schema

The system uses Prisma ORM with PostgreSQL. Key models include:

- **User**: Restaurant owners and admins
- **Restaurant**: Restaurant profiles with branding
- **Category**: Menu categories (Appetizers, Mains, etc.)
- **Dish**: Individual menu items with prices
- **Menu**: Published menus linked to restaurants

## Development

### Available Scripts

\`\`\`bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run db:push      # Sync database schema
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
npm run lint         # Run ESLint
\`\`\`

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Environment Variables for Vercel

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string from Neon
- `POSTGRES_URL` - Alternative PostgreSQL URL
- `POSTGRES_PRISMA_URL` - Prisma-specific connection string


