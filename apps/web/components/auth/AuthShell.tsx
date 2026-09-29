import Link from 'next/link';
import { Logo } from '../layout/Logo';

interface AuthShellProps {
    children: React.ReactNode;
    /** Pull-quote shown on the editorial panel (desktop only). */
    quote?: { text: string; attribution: string };
    /** Hide the side panel for short, single-purpose forms. */
    aside?: boolean;
}

export function AuthShell({ children, quote, aside = true }: AuthShellProps) {
    if (!aside) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-12">
                <div className="w-full max-w-[360px]">
                    <div className="mb-9 flex justify-center">
                        <Logo />
                    </div>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-paper">
            {/* Editorial panel — typography carries it, no gradient blobs. */}
            <aside className="grain relative hidden w-[44%] flex-col justify-between overflow-hidden bg-ink p-12 lg:flex">
                <Link href="/" className="relative z-10 inline-flex items-center gap-2 text-paper">
                    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden>
                        <path
                            d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v2.25a2.25 2.25 0 0 0 0 4.5v2.25a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-2.25a2.25 2.25 0 0 0 0-4.5V7.5Z"
                            fill="currentColor"
                        />
                        <path d="M14.5 5v14" stroke="#171614" strokeWidth="1.75" strokeLinecap="round" strokeDasharray="2 2.5" />
                    </svg>
                    <span className="font-display text-[21px] leading-none tracking-tight">eventza</span>
                </Link>

                {quote && (
                    <blockquote className="relative z-10 animate-rise">
                        <span className="mb-5 block font-display text-[56px] leading-none text-accent" aria-hidden>
                            &ldquo;
                        </span>
                        <p className="max-w-md font-display text-[30px] leading-[1.28] text-paper">
                            {quote.text}
                        </p>
                        <footer className="mt-6 text-[13px] text-paper/50">{quote.attribution}</footer>
                    </blockquote>
                )}

                <p className="relative z-10 text-[12px] text-paper/40">
                    © {new Date().getFullYear()} eventza
                </p>
            </aside>

            <main className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="w-full max-w-[360px] animate-rise">
                    <div className="mb-9 lg:hidden">
                        <Logo />
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}

export function AuthHeading({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-7">
            <h1 className="font-display text-[30px] leading-tight text-ink">{title}</h1>
            {subtitle && <p className="mt-2 text-[14px] leading-relaxed text-ink-3">{subtitle}</p>}
        </div>
    );
}
