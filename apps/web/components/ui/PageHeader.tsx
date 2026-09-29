import { cn } from '@/lib/cn';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    /** Rendered above the title — breadcrumbs or an eyebrow label. */
    eyebrow?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, action, eyebrow, className }: PageHeaderProps) {
    return (
        <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
            <div className="min-w-0 flex flex-col gap-1.5">
                {eyebrow && <div className="flex items-center gap-1.5 text-xs text-ink-4">{eyebrow}</div>}
                <h1 className="font-display text-[28px] sm:text-[32px] text-ink leading-[1.15]">{title}</h1>
                {description && <p className="text-sm text-ink-3 leading-relaxed">{description}</p>}
            </div>
            {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
        </div>
    );
}
