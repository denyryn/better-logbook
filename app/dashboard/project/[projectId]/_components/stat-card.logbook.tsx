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
}

export function LogbookStatCard({
  title,
  value,
  description,
  icon: Icon,
}: LogbookStatCardProps) {
  if (!value && value !== 0) {
    return <Skeleton className="h-40 w-sm" />;
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Icon className="text-muted-foreground size-4" />
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">{description}</div>
      </CardFooter>
    </Card>
  );
}
