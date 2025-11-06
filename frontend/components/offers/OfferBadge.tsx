type OfferBadgeProps = {
  label: string;
};

export default function OfferBadge({ label }: OfferBadgeProps) {
  return (
    <span className="inline-flex min-w-[80px] justify-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
      {label}
    </span>
  );
}
