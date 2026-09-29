import Link from 'next/link';
import { RiCheckLine } from 'react-icons/ri';
import { Button } from '@/components/ui/Button';

export default function OnboardingReturnPage() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center animate-rise">
            <span className="flex h-16 w-16 animate-pop items-center justify-center rounded-full bg-success-soft">
                <RiCheckLine className="h-8 w-8 text-success" />
            </span>
            <div>
                <h1 className="font-display text-[30px] leading-tight text-ink">Onboarding complete</h1>
                <p className="mx-auto mt-2.5 max-w-sm text-[14px] leading-relaxed text-ink-3">
                    Your Stripe account is set up. You can now receive payouts from ticket sales.
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
                <Button asChild><Link href="/dashboard/account">Back to account</Link></Button>
                <Button variant="secondary" asChild>
                    <Link href="/dashboard/events">My events</Link>
                </Button>
            </div>
        </div>
    );
}
