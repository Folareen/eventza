'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStripeOnboardingLink } from '@/lib/queries/user';
import { Spinner } from '@/components/ui/Spinner';

export default function OnboardingRefreshPage() {
    const router = useRouter();
    const { mutateAsync: getOnboardingLink } = useStripeOnboardingLink();

    useEffect(() => {
        getOnboardingLink()
            .then(({ url }) => { window.location.href = url; })
            .catch(() => router.push('/dashboard/account'));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Spinner size="lg" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Refreshing your onboarding link…</p>
        </div>
    );
}
