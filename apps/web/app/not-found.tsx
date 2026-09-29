import Link from 'next/link';
import { RiCompass3Line } from 'react-icons/ri';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/layout/Logo';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-7 bg-paper px-6 text-center">
            <Logo />
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-ink-4">
                <RiCompass3Line className="h-7 w-7" />
            </span>
            <div>
                <p className="font-display text-[64px] leading-none text-ink">404</p>
                <h1 className="mt-3 font-display text-[24px] leading-tight text-ink">
                    This page doesn&apos;t exist
                </h1>
                <p className="mx-auto mt-2.5 max-w-sm text-[14px] leading-relaxed text-ink-3">
                    The link may be broken, or the event may have been removed.
                </p>
            </div>
            <Button asChild size="lg">
                <Link href="/">Browse events</Link>
            </Button>
        </div>
    );
}
