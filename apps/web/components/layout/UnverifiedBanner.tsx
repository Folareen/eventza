'use client';

import Link from 'next/link';
import { RiMailLine, RiArrowRightLine } from 'react-icons/ri';
import { useAuth } from '@/lib/auth-context';

export function UnverifiedBanner() {
    const { user } = useAuth();

    if (!user || user.emailVerified) return null;

    return (
        <div className="bg-amber-500 dark:bg-amber-600 text-white px-4 py-2.5 flex items-center justify-center gap-3 text-sm">
            <RiMailLine className="h-4 w-4 shrink-0" />
            <span className="font-medium">Your email is not verified. Some features are restricted until you verify.</span>
            <Link
                href="/dashboard/account#verify"
                className="ml-1 inline-flex items-center gap-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors px-3 py-0.5 text-xs font-semibold whitespace-nowrap"
            >
                Verify now <RiArrowRightLine className="h-3 w-3" />
            </Link>
        </div>
    );
}
