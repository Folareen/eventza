'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
    RiCheckLine,
    RiMailLine,
    RiUserLine,
    RiShieldCheckLine,
    RiLockPasswordLine,
    RiArrowRightLine,
} from 'react-icons/ri';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/lib/auth-context';
import { useRequestEmailVerification, useVerifyEmail } from '@/lib/queries/user';

export default function AccountPage() {
    const { user } = useAuth();
    const { mutateAsync: requestVerification, isPending: requesting } = useRequestEmailVerification();
    const { mutateAsync: verifyEmail, isPending: verifying } = useVerifyEmail();
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);

    if (!user) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

    const handleRequestVerification = async () => {
        try {
            await requestVerification();
            toast.success('Verification email sent');
            setShowOtpInput(true);
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to send verification email');
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) { toast.error('Enter the 6-digit code'); return; }
        try {
            await verifyEmail(otp);
            toast.success('Email verified successfully');
            setShowOtpInput(false);
            setOtp('');
        } catch (err: any) {
            toast.error(err?.message ?? 'Verification failed');
        }
    };

    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <div>
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Account</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Manage your profile and security settings</p>
            </div>

            {/* Profile card */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="flex items-center gap-4 px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white text-lg font-bold shrink-0 select-none">
                        {initials}
                    </div>
                    <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
                    </div>
                    {user.emailVerified && (
                        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            <RiCheckLine className="h-3 w-3" /> Verified
                        </span>
                    )}
                </div>

                <div className="px-6 py-5 grid gap-5 sm:grid-cols-2">
                    <div>
                        <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">First name</p>
                        <p className="text-sm text-zinc-800 dark:text-zinc-200">{user.firstName}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">Last name</p>
                        <p className="text-sm text-zinc-800 dark:text-zinc-200">{user.lastName}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">Email address</p>
                        <p className="text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                            {user.email}
                            {user.emailVerified
                                ? <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><RiCheckLine className="h-3 w-3" />Verified</span>
                                : <span className="text-xs text-amber-500 font-medium">Not verified</span>}
                        </p>
                    </div>
                </div>
            </div>

            {/* Email verification banner */}
            {!user.emailVerified && (
                <div className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 p-5 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                            <RiMailLine className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Verify your email</p>
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Verify your email address to unlock all features and secure your account.</p>
                        </div>
                    </div>
                    {!showOtpInput ? (
                        <Button size="sm" variant="secondary" onClick={handleRequestVerification} loading={requesting} className="self-start">
                            Send verification email
                        </Button>
                    ) : (
                        <form onSubmit={handleVerify} className="flex gap-2">
                            <Input
                                placeholder="6-digit code"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="flex-1 max-w-[160px]"
                            />
                            <Button type="submit" size="sm" loading={verifying}>Verify</Button>
                        </form>
                    )}
                </div>
            )}

            {/* Security section */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                    <RiShieldCheckLine className="h-4 w-4 text-zinc-500" />
                    <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Security</h2>
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    <Link
                        href="/auth/forgot-password"
                        className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                <RiLockPasswordLine className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Change password</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Update your account password</p>
                            </div>
                        </div>
                        <RiArrowRightLine className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                    </Link>
                </div>
            </div>

            {/* Danger zone */}
            <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-zinc-900">
                <div className="px-6 py-4 border-b border-red-100 dark:border-red-900/30">
                    <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">Danger zone</h2>
                </div>
                <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Delete account</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Permanently delete your account and all data. This cannot be undone.</p>
                    </div>
                    <Button variant="danger" size="sm" disabled>Delete</Button>
                </div>
            </div>
        </div>
    );
}


