import Link from 'next/link';
import { cn } from '@/lib/cn';

/** Wordmark. The mark is a ticket-stub notch rendered as SVG rather than
 *  a generic calendar icon, so it reads as ours at small sizes. */
export function Logo({
    className, href = '/', showWordmark = true,
}: { className?: string; href?: string | null; showWordmark?: boolean }) {
    const inner = (
        <>
            <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] shrink-0" aria-hidden>
                <path
                    d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v2.25a2.25 2.25 0 0 0 0 4.5v2.25a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-2.25a2.25 2.25 0 0 0 0-4.5V7.5Z"
                    fill="currentColor"
                />
                <path
                    d="M14.5 5v14"
                    stroke="var(--paper)"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeDasharray="2 2.5"
                />
            </svg>
            {showWordmark && (
                <span className="font-display text-[21px] leading-none tracking-tight">eventza</span>
            )}
        </>
    );

    const classes = cn('inline-flex items-center gap-2 text-ink', className);

    if (href === null) return <span className={classes}>{inner}</span>;
    return (
        <Link href={href} className={cn(classes, 'transition-opacity hover:opacity-70')}>
            {inner}
        </Link>
    );
}
