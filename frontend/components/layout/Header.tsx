import Link from 'next/link';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import Logo from '@/components/shared/Logo';
import MobileNav from './MobileNav';
import UserNav from './UserNav';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <MobileNav />
          <Logo />
          <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 md:flex">
            <Link className="hover:text-slate-900" href="/products">
              Products
            </Link>
            <Link className="hover:text-slate-900" href="/categories">
              Categories
            </Link>
            <Link className="hover:text-slate-900" href="/stores">
              Stores
            </Link>
            <Link className="hover:text-slate-900" href="/search">
              Search
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
