import Link from 'next/link';
import { RiCalendarEventLine, RiTwitterXLine, RiInstagramLine, RiLinkedinLine } from 'react-icons/ri';

const LINKS = {
    Product: [
        { href: '/', label: 'Browse Events' },
        { href: '/auth/register', label: 'Host an Event' },
        { href: '/auth/login', label: 'Sign In' },
    ],
    Support: [
        { href: '#', label: 'Help Centre' },
        { href: '#', label: 'Contact Us' },
        { href: '#', label: 'Refund Policy' },
    ],
    Legal: [
        { href: '#', label: 'Privacy Policy' },
        { href: '#', label: 'Terms of Service' },
        { href: '#', label: 'Cookie Policy' },
    ],
};

export function Footer() {
    return (
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-8">
                {/* Top grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="col-span-2 sm:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-3">
                            <RiCalendarEventLine className="h-5 w-5 text-indigo-600" />
                            eventza
                        </Link>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[200px]">
                            Discover and host events that bring people together.
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            {[
                                { href: '#', icon: RiTwitterXLine, label: 'Twitter' },
                                { href: '#', icon: RiInstagramLine, label: 'Instagram' },
                                { href: '#', icon: RiLinkedinLine, label: 'LinkedIn' },
                            ].map(({ href, icon: Icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 dark:hover:text-zinc-100 dark:hover:border-zinc-600 transition-colors"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(LINKS).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">{title}</h3>
                            <ul className="flex flex-col gap-2.5">
                                {links.map(({ href, label }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">© {new Date().getFullYear()} eventza. All rights reserved.</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Made with ♥ for event creators everywhere.</p>
                </div>
            </div>
        </footer>
    );
}

