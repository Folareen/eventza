import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/lib/cn';
import { Field, controlClasses, type FieldProps } from './Field';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FieldProps {
    /** Icon rendered inside the field, on the left. */
    icon?: React.ReactNode;
    /** Static text or node pinned to the right (e.g. a unit or action). */
    trailing?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, icon, trailing, id, className, ...props }, ref) => {
        const generated = useId();
        const inputId = id ?? generated;
        return (
            <Field label={label} error={error} hint={hint} htmlFor={inputId}>
                <div className="relative flex items-center">
                    {icon && (
                        <span className="pointer-events-none absolute left-3 flex text-ink-4 [&>svg]:h-4 [&>svg]:w-4">
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        aria-invalid={error ? true : undefined}
                        className={cn(
                            controlClasses(error),
                            'h-10 px-3',
                            icon && 'pl-9',
                            trailing && 'pr-12',
                            className,
                        )}
                        {...props}
                    />
                    {trailing && (
                        <span className="pointer-events-none absolute right-3 text-xs text-ink-4">
                            {trailing}
                        </span>
                    )}
                </div>
            </Field>
        );
    },
);
Input.displayName = 'Input';
