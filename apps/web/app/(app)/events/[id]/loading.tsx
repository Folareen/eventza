import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <div className="flex flex-1 flex-col">
            <Skeleton className="h-[240px] w-full rounded-none sm:h-[340px] lg:h-[400px]" />
            <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-14">
                <div className="flex flex-col gap-8">
                    <Skeleton className="h-[120px] rounded-[var(--radius-card)]" />
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-7 w-52" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                </div>
                <Skeleton className="h-[300px] rounded-[var(--radius-panel)]" />
            </div>
        </div>
    );
}
