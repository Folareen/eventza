import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <div className="flex flex-col gap-7">
            <Skeleton className="h-9 w-3/5" />
            <Skeleton className="h-52 rounded-[var(--radius-card)]" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }, (_, i) => (
                    <Skeleton key={i} className="h-[92px] rounded-[var(--radius-card)]" />
                ))}
            </div>
        </div>
    );
}
