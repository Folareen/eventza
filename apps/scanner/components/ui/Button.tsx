import React, { forwardRef } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

const variants = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800 border-transparent',
    secondary: 'bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50',
    ghost: 'bg-transparent text-zinc-600 border-transparent hover:bg-zinc-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 border-transparent',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading, disabled, children, className = '', ...props }, ref) => (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading && <Spinner size="sm" />}
            {children}
        </button>
    )
);

Button.displayName = 'Button';
