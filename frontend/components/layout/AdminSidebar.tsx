import Link from 'next/link';
import { cn } from '@/lib/utils';

const sections = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/stores', label: 'Stores' },
  { href: '/admin/offers', label: 'Offers' },
  { href: '/admin/users', label: 'Users' },
];

type AdminSidebarProps = {
  onClose?: () => void;
};

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-6">
      {onClose && (
        <button
          onClick={onClose}
          className="mb-4 flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Close menu"
        >
          ✕
        </button>
      )}
      <nav className="flex flex-col gap-2">
        {sections.map((section) => (
          <Link 
            key={section.href} 
            className={linkClass()} 
            href={section.href}
            onClick={onClose}
          >
            {section.label}
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
