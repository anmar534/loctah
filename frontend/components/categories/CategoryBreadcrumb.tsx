import Link from 'next/link';

export default function CategoryBreadcrumb({ slug }: { slug: string }) {
  const segments = slug.split('-').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <li>
          <Link className="hover:text-slate-900" href="/categories">
            Categories
          </Link>
        </li>
        {segments.map((segment, index) => (
          <li className="flex items-center gap-2" key={segment}>
            <span>/</span>
            <span className={index === segments.length - 1 ? 'font-medium text-slate-900' : undefined}>
              {segment}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
