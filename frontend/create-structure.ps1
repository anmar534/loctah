# Script to create the complete frontend structure for Loctah

$baseDir = "c:\Users\ammn\Desktop\loctah\frontend\app\[locale]"
$filesCreated = 0

# Create all directories
$dirs = @(
    "(public)\products\[slug]",
    "(public)\categories\[slug]",
    "(public)\stores\[id]",
    "(public)\search",
    "(auth)\login",
    "(auth)\register",
    "(user)\profile\favorites",
    "(user)\profile\settings",
    "(user)\profile\reviews",
    "(vendor)\vendor\store\edit",
    "(vendor)\vendor\offers\create",
    "(vendor)\vendor\offers\[id]\edit",
    "(admin)\admin\products\create",
    "(admin)\admin\products\[id]\edit",
    "(admin)\admin\categories\create",
    "(admin)\admin\stores\[id]\verify",
    "(admin)\admin\offers",
    "(admin)\admin\users\[id]"
)

Write-Host "Creating directories..." -ForegroundColor Green
foreach ($dir in $dirs) {
    $fullPath = Join-Path $baseDir $dir
    New-Item -Path $fullPath -ItemType Directory -Force | Out-Null
}

# Create (public) layout
$publicLayoutContent = @'
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="text-2xl font-bold text-indigo-600">لُقطة</div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-gray-50 border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm">
          &copy; 2025 لُقطة
        </div>
      </footer>
    </div>
  );
}
'@

$publicLayoutPath = Join-Path $baseDir "(public)\layout.tsx"
[System.IO.File]::WriteAllText($publicLayoutPath, $publicLayoutContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (public)/products/page.tsx
$productsPageContent = @'
export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">المنتجات</h1>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="bg-gray-200 h-48 rounded mb-4"></div>
            <h3 className="font-semibold text-lg mb-2">منتج {i}</h3>
            <p className="text-gray-600 mb-3">وصف المنتج</p>
            <div className="text-xl font-bold text-indigo-600">299 ريال</div>
          </div>
        ))}
      </div>
    </div>
  );
}
'@

$productsPagePath = Join-Path $baseDir "(public)\products\page.tsx"
[System.IO.File]::WriteAllText($productsPagePath, $productsPageContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (public)/products/[slug]/page.tsx
$productSlugContent = @'
export default function ProductSlugPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">منتج: {params.slug}</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-200 h-96 rounded"></div>
        <div>
          <p className="text-gray-600 mb-6">تفاصيل المنتج</p>
          <div className="text-3xl font-bold text-indigo-600 mb-4">299 ريال</div>
        </div>
      </div>
    </div>
  );
}
'@

$productSlugPath = Join-Path $baseDir "(public)\products\[slug]\page.tsx"
[System.IO.File]::WriteAllText($productSlugPath, $productSlugContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (public)/categories/[slug]/page.tsx
$categorySlugContent = @'
export default function CategorySlugPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">فئة: {params.slug}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="bg-gray-200 h-48 rounded mb-4"></div>
            <h3 className="font-semibold text-lg mb-2">منتج {i}</h3>
            <div className="text-xl font-bold text-indigo-600">299 ريال</div>
          </div>
        ))}
      </div>
    </div>
  );
}
'@

$categorySlugPath = Join-Path $baseDir "(public)\categories\[slug]\page.tsx"
[System.IO.File]::WriteAllText($categorySlugPath, $categorySlugContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (public)/stores/page.tsx
$storesPageContent = @'
export default function StoresPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">المتاجر</h1>
      <div className="bg-gray-200 h-96 rounded mb-8 flex items-center justify-center">
        <p className="text-gray-600">خريطة المتاجر</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-xl mb-2">متجر {i}</h3>
            <p className="text-gray-600 mb-4">العنوان</p>
            <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded">عرض</button>
          </div>
        ))}
      </div>
    </div>
  );
}
'@

