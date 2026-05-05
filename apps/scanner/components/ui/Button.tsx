import React, { forwardRef } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 border-transparent disabled:opacity-50',
    secondary: 'bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700',
    ghost: 'bg-transparent text-zinc-600 border-transparent hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 border-transparent disabled:opacity-50',
};

const sizes = {
    sm: 'h-8 px-3 py-1.5 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-11 px-5 py-2.5 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading, disabled, children, className = '', ...props }, ref) => (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 cursor-pointer disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading && <Spinner size="sm" />}
            {children}
        </button>
    )
);

Button.displayName = 'Button';
