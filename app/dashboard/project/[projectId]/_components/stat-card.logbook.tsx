import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LogbookStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  loading: boolean;
}

export function LogbookStatCard({
  title,
  value,
  description,
  icon: Icon,
  loading
}: LogbookStatCardProps) {
  if (loading) {
    return <Skeleton className="h-40 w-sm" />;
  }

  return (
    <Card className="@container/card border-border py-0 gap-0">
      <div className="border-b border-border bg-card px-2 py-1">
        <span className="font-helvetica text-[10px] font-bold uppercase tracking-wider">{title}</span>
      </div>
      <div className="px-2 py-2 font-serif text-xs">
        <span className="text-xl font-arial-black font-black tabular-nums @[250px]/card:text-2xl">
          {value}
        </span>
        <div className="mt-0.5 line-clamp-1 font-helvetica text-[10px] font-bold">{description}</div>
      </div>
    </Card>
  );
}
