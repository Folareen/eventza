'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { RiCalendarEventLine, RiArrowRightLine } from 'react-icons/ri';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({
    email: z.string().email('Invalid email'),
    otp: z.string().length(6, 'Enter the 6-digit code'),
    newPassword: z
        .string()
        .min(8, 'At least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/, 'Must include upper, lower, number and special character'),
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit(async (data) => {
        const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const body = await res.json();
        if (!res.ok) { toast.error(body.error ?? 'Failed to reset password'); return; }
        toast.success('Password reset successfully');
        router.push('/auth/login');
    });

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-white dark:bg-zinc-950">
            <div className="w-full max-w-sm">
                <Link href="/" className="flex items-center justify-center gap-2 mb-10">
                    <RiCalendarEventLine className="h-5 w-5 text-indigo-600" />
                    <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">eventza</span>
                </Link>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Set a new password</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Enter the code from your email and choose a new password.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <Input label="Email" type="email" {...register('email')} error={errors.email?.message} autoComplete="email" />
                    <Input
                        label="Reset code"
                        inputMode="numeric"
                        maxLength={6}
                        {...register('otp')}
                        error={errors.otp?.message}
                        placeholder="000000"
                        className="text-center tracking-[0.4em] font-mono"
                    />
                    <Input label="New password" type="password" {...register('newPassword')} error={errors.newPassword?.message} autoComplete="new-password" hint="Min 8 chars · upper · lower · number · special" />
                    <Button type="submit" loading={isSubmitting} className="w-full mt-1">
                        Reset password <RiArrowRightLine className="h-4 w-4" />
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    <Link href="/auth/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">← Back to sign in</Link>
                </p>
            </div>
        </div>
    );
}
