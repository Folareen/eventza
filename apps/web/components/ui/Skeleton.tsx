import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
    return <div className={cn('skeleton', className)} aria-hidden />;
}

/** Card-shaped placeholder matching EventCard's geometry, so the grid
 *  doesn't reflow when real data lands. */
export function EventCardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="flex flex-col gap-2.5 p-4">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-3/5" />
                <Skeleton className="h-3 w-2/5" />
                <div className="pt-2"><Skeleton className="h-4 w-20" /></div>
            </div>
        </div>
    );
}

export function RowSkeleton() {
    return (
        <div className="flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface px-4 py-3.5">
            <Skeleton className="h-11 w-11 shrink-0 rounded-[var(--radius-control)]" />
            <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-3.5 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
        </div>
    );
}

export function StatSkeleton() {
    return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 flex flex-col gap-3">
            <Skeleton className="h-9 w-9 rounded-[var(--radius-control)]" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-24" />
        </div>
    );
}
