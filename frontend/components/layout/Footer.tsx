import Link from 'next/link';
import Logo from '@/components/shared/Logo';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <Logo />
        <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <Link className="hover:text-slate-900" href="/about">
            About
          </Link>
          <Link className="hover:text-slate-900" href="/contact">
            Contact
          </Link>
          <Link className="hover:text-slate-900" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-slate-900" href="/terms">
            Terms
          </Link>
        </nav>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} Loctah. All rights reserved.</p>
      </div>
    </footer>
  );
}
