'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import { useStripeOnboardingLink } from '@/lib/queries/user';

export default function OnboardingRefreshPage() {
    const router = useRouter();
    const { mutateAsync: getOnboardingLink } = useStripeOnboardingLink();

    useEffect(() => {
        getOnboardingLink()
            .then(({ url }) => { window.location.href = url; })
            .catch(() => router.push('/dashboard/account'));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
            <Spinner size="lg" className="text-accent" />
            <p className="text-sm text-ink-3">Refreshing your onboarding link…</p>
        </div>
    );
}
