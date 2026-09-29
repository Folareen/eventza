import { cn } from '@/lib/cn';

interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description?: string;
    action?: React.ReactNode;
    /** Dashed outline reads as "you can put something here". */
    bordered?: boolean;
    className?: string;
}

export function EmptyState({
    icon: Icon, title, description, action, bordered = true, className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center px-6 py-16 text-center animate-rise',
                bordered && 'rounded-[var(--radius-panel)] border border-dashed border-line-strong bg-surface-2/40',
                className,
            )}
        >
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-3 text-ink-4">
                <Icon className="h-6 w-6" />
            </span>
            <p className="font-display text-xl text-ink leading-tight">{title}</p>
            {description && (
                <p className="mt-1.5 max-w-xs text-sm text-ink-3 leading-relaxed">{description}</p>
            )}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