$storesPagePath = Join-Path $baseDir "(public)\stores\page.tsx"
[System.IO.File]::WriteAllText($storesPagePath, $storesPageContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (public)/stores/[id]/page.tsx
$storeIdContent = @'
export default function StorePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">متجر {params.id}</h1>
      <div className="bg-gray-200 h-64 rounded mb-6"></div>
      <h2 className="text-2xl font-bold mb-4">عروض المتجر</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2">عرض {i}</h3>
            <div className="text-xl font-bold text-indigo-600">299 ريال</div>
          </div>
        ))}
      </div>
    </div>
  );
}
'@

$storeIdPath = Join-Path $baseDir "(public)\stores\[id]\page.tsx"
[System.IO.File]::WriteAllText($storeIdPath, $storeIdContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (public)/search/page.tsx
$searchPageContent = @'
export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">البحث</h1>
      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="ابحث عن منتجات..."
          className="w-full px-6 py-4 border-2 rounded-lg"
        />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="bg-gray-200 h-48 rounded mb-4"></div>
            <h3 className="font-semibold mb-2">نتيجة {i}</h3>
            <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded">عرض</button>
          </div>
        ))}
      </div>
    </div>
  );
}
'@

$searchPagePath = Join-Path $baseDir "(public)\search\page.tsx"
[System.IO.File]::WriteAllText($searchPagePath, $searchPageContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (auth) layout
$authLayoutContent = @'
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        {children}
      </div>
    </div>
  );
}
'@

$authLayoutPath = Join-Path $baseDir "(auth)\layout.tsx"
[System.IO.File]::WriteAllText($authLayoutPath, $authLayoutContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (auth)/login/page.tsx
$loginPageContent = @'
'use client';

import { FormEvent } from 'react';

export default function LoginPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login submitted');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-6">تسجيل الدخول</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
          <input 
            id="email"
            name="email"
            type="email" 
            className="w-full px-4 py-2 border rounded-lg" 
            aria-required="true"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">كلمة المرور</label>
          <input 
            id="password"
            name="password"
            type="password" 
            className="w-full px-4 py-2 border rounded-lg" 
            aria-required="true"
            required
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg">دخول</button>
      </form>
    </div>
  );
}
'@

$loginPagePath = Join-Path $baseDir "(auth)\login\page.tsx"
[System.IO.File]::WriteAllText($loginPagePath, $loginPageContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (auth)/register/page.tsx
$registerPageContent = @'
'use client';

import { FormEvent } from 'react';

export default function RegisterPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log('Registration submitted');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-6">إنشاء حساب</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">الاسم</label>
          <input 
            id="name"
            name="name"
            type="text" 
            className="w-full px-4 py-2 border rounded-lg" 
            aria-required="true"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
          <input 
            id="email"
            name="email"
            type="email" 
            className="w-full px-4 py-2 border rounded-lg" 
            aria-required="true"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">كلمة المرور</label>
          <input 
            id="password"
            name="password"
            type="password" 
            className="w-full px-4 py-2 border rounded-lg" 
            aria-required="true"
            required
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg">تسجيل</button>
      </form>
    </div>
  );
}
'@

$registerPagePath = Join-Path $baseDir "(auth)\register\page.tsx"
[System.IO.File]::WriteAllText($registerPagePath, $registerPageContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (user) layout
$userLayoutContent = @'
import Link from 'next/link';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          <aside className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              <Link href="/profile" className="block px-4 py-2 rounded hover:bg-gray-100">الملف الشخصي</Link>
              <Link href="/profile/favorites" className="block px-4 py-2 rounded hover:bg-gray-100">المفضلة</Link>
              <Link href="/profile/settings" className="block px-4 py-2 rounded hover:bg-gray-100">الإعدادات</Link>
              <Link href="/profile/reviews" className="block px-4 py-2 rounded hover:bg-gray-100">المراجعات</Link>
            </nav>
          </aside>
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
'@

$userLayoutPath = Join-Path $baseDir "(user)\layout.tsx"
[System.IO.File]::WriteAllText($userLayoutPath, $userLayoutContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (user)/profile/page.tsx
$profilePageContent = @'
export default function ProfilePage() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">الملف الشخصي</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">الاسم</label>
          <input type="text" defaultValue="محمد أحمد" className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
          <input type="email" defaultValue="user@loctah.com" className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg">حفظ التغييرات</button>
      </div>
    </div>
  );
}
'@

