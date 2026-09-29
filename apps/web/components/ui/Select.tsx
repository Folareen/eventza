import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import { cn } from '@/lib/cn';
import { Field, controlClasses, type FieldProps } from './Field';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FieldProps {
    placeholder?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, hint, id, placeholder, options, className, ...props }, ref) => {
        const generated = useId();
        const inputId = id ?? generated;
        return (
            <Field label={label} error={error} hint={hint} htmlFor={inputId}>
                <div className="relative flex items-center">
                    <select
                        ref={ref}
                        id={inputId}
                        aria-invalid={error ? true : undefined}
                        className={cn(
                            controlClasses(error),
                            'h-10 pl-3 pr-9 appearance-none cursor-pointer',
                            className,
                        )}
                        {...props}
                    >
                        {placeholder && <option value="">{placeholder}</option>}
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <RiArrowDownSLine className="pointer-events-none absolute right-3 h-4 w-4 text-ink-4" />
                </div>
            </Field>
        );
    },
);
Select.displayName = 'Select';
