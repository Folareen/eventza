import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
    primary:   'bg-accent text-white shadow-sm hover:bg-accent-hover',
    secondary: 'border border-line-strong bg-surface text-ink-2 shadow-sm hover:bg-surface-2',
    ghost:     'text-ink-3 hover:bg-surface-2 hover:text-ink',
    danger:    'bg-danger text-white shadow-sm hover:brightness-110',
};

/** Taller than the web equivalents: these are tapped with a thumb,
 *  often in a hurry and sometimes in the dark. */
const sizeClasses: Record<Size, string> = {
    sm: 'h-9 px-3.5 text-[13px] gap-1.5',
    md: 'h-11 px-4 text-sm gap-2',
    lg: 'h-14 px-6 text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading, disabled, className, children, ...props }, ref) => (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={cn(
                'inline-flex select-none items-center justify-center rounded-[var(--radius-control)] font-medium',
                'transition-[background-color,border-color,color,box-shadow,transform] duration-150',
                'cursor-pointer active:scale-[.98]',
                'disabled:pointer-events-none disabled:opacity-45',
                variantClasses[variant],
                sizeClasses[size],
                className,
            )}
            {...props}
        >
            {loading && <Spinner size="sm" />}
            {children}
        </button>
    ),
);
Button.displayName = 'Button';
