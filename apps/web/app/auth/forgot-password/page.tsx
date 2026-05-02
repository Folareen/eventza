'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { RiCalendarEventLine, RiMailSendLine, RiArrowRightLine } from 'react-icons/ri';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({ email: z.string().email('Invalid email') });

export default function ForgotPasswordPage() {
    const [sent, setSent] = useState(false);
    const [sentEmail, setSentEmail] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit(async ({ email }) => {
        const res = await fetch('/api/auth/request-password-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error ?? 'Failed to send reset email'); return; }
        setSentEmail(email);
        setSent(true);
    });

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-white dark:bg-zinc-950">
            <div className="w-full max-w-sm">
                <Link href="/" className="flex items-center justify-center gap-2 mb-10">
                    <RiCalendarEventLine className="h-5 w-5 text-indigo-600" />
                    <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">eventza</span>
                </Link>

                {sent ? (
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40">
                            <RiMailSendLine className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Check your inbox</h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                            We sent a reset link to <span className="font-medium text-zinc-700 dark:text-zinc-300">{sentEmail}</span>.
                        </p>
                        <Link
                            href="/auth/reset-password"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Enter reset code <RiArrowRightLine className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Forgot your password?</h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">We&apos;ll send a reset code to your email.</p>
                        </div>
                        <form onSubmit={onSubmit} className="flex flex-col gap-4">
                            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} autoComplete="email" />
                            <Button type="submit" loading={isSubmitting} className="w-full">
                                Send reset code <RiMailSendLine className="h-4 w-4" />
                            </Button>
                        </form>
                    </>
                )}

                <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    <Link href="/auth/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">← Back to sign in</Link>
                </p>
            </div>
        </div>
    );
}
