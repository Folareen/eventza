'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { RiArrowRightLine, RiMailSendLine, RiLockPasswordLine, RiArrowLeftLine } from 'react-icons/ri';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthShell, AuthHeading } from '@/components/auth/AuthShell';
import { useAuth } from '@/lib/auth-context';

type Mode = 'password' | 'magic' | 'magic-verify';

const passwordSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});
const magicSchema = z.object({ email: z.string().email('Enter a valid email') });
const otpSchema = z.object({ otp: z.string().length(6, 'Enter the 6-digit code') });

type PasswordForm = z.infer<typeof passwordSchema>;
type MagicForm = z.infer<typeof magicSchema>;
type OtpForm = z.infer<typeof otpSchema>;

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, loginWithCode } = useAuth();
    const [mode, setMode] = useState<Mode>('password');
    const [magicEmail, setMagicEmail] = useState('');

    const from = searchParams.get('from') ?? '/dashboard/events';

    const pwForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });
    const magicForm = useForm<MagicForm>({ resolver: zodResolver(magicSchema) });
    const otpForm = useForm<OtpForm>({ resolver: zodResolver(otpSchema) });

    const handlePasswordLogin = pwForm.handleSubmit(async ({ email, password }) => {
        try {
            await login(email, password);
            router.push(from);
        } catch (err: any) {
            toast.error(err?.message ?? 'Login failed');
        }
    });

    const handleRequestMagic = magicForm.handleSubmit(async ({ email }) => {
        try {
            const res = await fetch('/api/auth/request-passwordless-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setMagicEmail(email);
            toast.success('Code sent, check your inbox');
            setMode('magic-verify');
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to send code');
        }
    });

    const handleVerifyOtp = otpForm.handleSubmit(async ({ otp }) => {
        try {
            await loginWithCode(magicEmail, otp);
            router.push(from);
        } catch (err: any) {
            toast.error(err?.message ?? 'Invalid code');
        }
    });

    const copy = {
        password: { title: 'Welcome back', subtitle: 'Sign in to manage your events.' },
        magic: { title: 'Sign in with email', subtitle: 'We’ll send a one-time code to your inbox.' },
        'magic-verify': { title: 'Check your email', subtitle: `We sent a 6-digit code to ${magicEmail}.` },
    }[mode];

    return (
        <AuthShell
            quote={{
                text: 'Create and discover events worth showing up for.',
                attribution: 'Sell tickets, manage orders, check people in.',
            }}
        >
            <AuthHeading title={copy.title} subtitle={copy.subtitle} />

            {mode === 'password' && (
                <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
                    <Input
                        label="Email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        {...pwForm.register('email')}
                        error={pwForm.formState.errors.email?.message}
                    />
                    <div className="flex flex-col gap-1.5">
                        <Input
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            {...pwForm.register('password')}
                            error={pwForm.formState.errors.password?.message}
                        />
                        <Link
                            href="/auth/forgot-password"
                            className="self-end text-[12px] font-medium text-ink-3 transition-colors hover:text-accent-text"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" size="lg" loading={pwForm.formState.isSubmitting} className="w-full">
                        Sign in <RiArrowRightLine className="h-4 w-4" />
                    </Button>

                    <div className="relative my-1 flex items-center">
                        <div className="h-px flex-1 bg-line" />
                        <span className="px-3 text-[11px] uppercase tracking-wide text-ink-4">or</span>
                        <div className="h-px flex-1 bg-line" />
                    </div>

                    <Button type="button" variant="secondary" size="lg" className="w-full" onClick={() => setMode('magic')}>
                        <RiMailSendLine className="h-4 w-4" /> Email me a code
                    </Button>
                </form>
            )}

            {mode === 'magic' && (
                <form onSubmit={handleRequestMagic} className="flex flex-col gap-4">
                    <Input
                        label="Email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        autoFocus
                        {...magicForm.register('email')}
                        error={magicForm.formState.errors.email?.message}
                    />
                    <Button type="submit" size="lg" loading={magicForm.formState.isSubmitting} className="w-full">
                        Send login code <RiMailSendLine className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" className="w-full" onClick={() => setMode('password')}>
                        <RiLockPasswordLine className="h-4 w-4" /> Use password instead
                    </Button>
                </form>
            )}

            {mode === 'magic-verify' && (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                    <Input
                        label="Login code"
                        inputMode="numeric"
                        maxLength={6}
                        autoFocus
                        autoComplete="one-time-code"
                        placeholder="000000"
                        {...otpForm.register('otp')}
                        error={otpForm.formState.errors.otp?.message}
                        className="text-center font-mono text-[22px] tracking-[0.4em]"
                    />
                    <Button type="submit" size="lg" loading={otpForm.formState.isSubmitting} className="w-full">
                        Verify &amp; sign in <RiArrowRightLine className="h-4 w-4" />
                    </Button>
                    <button
                        type="button"
                        onClick={() => setMode('magic')}
                        className="flex items-center justify-center gap-1.5 text-[13px] text-ink-3 transition-colors hover:text-ink cursor-pointer"
                    >
                        <RiArrowLeftLine className="h-3.5 w-3.5" /> Use a different email
                    </button>
                </form>
            )}

            <p className="mt-8 text-center text-[13px] text-ink-3">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="font-medium text-accent-text hover:underline underline-offset-2">
                    Sign up
                </Link>
            </p>
        </AuthShell>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-paper" />}>
            <LoginForm />
        </Suspense>
    );
}
