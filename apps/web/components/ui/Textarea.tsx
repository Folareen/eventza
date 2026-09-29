import { TextareaHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/lib/cn';
import { Field, controlClasses, type FieldProps } from './Field';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, id, className, ...props }, ref) => {
        const generated = useId();
        const inputId = id ?? generated;
        return (
            <Field label={label} error={error} hint={hint} htmlFor={inputId}>
                <textarea
                    ref={ref}
                    id={inputId}
                    aria-invalid={error ? true : undefined}
                    className={cn(controlClasses(error), 'min-h-24 px-3 py-2.5 resize-y leading-relaxed', className)}
                    {...props}
                />
            </Field>
        );
    },
);
Textarea.displayName = 'Textarea';
