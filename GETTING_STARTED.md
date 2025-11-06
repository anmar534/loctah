# Loctah Platform - Getting Started Guide

This guide will help you set up and run the complete Loctah platform (Backend + Frontend).

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

## 🚀 Complete Setup (5 Minutes)

### Step 1: Start Database (1 min)

```bash
# In the root directory
docker-compose up -d
```

Wait for PostgreSQL to start. You should see:
```
✅ Container loctah-postgres  Started
```

### Step 2: Setup Backend (2 min)

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed

# Start backend server
npm run dev
```

Backend will start on: **http://localhost:3001**

You should see:
```
🚀 Server started successfully!
📍 Environment: development
🌐 Server running on: http://localhost:3001
```

### Step 3: Setup Frontend (2 min)

Open a **new terminal** window:

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# (Optional) Get Mapbox token
# Visit: https://www.mapbox.com/
# Sign up and copy your token to .env.local

# Start frontend server
npm run dev
```

Frontend will start on: **http://localhost:3000**

## ✅ Test the Platform

1. **Open browser**: Navigate to http://localhost:3000

2. **Test Login**:
   - Email: `user@loctah.com`
   - Password: `password123`

3. **Admin Login**:
   - Email: `admin@loctah.com`
   - Password: `password123`

4. **Vendor Login**:
   - Email: `vendor@loctah.com`
   - Password: `password123`

## 📁 Project Structure Overview

```
loctah/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   └── validators/   # Input validation
│   └── prisma/
│       └── schema.prisma # Database schema
│
├── frontend/             # Next.js App
│   ├── app/
│   │   └── [locale]/     # Multi-language pages
│   ├── components/       # React components
│   ├── lib/
│   │   ├── api/          # API clients
│   │   └── stores/       # State management
│   └── messages/         # Translations
│
└── docker-compose.yml    # Database setup
```

## 🛠️ Development Workflow

### Backend Development

```bash
cd backend

# Start dev server (auto-reload)
npm run dev

# View database in browser
npm run prisma:studio

# Run migrations after schema changes
npm run prisma:migrate

# Reset database
npm run prisma:migrate reset
```

### Frontend Development

```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Run linter
npm run lint
```

## 🔧 Common Commands

### Database Commands

```bash
# View all data in Prisma Studio
cd backend
npm run prisma:studio

# Reset and reseed database
npm run prisma:migrate reset
npm run prisma:seed

# Generate Prisma Client after schema changes
npm run prisma:generate
```

### API Testing

You can test the API using:
- **Browser**: http://localhost:3001/api/v1/health
- **Postman**: Import the API endpoints
- **cURL**:
  ```bash
  curl http://localhost:3001/api/v1/products
  ```

## 📊 API Endpoints Quick Reference

### Authentication
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user (Protected)

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/:id` - Get product
- `POST /api/v1/products` - Create (Admin only)

### Categories
- `GET /api/v1/categories` - List categories
- `POST /api/v1/categories` - Create (Admin only)

### Stores
- `GET /api/v1/stores` - List stores
- `POST /api/v1/stores` - Create (Vendor/Admin)

### Offers
- `GET /api/v1/products/:id/offers` - Get product offers
- `POST /api/v1/offers` - Create offer (Vendor)

### Favorites
- `GET /api/v1/favorites` - Get favorites (Protected)
- `POST /api/v1/favorites` - Add favorite (Protected)

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Restart Docker container
docker-compose down
docker-compose up -d

# Wait 10 seconds, then run migrations
cd backend
npm run prisma:migrate
```

### Port Already in Use
```bash
# Backend (3001)
# Find and kill the process
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Frontend (3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies Issues
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Next Development Steps

1. **Add Components**: Create UI components using shadcn/ui
   ```bash
   cd frontend
   npx shadcn@latest add button input card
   ```

2. **Create Pages**: Add pages in `app/[locale]/` directory

3. **API Integration**: Use React Query for data fetching

4. **Testing**: Add test accounts and test all features

5. **Deployment**: 
   - Backend: Deploy to Railway, Render, or DigitalOcean
   - Frontend: Deploy to Vercel or Netlify
   - Database: Use managed PostgreSQL (Supabase, Railway, etc.)

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Need Help?

- Check `backend/README.md` for backend details
- Check `frontend/README.md` for frontend details
- Review the main `README.md` for project overview

---

**Happy Coding! 🎉**
