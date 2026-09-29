'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardSidebar, DashboardMobileNav } from '@/components/layout/DashboardSidebar';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/lib/auth-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            // Preserve the intended destination through the login round-trip.
            router.replace(`/auth/login?from=${encodeURIComponent(pathname)}`);
        }
    }, [isLoading, user, router, pathname]);

    if (isLoading) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-32">
                <Spinner size="lg" className="text-accent" />
                <p className="text-sm text-ink-4">Loading your dashboard…</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="mx-auto flex w-full max-w-[1240px] flex-1 gap-10 px-4 py-8 sm:px-6">
            <DashboardSidebar />
            <main className="flex min-w-0 flex-1 flex-col gap-6">
                <DashboardMobileNav />
                {children}
            </main>
        </div>
    );
}
