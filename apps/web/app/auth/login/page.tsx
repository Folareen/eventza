'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { RiCalendarEventLine, RiArrowRightLine, RiMailSendLine, RiLockPasswordLine } from 'react-icons/ri';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';

type Mode = 'password' | 'magic' | 'magic-verify';

const passwordSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
});
const magicSchema = z.object({ email: z.string().email('Invalid email') });
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
            toast.error(err.message ?? 'Login failed');
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
            toast.success('Check your email for a login code');
            setMode('magic-verify');
        } catch (err: any) {
            toast.error(err.message ?? 'Failed to send code');
        }
    });

    const handleVerifyOtp = otpForm.handleSubmit(async ({ otp }) => {
        try {
            await loginWithCode(magicEmail, otp);
            router.push(from);
        } catch (err: any) {
            toast.error(err.message ?? 'Invalid code');
        }
    });

    const heading = {
        password: 'Welcome back',
        magic: 'Sign in with email',
        'magic-verify': 'Check your email',
    }[mode];

    const subheading = {
        password: 'Sign in to your account',
        magic: "We'll send a one-time code to your inbox",
        'magic-verify': `We sent a 6-digit code to ${magicEmail}`,
    }[mode];

    return (
        <div className="min-h-screen flex">
            {/* Decorative left panel */}
            <div className="hidden lg:flex lg:w-[46%] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex-col justify-between p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-violet-400/20 blur-3xl" />
                </div>
                <Link href="/" className="relative flex items-center gap-2.5">
                    <RiCalendarEventLine className="h-6 w-6" />
                    <span className="text-xl font-bold tracking-tight">eventza</span>
                </Link>
                <div className="relative space-y-4">
                    <h1 className="text-4xl font-bold leading-tight">Create &amp; discover unforgettable events</h1>
                    <p className="text-lg text-indigo-200 leading-relaxed">Sell tickets, manage orders, and connect with your audience — all in one place.</p>
                </div>
                <p className="relative text-sm text-indigo-300">© 2026 eventza</p>
            </div>

            {/* Form panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-zinc-950">
                <div className="w-full max-w-sm">
                    <Link href="/" className="lg:hidden flex items-center justify-center gap-2 mb-10">
                        <RiCalendarEventLine className="h-5 w-5 text-indigo-600" />
                        <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">eventza</span>
                    </Link>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{heading}</h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{subheading}</p>
                    </div>

                    {mode === 'password' && (
                        <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
                            <Input label="Email" type="email" autoComplete="email" {...pwForm.register('email')} error={pwForm.formState.errors.email?.message} />
                            <div className="flex flex-col gap-1">
                                <Input label="Password" type="password" autoComplete="current-password" {...pwForm.register('password')} error={pwForm.formState.errors.password?.message} />
                                <div className="text-right">
                                    <Link href="/auth/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                            <Button type="submit" loading={pwForm.formState.isSubmitting} className="w-full mt-1">
                                Sign in <RiArrowRightLine className="h-4 w-4" />
                            </Button>
                            <div className="relative my-1">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200 dark:border-zinc-800" /></div>
                                <div className="relative flex justify-center"><span className="bg-white dark:bg-zinc-950 px-3 text-xs text-zinc-400">or</span></div>
                            </div>
                            <button type="button" onClick={() => setMode('magic')} className="flex items-center justify-center gap-2 h-10 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                <RiMailSendLine className="h-4 w-4" /> Sign in with email code
                            </button>
                        </form>
                    )}

                    {mode === 'magic' && (
                        <form onSubmit={handleRequestMagic} className="flex flex-col gap-4">
                            <Input label="Email" type="email" autoComplete="email" {...magicForm.register('email')} error={magicForm.formState.errors.email?.message} />
                            <Button type="submit" loading={magicForm.formState.isSubmitting} className="w-full">
                                Send login code <RiMailSendLine className="h-4 w-4" />
                            </Button>
                            <button type="button" onClick={() => setMode('password')} className="flex items-center justify-center gap-2 h-10 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                <RiLockPasswordLine className="h-4 w-4" /> Sign in with password instead
                            </button>
                        </form>
                    )}

                    {mode === 'magic-verify' && (
                        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                            <Input
                                label="Login code"
                                inputMode="numeric"
                                maxLength={6}
                                {...otpForm.register('otp')}
                                error={otpForm.formState.errors.otp?.message}
                                placeholder="000000"
                                className="text-center tracking-[0.5em] text-xl font-mono"
                            />
                            <Button type="submit" loading={otpForm.formState.isSubmitting} className="w-full">
                                Verify &amp; sign in <RiArrowRightLine className="h-4 w-4" />
                            </Button>
                            <button type="button" onClick={() => setMode('magic')} className="text-xs text-center text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                                Didn&apos;t get the code? Resend
                            </button>
                        </form>
                    )}

                    <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
