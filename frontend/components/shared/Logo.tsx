import Link from 'next/link';

export default function Logo() {
  return (
    <Link className="flex items-center gap-2 text-lg font-semibold tracking-tight" href="/">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">L</span>
      <span>Loctah</span>
    </Link>
  );
}
