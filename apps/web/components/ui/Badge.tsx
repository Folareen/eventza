import { cn } from '@/lib/cn';

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'outline';

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-surface-2 text-ink-2 border-transparent',
    accent:  'bg-accent-soft text-accent-text border-accent-line',
    success: 'bg-success-soft text-success border-success-line',
    warning: 'bg-warning-soft text-warning border-warning-line',
    danger:  'bg-danger-soft text-danger border-danger-line',
    outline: 'bg-transparent text-ink-3 border-line-strong',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5',
                'text-[11px] font-medium leading-5 tracking-wide whitespace-nowrap',
                variantClasses[variant],
                className,
            )}
        >
            {children}
        </span>
    );
}
