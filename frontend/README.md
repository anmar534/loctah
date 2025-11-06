# Loctah Frontend

Frontend application for Loctah Price Comparison Platform built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Backend API running on `http://localhost:3001`

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env.local
# Add your Mapbox token in .env.local
```

3. **Start development server**
```bash
npm run dev
```

Application will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── app/
│   └── [locale]/           # Internationalized routes
│       ├── layout.tsx
│       ├── page.tsx
│       ├── products/
│       ├── stores/
│       ├── auth/
│       └── dashboard/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layouts/            # Layout components
│   ├── products/           # Product components
│   └── forms/              # Form components
├── lib/
│   ├── api/                # API client functions
│   ├── stores/             # Zustand stores
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── messages/
│   ├── ar.json             # Arabic translations
│   └── en.json             # English translations
└── public/                 # Static assets
```

## 🌐 Features

### Implemented
- ✅ Multi-language support (Arabic/English)
- ✅ Authentication (Login/Register)
- ✅ Product listing and search
- ✅ Product details with price comparison
- ✅ Categories browsing
- ✅ Stores with map integration
- ✅ Favorites system
- ✅ User dashboard
- ✅ Admin panel
- ✅ Responsive design

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Internationalization**: next-intl
- **Maps**: Mapbox GL
- **HTTP Client**: Axios

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🗺️ Routes

### Public Routes
- `/` - Homepage
- `/products` - Products listing
- `/products/[slug]` - Product details
- `/categories/[slug]` - Category products
- `/stores` - Stores map
- `/auth/login` - Login page
- `/auth/register` - Register page

### Protected Routes (User)
- `/dashboard` - User dashboard
- `/dashboard/favorites` - User favorites

### Protected Routes (Admin)
- `/admin` - Admin dashboard
- `/admin/products` - Manage products
- `/admin/categories` - Manage categories
- `/admin/stores` - Manage stores

## 🌍 Internationalization

The app supports Arabic and English. Language can be switched using the language selector in the header.

Routes are prefixed with locale:
- `/ar/products` - Arabic
- `/en/products` - English

## 📦 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

## 🎯 Next Steps

To complete the MVP, you need to:

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Add shadcn/ui components**
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add button input card dialog
   ```

3. **Get Mapbox token**
   - Sign up at https://www.mapbox.com/
   - Copy your access token
   - Add to `.env.local`

4. **Start development**
   ```bash
   npm run dev
   ```

## 📝 License

MIT
