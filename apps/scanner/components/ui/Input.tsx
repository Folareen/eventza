import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, className = '', ...props }, ref) => (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}
            <input
                ref={ref}
                className={`rounded-md border px-3 py-2 text-sm bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50 ${error ? 'border-red-400' : 'border-zinc-200'} ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            {!error && hint && <p className="text-xs text-zinc-400">{hint}</p>}
        </div>
    )
);

Input.displayName = 'Input';
