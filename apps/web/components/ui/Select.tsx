import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
    placeholder?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, hint, id, placeholder, options, className = '', ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={inputId}
                    className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-zinc-900 transition-colors focus:outline-none focus:ring-2 dark:bg-zinc-900 dark:text-zinc-100 ${error ? 'border-red-400 focus:ring-red-400/50' : 'border-zinc-300 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/30 dark:focus:border-indigo-500'} ${className}`}
                    {...props}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-xs text-red-500">{error}</p>}
                {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
            </div>
        );
    },
);
Select.displayName = 'Select';
