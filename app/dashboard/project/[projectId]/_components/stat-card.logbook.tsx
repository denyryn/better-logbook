import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const tints = ['var(--tint-sage)', 'var(--tint-salmon)', 'var(--tint-periwinkle)', 'var(--tint-sky)'];
  const tintIdx = [...title].reduce((acc, c) => acc + c.charCodeAt(0), 0) % tints.length;

  return (
    <Card className="@container/card border-[#000]">
      <div className="border-b border-[#000] bg-white px-3 py-1.5">
        <span className="font-helvetica text-xs font-bold">{title}</span>
      </div>
      <div className="px-4 py-3 font-serif text-sm" style={{ backgroundColor: tints[tintIdx] }}>
        <CardTitle className="text-2xl font-arial-black font-black tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <div className="mt-1 line-clamp-1 font-helvetica text-xs font-bold">{description}</div>
      </div>
    </Card>
  );
}
