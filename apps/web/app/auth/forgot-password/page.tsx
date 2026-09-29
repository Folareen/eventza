'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { RiMailSendLine, RiArrowRightLine, RiArrowLeftLine } from 'react-icons/ri';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthShell, AuthHeading } from '@/components/auth/AuthShell';

const schema = z.object({ email: z.string().email('Enter a valid email') });

export default function ForgotPasswordPage() {
    const [sentEmail, setSentEmail] = useState<string | null>(null);
    const {
        register, handleSubmit, formState: { errors, isSubmitting },
    } = useForm<{ email: string }>({ resolver: zodResolver(schema) });

    const onSubmit = handleSubmit(async ({ email }) => {
        const res = await fetch('/api/auth/request-password-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error ?? 'Failed to send reset email'); return; }
        setSentEmail(email);
    });

    return (
        <AuthShell aside={false}>
            {sentEmail ? (
                <div className="text-center animate-rise">
                    <span className="mx-auto mb-5 flex h-12 w-12 animate-pop items-center justify-center rounded-full bg-accent-soft">
                        <RiMailSendLine className="h-6 w-6 text-accent" />
                    </span>
                    <h1 className="font-display text-[28px] leading-tight text-ink">Check your inbox</h1>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-ink-3">
                        We sent a reset code to{' '}
                        <span className="font-medium text-ink">{sentEmail}</span>.
                    </p>
                    <Button size="lg" className="mt-7 w-full" asChild>
                        <Link href="/auth/reset-password">
                            Enter reset code <RiArrowRightLine className="h-4 w-4" />
                        </Link>
                    </Button>
                    <button
                        onClick={() => setSentEmail(null)}
                        className="mt-4 text-[13px] text-ink-3 transition-colors hover:text-ink cursor-pointer"
                    >
                        Use a different email
                    </button>
                </div>
            ) : (
                <>
                    <AuthHeading
                        title="Forgot your password?"
                        subtitle="We'll email you a code to set a new one."
                    />
                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                        <Input
                            label="Email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            autoFocus
                            {...register('email')}
                            error={errors.email?.message}
                        />
                        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
                            Send reset code <RiMailSendLine className="h-4 w-4" />
                        </Button>
                    </form>
                </>
            )}

            <p className="mt-8 text-center">
                <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1.5 text-[13px] text-ink-3 transition-colors hover:text-ink"
                >
                    <RiArrowLeftLine className="h-3.5 w-3.5" /> Back to sign in
                </Link>
            </p>
        </AuthShell>
    );
}
