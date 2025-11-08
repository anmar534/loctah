# Loctah Platform 🛒

منصة عربية لمقارنة أسعار المنتجات بين المتاجر المختلفة - MVP

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 المميزات

- ✅ مقارنة الأسعار بين المتاجر
- ✅ دعم كامل للعربية والإنجليزية (RTL/LTR)
- ✅ عرض المتاجر على الخريطة
- ✅ نظام المفضلة
- ✅ لوحة تحكم شاملة للإدارة (100% Complete)
  - إدارة المتاجر (CRUD + Toggle Status)
  - إدارة الفئات (Tree View + Nested Categories)
  - إدارة المنتجات (Multi-image + Specs + SKU)
  - إدارة العروض (Auto-discount Calculator + Date Pickers)
  - إدارة المستخدمين (Role/Status Filters + Toggle)
- ✅ نظام ترجمة متقدم (500+ مفتاح ترجمة)

## 🛠️ التقنيات المستخدمة

### Backend
- Node.js 20+ + TypeScript 5+
- Express.js
- Prisma + PostgreSQL
- JWT Authentication

### Frontend
- Next.js 15 (App Router)
- TypeScript 5+
- Tailwind CSS
- shadcn/ui
- React Query
- Zustand
- next-intl
- MapLibre GL JS

## 📍 Mapping Library

**MapLibre GL JS** is used instead of Mapbox GL JS for the following reasons:
- **Open Source**: MapLibre GL JS is fully open-source (BSD-3-Clause license)
- **No Billing**: Free to use with no per-map-load costs or account requirements
- **API Compatible**: Drop-in replacement for Mapbox GL JS v1.x with similar API
- **Community Driven**: Maintained by the MapLibre organization with active community support

MapLibre GL JS can work with various tile providers including:
- OpenStreetMap-based tiles (Maptiler, Stadia Maps, etc.)
- Self-hosted tile servers
- Custom tile sources

For production deployment, configure a tile provider in the environment variables.

## 🚀 البدء

### المتطلبات
- Node.js 20+
- Docker & Docker Compose
- pnpm (or npm/yarn)

### التثبيت

1. **نسخ المشروع**
```bash
git clone <repository-url>
cd loctah
```

2. **تشغيل قاعدة البيانات**
```bash
docker-compose up -d
```

3. **إعداد Backend**
```bash
cd backend
npm install
cp .env.example .env
# قم بتعديل ملف .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

4. **إعداد Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
# قم بتعديل ملف .env.local
npm run dev
```

## 📁 هيكل المشروع

```text
loctah/
├── backend/              # Express + TypeScript API
├── frontend/             # Next.js 15 Application
│   ├── app/             # Next.js App Router
│   ├── components/      # React Components
│   ├── lib/             # Utilities & API
│   └── messages/        # i18n Translations
├── docker-compose.yml
├── CLAUDE.md            # Complete Documentation
└── README.md
```

## 📚 التوثيق

للحصول على توثيق شامل حول لوحة التحكم، راجع:

- **[CLAUDE.md](./CLAUDE.md)** - توثيق كامل للـ Admin Panel (100% Complete)
- **[ADMIN_PANEL_PROGRESS.md](./ADMIN_PANEL_PROGRESS.md)** - سجل التقدم
- **[FINAL_STRUCTURE_GUIDE.md](./FINAL_STRUCTURE_GUIDE.md)** - دليل البنية النهائية

## 🔑 الحسابات الافتراضية (بعد التشغيل)

- **Admin**: admin@loctah.com / admin123
- **Vendor**: vendor@loctah.com / vendor123
- **User**: user@loctah.com / user123

## 📝 الرخصة

MIT License
