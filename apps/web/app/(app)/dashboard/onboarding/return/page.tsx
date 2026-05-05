import Link from 'next/link';
import { RiCheckLine } from 'react-icons/ri';

export default function OnboardingReturnPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <RiCheckLine className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Onboarding complete</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
                    Your Stripe account is set up. You can now receive payouts from ticket sales.
                </p>
            </div>
            <Link
                href="/dashboard/account"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
                Back to account
            </Link>
        </div>
    );
}
