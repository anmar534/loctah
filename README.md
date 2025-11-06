# Loctah Platform 🛒

منصة عربية لمقارنة أسعار المنتجات بين المتاجر المختلفة - MVP

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 المميزات

- ✅ مقارنة الأسعار بين المتاجر
- ✅ دعم كامل للعربية والإنجليزية
- ✅ عرض المتاجر على الخريطة
- ✅ نظام المفضلة
- ✅ لوحة تحكم للإدارة والتجار

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
- Mapbox

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

```
loctah/
├── backend/          # Express + TypeScript API
├── frontend/         # Next.js Application
└── docker-compose.yml
```

## 🔑 الحسابات الافتراضية (بعد التشغيل)

- **Admin**: admin@loctah.com / admin123
- **Vendor**: vendor@loctah.com / vendor123
- **User**: user@loctah.com / user123

## 📝 الرخصة

MIT License
