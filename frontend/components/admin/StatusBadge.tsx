import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "active" | "inactive" | "pending" | "expired" | "verified" | "suspended" | "disabled";

type StatusBadgeProps = {
  status: Status;
  label?: string;
};

const styleMap: Record<Status, string> = {
  active: "bg-green-100 text-green-700 hover:bg-green-100",
  inactive: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  disabled: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  expired: "bg-red-100 text-red-700 hover:bg-red-100",
  verified: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  suspended: "bg-red-100 text-red-700 hover:bg-red-100",
};

const labelMap: Record<Status, string> = {
  active: "نشط",
  inactive: "غير نشط",
  disabled: "معطل",
  pending: "قيد الانتظار",
  expired: "منتهي",
  verified: "موثق",
  suspended: "معلق",
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <Badge className={cn("font-medium", styleMap[status])}>
      {label || labelMap[status]}
    </Badge>
  );
}
