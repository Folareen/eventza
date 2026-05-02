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
import { useAuth } from '@/lib/auth-context';

const schema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    password: z
        .string()
        .min(8, 'At least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/, 'Must include upper, lower, number and special character'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
    const router = useRouter();
    const { register: authRegister } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit(async (data) => {
        try {
            await authRegister(data);
            router.push('/dashboard/events');
        } catch (err: any) {
            toast.error(err.message ?? 'Registration failed');
        }
    });

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
                    <h1 className="text-4xl font-bold leading-tight">Your events, beautifully managed</h1>
                    <p className="text-lg text-indigo-200 leading-relaxed">Create an account and start selling tickets to your events in minutes.</p>
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
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Create your account</h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Get started — it&apos;s free</p>
                    </div>

                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="First name" {...register('firstName')} error={errors.firstName?.message} autoComplete="given-name" />
                            <Input label="Last name" {...register('lastName')} error={errors.lastName?.message} autoComplete="family-name" />
                        </div>
                        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} autoComplete="email" />
                        <Input
                            label="Password"
                            type="password"
                            {...register('password')}
                            error={errors.password?.message}
                            autoComplete="new-password"
                            hint="Min 8 chars · upper · lower · number · special"
                        />
                        <Button type="submit" loading={isSubmitting} className="w-full mt-1">
                            Create account <RiArrowRightLine className="h-4 w-4" />
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
