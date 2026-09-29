'use client';

import Link from 'next/link';
import { useState } from 'react';
import { RiMailLine, RiArrowRightLine, RiCloseLine } from 'react-icons/ri';
import { useAuth } from '@/lib/auth-context';

export function UnverifiedBanner() {
    const { user } = useAuth();
    const [dismissed, setDismissed] = useState(false);

    if (!user || user.emailVerified || dismissed) return null;

    return (
        <div className="border-b border-warning-line bg-warning-soft animate-rise">
            <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-2.5 sm:px-6">
                <RiMailLine className="h-4 w-4 shrink-0 text-warning" />
                <p className="flex-1 text-[13px] text-ink-2 leading-snug">
                    <span className="font-medium">Verify your email</span>
                    <span className="hidden sm:inline text-ink-3"> — some features stay restricted until you do.</span>
                </p>
                <Link
                    href="/dashboard/account#verify"
                    className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-warning hover:underline underline-offset-2"
                >
                    Verify <RiArrowRightLine className="h-3.5 w-3.5" />
                </Link>
                <button
                    onClick={() => setDismissed(true)}
                    aria-label="Dismiss"
                    className="shrink-0 rounded p-1 text-ink-4 transition-colors hover:text-ink cursor-pointer"
                >
                    <RiCloseLine className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
