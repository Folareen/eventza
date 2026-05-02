import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-8 w-8' };

export function Spinner({ size = 'md' }: SpinnerProps) {
    return (
        <div
            className={`${sizes[size]} animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-600`}
            role="status"
            aria-label="Loading"
        />
    );
}