$profilePagePath = Join-Path $baseDir "(user)\profile\page.tsx"
[System.IO.File]::WriteAllText($profilePagePath, $profilePageContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (user)/favorites/page.tsx
$favoritesPageContent = @'
export default function FavoritesPage() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">المفضلة</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">منتج مفضل {i}</h3>
            <p className="text-gray-600 mb-2">وصف المنتج</p>
            <div className="text-xl font-bold text-indigo-600">299 ريال</div>
          </div>
        ))}
      </div>
    </div>
  );
}
'@

$favoritesPagePath = Join-Path $baseDir "(user)\profile\favorites\page.tsx"
[System.IO.File]::WriteAllText($favoritesPagePath, $favoritesPageContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (user)/settings/page.tsx
$settingsPageContent = @'
export default function SettingsPage() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">الإعدادات</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">إعدادات الإشعارات</h2>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span>إشعارات البريد الإلكتروني</span>
          </label>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">اللغة</h2>
          <select className="px-4 py-2 border rounded-lg">
            <option>العربية</option>
            <option>English</option>
          </select>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg">حفظ</button>
      </div>
    </div>
  );
}
'@

$settingsPagePath = Join-Path $baseDir "(user)\profile\settings\page.tsx"
[System.IO.File]::WriteAllText($settingsPagePath, $settingsPageContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (user)/profile/reviews/page.tsx
$reviewsPageContent = @'
export default function ReviewsPage() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">المراجعات</h1>
      <p className="text-gray-600">المراجعات الخاصة بك ستظهر هنا (v1.1)</p>
    </div>
  );
}
'@

$reviewsPagePath = Join-Path $baseDir "(user)\profile\reviews\page.tsx"
[System.IO.File]::WriteAllText($reviewsPagePath, $reviewsPageContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (vendor) layout
$vendorLayoutContent = @'
import Link from 'next/link';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">لوحة التاجر</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          <aside className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              <Link href="/vendor" className="block px-4 py-2 rounded hover:bg-gray-100">لوحة التحكم</Link>
              <Link href="/vendor/store" className="block px-4 py-2 rounded hover:bg-gray-100">متجري</Link>
              <Link href="/vendor/offers" className="block px-4 py-2 rounded hover:bg-gray-100">العروض</Link>
            </nav>
          </aside>
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
'@

$vendorLayoutPath = Join-Path $baseDir "(vendor)\layout.tsx"
[System.IO.File]::WriteAllText($vendorLayoutPath, $vendorLayoutContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (vendor)/vendor/page.tsx
$vendorPageContent = @'
export default function VendorDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">إجمالي العروض</h3>
          <div className="text-3xl font-bold text-indigo-600">24</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">المشاهدات</h3>
          <div className="text-3xl font-bold text-green-600">1,234</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">التقييم</h3>
          <div className="text-3xl font-bold text-yellow-600">4.5 ⭐</div>
        </div>
      </div>
    </div>
  );
}
'@

$vendorPagePath = Join-Path $baseDir "(vendor)\vendor\page.tsx"
[System.IO.File]::WriteAllText($vendorPagePath, $vendorPageContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (vendor)/vendor/store/page.tsx
$vendorStorePageContent = @'
import Link from 'next/link';

export default function VendorStorePage() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">معلومات المتجر</h1>
        <Link href="/vendor/store/edit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">تعديل</Link>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1">اسم المتجر</h3>
          <p className="text-gray-600">متجر الإلكترونيات</p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">العنوان</h3>
          <p className="text-gray-600">الرياض، المملكة العربية السعودية</p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">ساعات العمل</h3>
          <p className="text-gray-600">9 صباحاً - 10 مساءً</p>
        </div>
      </div>
    </div>
  );
}
'@

