import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.favorite.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@loctah.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const vendorUser = await prisma.user.create({
    data: {
      email: 'vendor@loctah.com',
      password: hashedPassword,
      name: 'Vendor User',
      role: 'VENDOR',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@loctah.com',
      password: hashedPassword,
      name: 'Regular User',
      role: 'USER',
    },
  });

  console.log('✅ Created users');

  // Create Categories
  const electronics = await prisma.category.create({
    data: {
      nameAr: 'إلكترونيات',
      nameEn: 'Electronics',
      slug: 'electronics',
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    },
  });

  const smartphones = await prisma.category.create({
    data: {
      nameAr: 'هواتف ذكية',
      nameEn: 'Smartphones',
      slug: 'smartphones',
      parentId: electronics.id,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    },
  });

  const laptops = await prisma.category.create({
    data: {
      nameAr: 'أجهزة كمبيوتر محمولة',
      nameEn: 'Laptops',
      slug: 'laptops',
      parentId: electronics.id,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    },
  });

  const fashion = await prisma.category.create({
    data: {
      nameAr: 'أزياء',
      nameEn: 'Fashion',
      slug: 'fashion',
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
    },
  });

  const home = await prisma.category.create({
    data: {
      nameAr: 'المنزل والحديقة',
      nameEn: 'Home & Garden',
      slug: 'home-garden',
      imageUrl: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a',
    },
  });

  console.log('✅ Created categories');

  // Create Stores
  const store1 = await prisma.store.create({
    data: {
      userId: vendorUser.id,
      name: 'Tech Store Riyadh',
      slug: 'tech-store-riyadh',
      phone: '+966501234567',
      address: 'King Fahd Road, Riyadh',
      city: 'Riyadh',
      latitude: 24.7136,
      longitude: 46.6753,
      logoUrl: 'https://ui-avatars.com/api/?name=Tech+Store',
    },
  });

  const store2 = await prisma.store.create({
    data: {
      userId: adminUser.id, // Admin can also have a store
      name: 'Electronics Hub Jeddah',
      slug: 'electronics-hub-jeddah',
      phone: '+966502345678',
      address: 'Tahlia Street, Jeddah',
      city: 'Jeddah',
      latitude: 21.5433,
      longitude: 39.1728,
      logoUrl: 'https://ui-avatars.com/api/?name=Electronics+Hub',
    },
  });

  console.log('✅ Created stores');

  // Create Products
  const iphone15 = await prisma.product.create({
    data: {
      nameAr: 'آيفون 15 برو',
      nameEn: 'iPhone 15 Pro',
      descriptionAr: 'أحدث هاتف من آبل مع شريحة A17 Pro',
      descriptionEn: 'Latest iPhone with A17 Pro chip',
      sku: 'IPHONE-15-PRO-256GB',
      slug: 'iphone-15-pro-256gb',
      brand: 'Apple',
      categoryId: smartphones.id,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569',
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569',
      ],
    },
  });

  const macbookPro = await prisma.product.create({
    data: {
      nameAr: 'ماك بوك برو 14 إنش',
      nameEn: 'MacBook Pro 14"',
      descriptionAr: 'لابتوب قوي مع شريحة M3 Pro',
      descriptionEn: 'Powerful laptop with M3 Pro chip',
      sku: 'MACBOOK-PRO-14-M3',
      slug: 'macbook-pro-14-m3',
      brand: 'Apple',
      categoryId: laptops.id,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      ],
    },
  });

  const samsungS24 = await prisma.product.create({
    data: {
      nameAr: 'سامسونج جالاكسي S24 الترا',
      nameEn: 'Samsung Galaxy S24 Ultra',
      descriptionAr: 'هاتف فلاجشيب من سامسونج',
      descriptionEn: 'Flagship phone from Samsung',
      sku: 'SAMSUNG-S24-ULTRA-512GB',
      slug: 'samsung-s24-ultra-512gb',
      brand: 'Samsung',
      categoryId: smartphones.id,
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c',
      ],
    },
  });

  console.log('✅ Created products');

  // Create Offers
  await prisma.offer.create({
    data: {
      productId: iphone15.id,
      storeId: store1.id,
      originalPrice: 4999,
      discountedPrice: 4499,
      discountPercent: 10,
      validUntil: new Date('2025-12-31'),
    },
  });

  await prisma.offer.create({
    data: {
      productId: iphone15.id,
      storeId: store2.id,
      originalPrice: 5199,
      discountedPrice: 4699,
      discountPercent: 10,
      validUntil: new Date('2025-12-31'),
    },
  });

  await prisma.offer.create({
    data: {
      productId: macbookPro.id,
      storeId: store1.id,
      originalPrice: 8999,
      discountedPrice: 7999,
      discountPercent: 11,
      validUntil: new Date('2025-12-31'),
    },
  });

  await prisma.offer.create({
    data: {
      productId: samsungS24.id,
      storeId: store2.id,
      originalPrice: 4599,
      discountedPrice: 3999,
      discountPercent: 13,
      validUntil: new Date('2025-12-31'),
    },
  });

  console.log('✅ Created offers');

  // Create Favorites
  await prisma.favorite.create({
    data: {
      userId: regularUser.id,
      productId: iphone15.id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: regularUser.id,
      productId: macbookPro.id,
    },
  });

  console.log('✅ Created favorites');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 Test accounts:');
  console.log('Admin: admin@loctah.com / password123');
  console.log('Vendor: vendor@loctah.com / password123');
  console.log('User: user@loctah.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
