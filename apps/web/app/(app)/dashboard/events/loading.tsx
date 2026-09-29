import { Skeleton, RowSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <div className="flex flex-col gap-7">
            <Skeleton className="h-9 w-44" />
            <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }, (_, i) => (
                    <Skeleton key={i} className="h-[84px] rounded-[var(--radius-card)]" />
                ))}
            </div>
            <div className="flex flex-col gap-2.5">
                {Array.from({ length: 4 }, (_, i) => <RowSkeleton key={i} />)}
            </div>
        </div>
    );
}
