import { cn } from '@/lib/cn';

/** Shared chrome for every form control: label, error, hint.
 *  Keeps spacing and error styling identical across Input/Select/Textarea. */
export interface FieldProps {
    label?: string;
    error?: string;
    hint?: string;
}

export function Field({
    label, error, hint, htmlFor, children, className,
}: FieldProps & { htmlFor?: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            {label && (
                <label
                    htmlFor={htmlFor}
                    className="text-[13px] font-medium text-ink-2 leading-none"
                >
                    {label}
                </label>
            )}
            {children}
            {error ? (
                <p className="text-xs text-danger leading-tight animate-fade">{error}</p>
            ) : hint ? (
                <p className="text-xs text-ink-4 leading-tight">{hint}</p>
            ) : null}
        </div>
    );
}

/** Border/ring treatment shared by all text-entry controls. */
export const controlClasses = (error?: string) =>
    cn(
        'w-full bg-surface text-sm text-ink rounded-[var(--radius-control)] border',
        'placeholder:text-ink-4',
        'transition-[border-color,box-shadow,background-color] duration-150 ease-out',
        'focus:outline-none focus-visible:outline-none',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-2',
        error
            ? 'border-danger-line focus:border-danger focus:shadow-[0_0_0_3px_var(--danger-soft)]'
            : 'border-line-strong hover:border-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]',
    );
