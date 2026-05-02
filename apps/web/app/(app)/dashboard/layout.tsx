'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/lib/auth-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) router.replace('/auth/login');
    }, [isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 flex gap-8">
            <DashboardSidebar />
            <main className="flex-1 min-w-0">{children}</main>
        </div>
    );
}
