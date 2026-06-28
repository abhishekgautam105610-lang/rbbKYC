import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const variants: Record<string, string> = {
  Pending: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
  Approved: "bg-green-50 text-green-700 ring-green-600/20",
  Rejected: "bg-red-50 text-red-700 ring-red-600/20",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        variants[status] || "bg-gray-50 text-gray-700 ring-gray-600/20",
        className
      )}
    >
      {status}
    </span>
  );
}