$vendorStorePagePath = Join-Path $baseDir "(vendor)\vendor\store\page.tsx"
[System.IO.File]::WriteAllText($vendorStorePagePath, $vendorStorePageContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (vendor)/vendor/store/edit/page.tsx
$vendorStoreEditContent = @'
'use client';

import { FormEvent } from 'react';

export default function VendorStoreEditPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement store update logic
    console.log('Store update submitted');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">تعديل المتجر</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium mb-2">اسم المتجر</label>
          <input 
            id="storeName"
            name="storeName"
            type="text" 
            className="w-full px-4 py-2 border rounded-lg" 
            aria-required="true"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-2">العنوان</label>
          <input 
            id="address"
            name="address"
            type="text" 
            className="w-full px-4 py-2 border rounded-lg" 
            aria-required="true"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">الوصف</label>
          <textarea 
            id="description"
            name="description"
            className="w-full px-4 py-2 border rounded-lg" 
            rows={4}
            aria-required="true"
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg">حفظ</button>
      </form>
    </div>
  );
}
'@

$vendorStoreEditPath = Join-Path $baseDir "(vendor)\vendor\store\edit\page.tsx"
[System.IO.File]::WriteAllText($vendorStoreEditPath, $vendorStoreEditContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (vendor)/vendor/offers/page.tsx
$vendorOffersPageContent = @'
import Link from 'next/link';

export default function VendorOffersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">العروض</h1>
        <Link href="/vendor/offers/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">إضافة عرض</Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2">عرض {i}</h3>
            <p className="text-gray-600 mb-2">منتج رائع بسعر مميز</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-indigo-600">299 ريال</span>
              <button className="text-sm text-indigo-600">تعديل</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
'@

$vendorOffersPagePath = Join-Path $baseDir "(vendor)\vendor\offers\page.tsx"
[System.IO.File]::WriteAllText($vendorOffersPagePath, $vendorOffersPageContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (vendor)/vendor/offers/create/page.tsx
$vendorOffersCreateContent = @'
'use client';

import { FormEvent } from 'react';

export default function VendorOffersCreatePage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement offer creation logic
    console.log('Offer creation submitted');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">إضافة عرض جديد</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="product" className="block text-sm font-medium mb-2">المنتج</label>
          <select 
            id="product"
            name="product"
            className="w-full px-4 py-2 border rounded-lg"
            aria-required="true"
            required
          >
            <option value="">اختر منتج</option>
          </select>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">السعر</label>
          <input 
            id="price"
            name="price"
            type="number" 
            className="w-full px-4 py-2 border rounded-lg" 
            aria-required="true"
            required
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-2">الكمية</label>
          <input 
            id="quantity"
            name="quantity"
            type="number" 
            className="w-full px-4 py-2 border rounded-lg" 
            aria-required="true"
            required
          />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg">إنشاء عرض</button>
      </form>
    </div>
  );
}
'@

$vendorOffersCreatePath = Join-Path $baseDir "(vendor)\vendor\offers\create\page.tsx"
[System.IO.File]::WriteAllText($vendorOffersCreatePath, $vendorOffersCreateContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (vendor)/vendor/offers/[id]/edit/page.tsx
$vendorOffersEditContent = @'
'use client';

import { FormEvent } from 'react';

export default function VendorOffersEditPage({ params }: { params: { id: string } }) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement offer update logic
    console.log('Offer update submitted');
  };

  const handleDelete = () => {
    // TODO: Implement offer deletion logic
    if (confirm('هل أنت متأكد من حذف هذا العرض؟')) {
      console.log('Offer deleted');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">تعديل العرض {params.id}</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">السعر</label>
          <input 
            id="price"
            name="price"
            type="number" 
            defaultValue="299" 
            className="w-full px-4 py-2 border rounded-lg" 
            aria-required="true"
            required
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-2">الكمية</label>
          <input 
            id="quantity"
            name="quantity"
            type="number" 
            defaultValue="10" 
            className="w-full px-4 py-2 border rounded-lg" 
            aria-required="true"
            required
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg">حفظ</button>
          <button 
            type="button" 
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-2 rounded-lg"
            aria-label="حذف العرض"
          >
            حذف
          </button>
        </div>
      </form>
    </div>
  );
}
'@

