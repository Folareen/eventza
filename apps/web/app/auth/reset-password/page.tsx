'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { RiArrowRightLine, RiArrowLeftLine } from 'react-icons/ri';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthShell, AuthHeading } from '@/components/auth/AuthShell';

const schema = z.object({
    email: z.string().email('Enter a valid email'),
    otp: z.string().length(6, 'Enter the 6-digit code'),
    newPassword: z
        .string()
        .min(8, 'At least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/,
            'Include upper, lower, number and special character',
        ),
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
    const router = useRouter();
    const {
        register, handleSubmit, formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = handleSubmit(async (data) => {
        const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const body = await res.json();
        if (!res.ok) { toast.error(body.error ?? 'Failed to reset password'); return; }
        toast.success('Password updated — sign in with it now');
        router.push('/auth/login');
    });

    return (
        <AuthShell aside={false}>
            <AuthHeading
                title="Set a new password"
                subtitle="Enter the code from your email and choose a new password."
            />

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    error={errors.email?.message}
                />
                <Input
                    label="Reset code"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    placeholder="000000"
                    {...register('otp')}
                    error={errors.otp?.message}
                    className="text-center font-mono text-[20px] tracking-[0.4em]"
                />
                <Input
                    label="New password"
                    type="password"
                    autoComplete="new-password"
                    {...register('newPassword')}
                    error={errors.newPassword?.message}
                    hint="8+ characters with upper, lower, number and special"
                />
                <Button type="submit" size="lg" loading={isSubmitting} className="mt-1 w-full">
                    Reset password <RiArrowRightLine className="h-4 w-4" />
                </Button>
            </form>

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
