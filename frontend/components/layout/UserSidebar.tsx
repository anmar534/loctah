import Link from 'next/link';
import { cn } from '@/lib/utils';

const links = [
  { href: '/profile', label: 'Overview' },
  { href: '/profile/favorites', label: 'Favorites' },
  { href: '/profile/settings', label: 'Settings' },
];

export default function UserSidebar() {
  return (
    <aside className="hidden w-64 border-r border-slate-200 bg-white p-6 md:block">
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link key={link.href} className={linkClass()} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function linkClass() {
  return cn(
    'rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  );
}
