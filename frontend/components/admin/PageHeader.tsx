import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  action?: {
    label: string;
    href: string;
  };
}

export default function PageHeader({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  action,
}: PageHeaderProps) {
  // Use action prop if provided, otherwise use legacy props
  const finalActionLabel = action?.label || actionLabel;
  const finalActionHref = action?.href || actionHref;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {(finalActionHref || onAction) && finalActionLabel && (
        <>
          {finalActionHref ? (
            <Link href={finalActionHref}>
              <Button>
                <Plus className="h-4 w-4 me-2" />
                {finalActionLabel}
              </Button>
            </Link>
          ) : (
            <Button onClick={onAction}>
              <Plus className="h-4 w-4 me-2" />
              {finalActionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
