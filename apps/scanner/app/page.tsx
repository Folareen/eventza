'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { RiQrScanLine, RiArrowRightLine } from 'react-icons/ri';
import { useScannerAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

const schema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
    const router = useRouter();
    const { scanner, isLoading, login } = useScannerAuth();
    const {
        register, handleSubmit, formState: { errors, isSubmitting },
    } = useForm<{ username: string; password: string }>({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (!isLoading && scanner) router.replace('/scan');
    }, [isLoading, scanner, router]);

    const onSubmit = handleSubmit(async ({ username, password }) => {
        try {
            await login(username, password);
            router.push('/scan');
        } catch (err: any) {
            toast.error(err?.message ?? 'Invalid credentials');
        }
    });

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-paper">
                <Spinner size="lg" className="text-accent" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col justify-center bg-paper px-5 py-10">
            <div className="mx-auto w-full max-w-sm animate-rise">
                <div className="mb-9 flex flex-col items-center text-center">
                    <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-[var(--radius-card)] bg-ink text-paper">
                        <RiQrScanLine className="h-7 w-7" />
                    </span>
                    <h1 className="font-display text-[30px] leading-none text-ink">eventza</h1>
                    <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.16em] text-accent-text">
                        Scanner
                    </p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Username"
                        placeholder="door_staff_1"
                        autoComplete="username"
                        autoCapitalize="none"
                        autoCorrect="off"
                        {...register('username')}
                        error={errors.username?.message}
                    />
                    <Input
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        {...register('password')}
                        error={errors.password?.message}
                    />
                    <Button type="submit" size="lg" loading={isSubmitting} className="mt-2 w-full">
                        Sign in <RiArrowRightLine className="h-4 w-4" />
                    </Button>
                </form>

                <p className="mt-8 text-center text-[12px] leading-relaxed text-ink-4">
                    Credentials are issued by the event organiser.
                </p>
            </div>
        </div>
    );
}
