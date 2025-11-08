import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  className,
}: StatsCardProps) {
  const isPositiveTrend = trend && trend > 0;
  const isNegativeTrend = trend && trend < 0;

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend !== undefined && trendLabel && (
            <div className="flex items-center gap-1 text-xs">
              <span
                className={cn(
                  "font-medium",
                  isPositiveTrend && "text-green-600",
                  isNegativeTrend && "text-red-600"
                )}
              >
                {isPositiveTrend && "+"}
                {trend}%
              </span>
              <span className="text-muted-foreground">{trendLabel}</span>
            </div>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
