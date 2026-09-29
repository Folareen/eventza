'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { RiArrowRightLine, RiCheckLine } from 'react-icons/ri';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthShell, AuthHeading } from '@/components/auth/AuthShell';
import { cn } from '@/lib/cn';
import { useAuth } from '@/lib/auth-context';

const schema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
    password: z
        .string()
        .min(8, 'At least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/,
            'Include upper, lower, number and special character',
        ),
});

type FormData = z.infer<typeof schema>;

/** Live requirement checklist, better than one error string that only
 *  tells you about the first rule you broke. */
const RULES = [
    { label: '8+ characters', test: (v: string) => v.length >= 8 },
    { label: 'Uppercase', test: (v: string) => /[A-Z]/.test(v) },
    { label: 'Lowercase', test: (v: string) => /[a-z]/.test(v) },
    { label: 'Number', test: (v: string) => /\d/.test(v) },
    { label: 'Special character', test: (v: string) => /[^A-Za-z\d]/.test(v) },
];

export default function RegisterPage() {
    const router = useRouter();
    const { register: authRegister } = useAuth();
    const {
        register, handleSubmit, watch, formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: zodResolver(schema), mode: 'onTouched' });

    const password = watch('password') ?? '';

    const onSubmit = handleSubmit(async (data) => {
        try {
            await authRegister(data);
            toast.success('Account created, welcome to eventza');
            router.push('/dashboard/events');
        } catch (err: any) {
            toast.error(err?.message ?? 'Registration failed');
        }
    });

    return (
        <AuthShell
            quote={{
                text: 'Your events, beautifully managed.',
                attribution: 'Start selling tickets in minutes. No setup fees.',
            }}
        >
            <AuthHeading title="Create your account" subtitle="Free to start, no card required." />

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="First name"
                        autoComplete="given-name"
                        {...register('firstName')}
                        error={errors.firstName?.message}
                    />
                    <Input
                        label="Last name"
                        autoComplete="family-name"
                        {...register('lastName')}
                        error={errors.lastName?.message}
                    />
                </div>

                <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    error={errors.email?.message}
                />

                <div className="flex flex-col gap-2.5">
                    <Input
                        label="Password"
                        type="password"
                        autoComplete="new-password"
                        {...register('password')}
                    />
                    {password.length > 0 && (
                        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 animate-fade">
                            {RULES.map(({ label, test }) => {
                                const ok = test(password);
                                return (
                                    <li
                                        key={label}
                                        className={cn(
                                            'flex items-center gap-1 text-[11.5px] transition-colors',
                                            ok ? 'text-success' : 'text-ink-4',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors',
                                                ok ? 'bg-success text-white' : 'border border-line-strong',
                                            )}
                                        >
                                            {ok && <RiCheckLine className="h-2.5 w-2.5" />}
                                        </span>
                                        {label}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <Button type="submit" size="lg" loading={isSubmitting} className="mt-1 w-full">
                    Create account <RiArrowRightLine className="h-4 w-4" />
                </Button>
            </form>

            <p className="mt-6 text-center text-[12px] leading-relaxed text-ink-4">
                By signing up you agree to our Terms of Service and Privacy Policy.
            </p>

            <p className="mt-6 text-center text-[13px] text-ink-3">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-accent-text hover:underline underline-offset-2">
                    Sign in
                </Link>
            </p>
        </AuthShell>
    );
}
