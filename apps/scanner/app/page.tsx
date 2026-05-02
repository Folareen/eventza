'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useScannerAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
    const router = useRouter();
    const { scanner, isLoading, login } = useScannerAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ username: string; password: string }>({
        resolver: zodResolver(schema),
    });

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">eventza</h1>
                    <p className="text-sm text-zinc-500 mt-1">Scanner login</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-6">
                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                        <Input label="Username" {...register('username')} error={errors.username?.message} placeholder="scanner_username" autoComplete="username" />
                        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} autoComplete="current-password" />
                        <Button type="submit" loading={isSubmitting} className="w-full">Sign in</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
