import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, id, className = '', ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    className={`w-full h-24 rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:outline-none focus:ring-2 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-400/50' : 'border-zinc-300 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/30 dark:focus:border-indigo-500'} ${className}`}
                    {...props}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
                {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
            </div>
        );
    },
);
Textarea.displayName = 'Textarea';
