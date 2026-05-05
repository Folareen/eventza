import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, className = '', ...props }, ref) => (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>}
            <input
                ref={ref}
                className={`h-10 rounded-lg border px-3 py-2 text-sm bg-white text-zinc-900 placeholder-zinc-400 transition-colors focus:outline-none focus:ring-2 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 disabled:opacity-50 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-400/50' : 'border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/30 dark:focus:border-indigo-500'} ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            {!error && hint && <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>}
        </div>
    )
);

Input.displayName = 'Input';
