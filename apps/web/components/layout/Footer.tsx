import Link from 'next/link';
import { RiTwitterXLine, RiInstagramLine, RiLinkedinLine } from 'react-icons/ri';
import { Logo } from './Logo';

const LINKS = {
    Product: [
        { href: '/', label: 'Discover events' },
        { href: '/host', label: 'Host an event' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/dashboard/events', label: 'Dashboard' },
    ],
    Support: [
        { href: '#', label: 'Help centre' },
        { href: '#', label: 'Contact us' },
        { href: '#', label: 'Refund policy' },
    ],
    Legal: [
        { href: '#', label: 'Privacy policy' },
        { href: '#', label: 'Terms of service' },
        { href: '#', label: 'Cookie policy' },
    ],
};

const SOCIALS = [
    { href: '#', icon: RiTwitterXLine, label: 'X' },
    { href: '#', icon: RiInstagramLine, label: 'Instagram' },
    { href: '#', icon: RiLinkedinLine, label: 'LinkedIn' },
];

export function Footer() {
    return (
        <footer className="mt-auto border-t border-line bg-surface">
            <div className="mx-auto max-w-[1240px] px-4 sm:px-6 pt-14 pb-8">
                <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-8">
                    <div className="col-span-2 sm:col-span-1">
                        <Logo />
                        <p className="mt-3.5 max-w-[210px] text-sm leading-relaxed text-ink-3">
                            Discover and host events that bring people together.
                        </p>
                        <div className="mt-5 flex items-center gap-2">
                            {SOCIALS.map(({ href, icon: Icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-4 transition-colors hover:border-ink-4 hover:text-ink"
                                >
                                    <Icon className="h-[15px] w-[15px]" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {Object.entries(LINKS).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-4">
                                {title}
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {links.map(({ href, label }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="text-sm text-ink-3 transition-colors hover:text-ink"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
                    <p className="text-xs text-ink-4">
                        © {new Date().getFullYear()} eventza. All rights reserved.
                    </p>
                    <p className="text-xs text-ink-4">Built for event creators everywhere.</p>
                </div>
            </div>
        </footer>
    );
}
