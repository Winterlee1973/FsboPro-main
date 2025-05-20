import { Award } from "lucide-react";

interface PremiumBadgeProps {
  className?: string;
}

export function PremiumBadge({ className = "" }: PremiumBadgeProps) {
  return (
    <div className={`bg-[hsl(var(--premium))] text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center ${className}`}>
      <Award className="h-4 w-4 mr-1" />
      Premium
    </div>
  );
}
