import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface LoadingTableProps {
  rows?: number;
  columns?: number;
}

export default function LoadingTable({ rows = 5, columns = 4 }: LoadingTableProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-10 flex-1" />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-12 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
