import { Skeleton } from "./ui/skeleton";

interface DataTableCardProps {
  isLoading: boolean;
  error: string | null;
}

export default function DataTableCard({
  isLoading,
  error,
}: DataTableCardProps) {
  return (
    <div>
      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <slot></slot>
      )}
    </div>
  );
}
