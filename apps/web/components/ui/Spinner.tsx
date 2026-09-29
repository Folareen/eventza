import { cn } from '@/lib/cn';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-7 w-7' };

export function Spinner({ size = 'md', className }: SpinnerProps) {
    return (
        <svg
            className={cn('animate-spin text-current shrink-0', sizeClasses[size], className)}
            viewBox="0 0 24 24"
            fill="none"
            role="status"
            aria-label="Loading"
        >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" className="opacity-20" />
            <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    );
}