$vendorOffersEditPath = Join-Path $baseDir "(vendor)\vendor\offers\[id]\edit\page.tsx"
[System.IO.File]::WriteAllText($vendorOffersEditPath, $vendorOffersEditContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (admin) layout
$adminLayoutContent = @'
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-5 gap-6">
          <aside className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              <Link href="/admin" className="block px-4 py-2 rounded hover:bg-gray-100">لوحة التحكم</Link>
              <Link href="/admin/products" className="block px-4 py-2 rounded hover:bg-gray-100">المنتجات</Link>
              <Link href="/admin/categories" className="block px-4 py-2 rounded hover:bg-gray-100">الفئات</Link>
              <Link href="/admin/stores" className="block px-4 py-2 rounded hover:bg-gray-100">المتاجر</Link>
              <Link href="/admin/offers" className="block px-4 py-2 rounded hover:bg-gray-100">العروض</Link>
              <Link href="/admin/users" className="block px-4 py-2 rounded hover:bg-gray-100">المستخدمين</Link>
            </nav>
          </aside>
          <main className="md:col-span-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
'@

$adminLayoutPath = Join-Path $baseDir "(admin)\layout.tsx"
[System.IO.File]::WriteAllText($adminLayoutPath, $adminLayoutContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create (admin)/admin/page.tsx
$adminPageContent = @'
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">المنتجات</h3>
          <div className="text-3xl font-bold">150</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">المتاجر</h3>
          <div className="text-3xl font-bold">45</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">العروض</h3>
          <div className="text-3xl font-bold">320</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">المستخدمين</h3>
          <div className="text-3xl font-bold">1,234</div>
        </div>
      </div>
    </div>
  );
}
'@

$adminPagePath = Join-Path $baseDir "(admin)\admin\page.tsx"
[System.IO.File]::WriteAllText($adminPagePath, $adminPageContent, [System.Text.Encoding]::UTF8)
$filesCreated++

# Create remaining admin pages with minimal content
$adminPages = @{
    "(admin)\admin\products\page.tsx" = "ProductsListPage"
    "(admin)\admin\products\create\page.tsx" = "ProductsCreatePage"
    "(admin)\admin\products\[id]\edit\page.tsx" = "ProductsEditPage"
    "(admin)\admin\categories\page.tsx" = "CategoriesListPage"
    "(admin)\admin\categories\create\page.tsx" = "CategoriesCreatePage"
    "(admin)\admin\stores\page.tsx" = "StoresListPage"
    "(admin)\admin\stores\[id]\page.tsx" = "StoreDetailPage"
    "(admin)\admin\stores\[id]\verify\page.tsx" = "StoreVerifyPage"
    "(admin)\admin\offers\page.tsx" = "OffersListPage"
    "(admin)\admin\users\page.tsx" = "UsersListPage"
    "(admin)\admin\users\[id]\page.tsx" = "UserDetailPage"
}

foreach ($page in $adminPages.GetEnumerator()) {
    $pageContent = @"
export default function $($page.Value)() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">$($page.Value)</h1>
      <p className="text-gray-600">محتوى الصفحة سيتم إضافته لاحقاً</p>
    </div>
  );
}
"@
    $pagePath = Join-Path $baseDir $page.Key
    [System.IO.File]::WriteAllText($pagePath, $pageContent, [System.Text.Encoding]::UTF8)
    $filesCreated++
}

Write-Host "✅ Structure created successfully!" -ForegroundColor Green
Write-Host "Total files created: $filesCreated" -ForegroundColor Cyan
