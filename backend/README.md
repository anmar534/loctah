# Loctah Backend API

Backend API for Loctah Price Comparison Platform built with Express.js, TypeScript, and Prisma.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- pnpm (or npm/yarn)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start database**
```bash
# In root directory
docker-compose up -d
```

4. **Run migrations**
```bash
npm run prisma:migrate
```

5. **Seed database**
```bash
npm run prisma:seed
```

6. **Start development server**
```bash
npm run dev
```

API will be available at `http://localhost:3001`

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validators/      # Zod validation schemas
│   └── index.ts         # App entry point
└── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (Protected)

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `GET /api/v1/products/slug/:slug` - Get product by slug
- `POST /api/v1/products` - Create product (Admin)
- `PUT /api/v1/products/:id` - Update product (Admin)
- `DELETE /api/v1/products/:id` - Delete product (Admin)

### Categories
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `GET /api/v1/categories/slug/:slug` - Get category by slug
- `POST /api/v1/categories` - Create category (Admin)
- `PUT /api/v1/categories/:id` - Update category (Admin)
- `DELETE /api/v1/categories/:id` - Delete category (Admin)

### Stores
- `GET /api/v1/stores` - Get all stores
- `GET /api/v1/stores/:id` - Get store by ID
- `POST /api/v1/stores` - Create store (Vendor)
- `PUT /api/v1/stores/:id` - Update store (Vendor/Admin)
- `DELETE /api/v1/stores/:id` - Delete store (Admin)

### Offers
- `GET /api/v1/products/:productId/offers` - Get product offers
- `POST /api/v1/offers` - Create offer (Vendor)
- `PUT /api/v1/offers/:id` - Update offer (Vendor)
- `DELETE /api/v1/offers/:id` - Delete offer (Vendor)

### Favorites
- `GET /api/v1/favorites` - Get user favorites (Protected)
- `POST /api/v1/favorites` - Add to favorites (Protected)
- `DELETE /api/v1/favorites/:productId` - Remove from favorites (Protected)
- `GET /api/v1/favorites/check/:productId` - Check if favorited (Protected)

## 🧪 Test Accounts

After seeding the database:
- **Admin**: admin@loctah.com / password123
- **Vendor**: vendor@loctah.com / password123
- **User**: user@loctah.com / password123

## 🛠️ Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run prisma:migrate  # Run database migrations
npm run prisma:seed  # Seed database
npm run prisma:studio   # Open Prisma Studio
```

## 📝 Environment Variables

```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/loctah"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## 📄 License

MIT
