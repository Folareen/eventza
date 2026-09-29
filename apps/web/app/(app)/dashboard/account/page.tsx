'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
    RiCheckLine, RiMailLine, RiBankCardLine, RiExternalLinkLine,
    RiShieldCheckLine, RiAlertLine,
} from 'react-icons/ri';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/lib/auth-context';
import {
    useRequestEmailVerification, useVerifyEmail, useStripeStatus,
    useStripeOnboardingLink, useStripeDashboardLink,
} from '@/lib/queries/user';

function Section({
    title, icon: Icon, description, children, tone = 'default',
}: {
    title: string;
    icon?: React.ElementType;
    description?: string;
    children: React.ReactNode;
    tone?: 'default' | 'warning' | 'danger';
}) {
    const border =
        tone === 'warning' ? 'border-warning-line'
        : tone === 'danger' ? 'border-danger-line'
        : 'border-line';
    const bg = tone === 'warning' ? 'bg-warning-soft' : 'bg-surface';

    return (
        <section className={`overflow-hidden rounded-[var(--radius-card)] border ${border} ${bg}`}>
            <div className={`flex items-start gap-2.5 px-5 py-4 ${tone === 'warning' ? '' : 'border-b border-line'}`}>
                {Icon && (
                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone === 'warning' ? 'text-warning' : tone === 'danger' ? 'text-danger' : 'text-ink-4'}`} />
                )}
                <div>
                    <h2 className={`text-[13px] font-semibold ${tone === 'danger' ? 'text-danger' : 'text-ink'}`}>
                        {title}
                    </h2>
                    {description && (
                        <p className="mt-1 text-[13px] leading-relaxed text-ink-3">{description}</p>
                    )}
                </div>
            </div>
            <div className={tone === 'warning' ? 'px-5 pb-5' : 'px-5 py-5'}>{children}</div>
        </section>
    );
}

export default function AccountPage() {
    const { user } = useAuth();
    const { mutateAsync: requestVerification, isPending: requesting } = useRequestEmailVerification();
    const { mutateAsync: verifyEmail, isPending: verifying } = useVerifyEmail();
    const { data: stripeStatus } = useStripeStatus();
    const { mutateAsync: getOnboardingLink, isPending: loadingOnboarding } = useStripeOnboardingLink();
    const { mutateAsync: getDashboardLink, isPending: loadingDashboard } = useStripeDashboardLink();

    const [otp, setOtp] = useState('');
    const [resent, setResent] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    if (!user) {
        return (
            <div className="flex max-w-2xl flex-col gap-7">
                <Skeleton className="h-9 w-40" />
                <Skeleton className="h-[180px] rounded-[var(--radius-card)]" />
                <Skeleton className="h-[140px] rounded-[var(--radius-card)]" />
            </div>
        );
    }

    const handleRequestVerification = async () => {
        try {
            await requestVerification();
            toast.success('Verification code sent');
            setResent(true);
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to send verification email');
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) { toast.error('Enter the 6-digit code'); return; }
        try {
            await verifyEmail(otp);
            toast.success('Email verified');
            setOtp('');
        } catch (err: any) {
            toast.error(err?.message ?? 'Verification failed');
        }
    };

    const handleOnboarding = async () => {
        try {
            const { url } = await getOnboardingLink();
            window.location.href = url;
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to open onboarding');
        }
    };

    const handleDashboard = async () => {
        try {
            const { url } = await getDashboardLink();
            window.open(url, '_blank', 'noopener');
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to open dashboard');
        }
    };

    const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();
    const payoutsReady = Boolean(stripeStatus?.detailsSubmitted);

    return (
        <div className="flex max-w-2xl flex-col gap-6">
            <PageHeader title="Account" description="Your profile, verification, and payout settings." />

            {/* Profile */}
            <section className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
                <div className="flex items-center gap-4 border-b border-line px-5 py-5">
                    <span className="flex h-14 w-14 shrink-0 select-none items-center justify-center rounded-full bg-accent font-display text-[20px] text-white">
                        {initials}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="font-display text-[21px] leading-tight text-ink">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="mt-0.5 truncate text-[13px] text-ink-3">{user.email}</p>
                    </div>
                    {user.emailVerified && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-success-line bg-success-soft px-2.5 py-1 text-[11px] font-medium text-success">
                            <RiCheckLine className="h-3 w-3" /> Verified
                        </span>
                    )}
                </div>
                <dl className="grid gap-5 px-5 py-5 sm:grid-cols-2">
                    {[
                        { label: 'First name', value: user.firstName },
                        { label: 'Last name', value: user.lastName },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-4">
                                {label}
                            </dt>
                            <dd className="mt-1.5 text-[14px] text-ink-2">{value}</dd>
                        </div>
                    ))}
                    <div className="sm:col-span-2">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-4">
                            Email address
                        </dt>
                        <dd className="mt-1.5 flex flex-wrap items-center gap-2 text-[14px] text-ink-2">
                            {user.email}
                            {!user.emailVerified && (
                                <span className="text-[12px] font-medium text-warning">Not verified</span>
                            )}
                        </dd>
                    </div>
                </dl>
            </section>

            {/* Verification */}
            {!user.emailVerified && (
                <div id="verify">
                    <Section
                        title="Verify your email"
                        icon={RiMailLine}
                        tone="warning"
                        description={`Enter the 6-digit code we sent to ${user.email}.`}
                    >
                        <form onSubmit={handleVerify} className="flex flex-col gap-3">
                            <div className="flex items-start gap-2">
                                <Input
                                    placeholder="000000"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    aria-label="Verification code"
                                    className="max-w-[150px] text-center font-mono text-[17px] tracking-[0.35em]"
                                />
                                <Button type="submit" loading={verifying}>Verify</Button>
                            </div>
                            <p className="text-[12px] text-ink-3">
                                Didn&apos;t get it?{' '}
                                <button
                                    type="button"
                                    onClick={handleRequestVerification}
                                    disabled={requesting}
                                    className="font-medium text-warning underline underline-offset-2 disabled:opacity-50 cursor-pointer"
                                >
                                    {requesting ? 'Sending…' : resent ? 'Send again' : 'Resend code'}
                                </button>
                            </p>
                        </form>
                    </Section>
                </div>
            )}

            {/* Payouts */}
            {user.emailVerified && (
                <Section
                    title="Payouts"
                    icon={RiBankCardLine}
                    description="Connect Stripe to receive money from ticket sales."
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2.5">
                            <span
                                className={`flex h-2 w-2 shrink-0 rounded-full ${payoutsReady ? 'bg-success' : 'bg-warning'}`}
                            />
                            <p className="text-[13px] text-ink-2">
                                {payoutsReady
                                    ? 'Your Stripe account is connected and ready to receive payouts.'
                                    : 'Onboarding is incomplete, you cannot receive payouts yet.'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {!payoutsReady && (
                                <Button size="sm" onClick={handleOnboarding} loading={loadingOnboarding}>
                                    Complete onboarding
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleDashboard}
                                loading={loadingDashboard}
                            >
                                Stripe dashboard <RiExternalLinkLine className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </Section>
            )}

            {/* Security */}
            <Section
                title="Security"
                icon={RiShieldCheckLine}
                description="Change your password from the sign-in screen using a reset code."
            >
                <Button size="sm" variant="secondary" asChild>
                    <a href="/auth/forgot-password">Reset password</a>
                </Button>
            </Section>

            {/* Danger zone */}
            <Section
                title="Danger zone"
                icon={RiAlertLine}
                tone="danger"
                description="Irreversible actions affecting your whole account."
            >
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-medium text-ink">Delete account</p>
                        <p className="mt-0.5 text-[12px] text-ink-3">
                            Permanently removes your account, events, and data.
                        </p>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
                        Delete
                    </Button>
                </div>
            </Section>

            <Modal
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                title="Delete your account?"
                maxWidth="sm"
            >
                <p className="text-sm leading-relaxed text-ink-2">
                    Account deletion isn&apos;t available from here yet. Contact support and we&apos;ll
                    process the request for you.
                </p>
                <div className="mt-6 flex justify-end">
                    <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Close</Button>
                </div>
            </Modal>
        </div>
    );
}
