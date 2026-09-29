import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'subtle' | 'danger' | 'danger-ghost';
type Size = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    asChild?: boolean;
}

const variantClasses: Record<Variant, string> = {
    primary:
        'bg-accent text-white shadow-sm hover:bg-accent-hover active:shadow-none',
    secondary:
        'border border-line-strong bg-surface text-ink-2 shadow-sm hover:bg-surface-2 hover:border-ink-4 active:shadow-none',
    ghost:
        'text-ink-3 hover:bg-surface-2 hover:text-ink',
    subtle:
        'bg-surface-2 text-ink-2 hover:bg-surface-3',
    danger:
        'bg-danger text-white shadow-sm hover:brightness-110 active:shadow-none',
    'danger-ghost':
        'text-danger hover:bg-danger-soft',
};

const sizeClasses: Record<Size, string> = {
    sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-[var(--radius-control)]',
    md: 'h-10 px-4 text-sm gap-2 rounded-[var(--radius-control)]',
    lg: 'h-12 px-6 text-[15px] gap-2 rounded-[var(--radius-control)]',
    icon: 'h-10 w-10 p-0 rounded-[var(--radius-control)]',
    'icon-sm': 'h-8 w-8 p-0 rounded-[var(--radius-control)]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading, disabled, asChild, className, children, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                ref={ref}
                disabled={!asChild ? disabled || loading : undefined}
                data-loading={loading ? '' : undefined}
                className={cn(
                    'relative inline-flex select-none items-center justify-center font-medium whitespace-nowrap',
                    'transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out',
                    'cursor-pointer active:translate-y-px',
                    'disabled:pointer-events-none disabled:opacity-45',
                    variantClasses[variant],
                    sizeClasses[size],
                    className,
                )}
                {...props}
            >
                {asChild ? (
                    children
                ) : (
                    <>
                        {loading && <Spinner size="sm" />}
                        {children}
                    </>
                )}
            </Comp>
        );
    },
);
Button.displayName = 'Button';
