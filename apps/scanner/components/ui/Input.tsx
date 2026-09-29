import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, id, className, ...props }, ref) => {
        const generated = useId();
        const inputId = id ?? generated;
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={inputId} className="text-[13px] font-medium text-ink-2">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    aria-invalid={error ? true : undefined}
                    className={cn(
                        'h-12 w-full rounded-[var(--radius-control)] border bg-surface px-3.5',
                        // 16px minimum stops iOS zooming the viewport on focus.
                        'text-base text-ink placeholder:text-ink-4',
                        'transition-[border-color,box-shadow] duration-150 focus:outline-none',
                        'disabled:opacity-50',
                        error
                            ? 'border-danger-line focus:border-danger focus:shadow-[0_0_0_3px_var(--danger-soft)]'
                            : 'border-line-strong focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]',
                        className,
                    )}
                    {...props}
                />
                {error ? (
                    <p className="text-xs text-danger">{error}</p>
                ) : hint ? (
                    <p className="text-xs text-ink-4">{hint}</p>
                ) : null}
            </div>
        );
    },
);
Input.displayName = 'Input';
