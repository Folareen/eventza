'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
    RiCalendarEventLine,
    RiAddLine,
    RiListCheck,
    RiLineChartLine,
    RiMoneyDollarCircleLine,
    RiUserLine,
    RiShieldCheckLine,
} from 'react-icons/ri';

export function DashboardSidebar() {
    const pathname = usePathname();
    const params = useParams<{ id?: string }>();
    const eventId = params?.id;

    const topLinks = [
        { href: '/dashboard/events', label: 'My Events', icon: RiListCheck, exact: true },
        { href: '/dashboard/events/new', label: 'Create Event', icon: RiAddLine },
    ];

    const analyticsLinks = [
        { label: 'Analytics', icon: RiLineChartLine },
    ];

    const paymentsLinks = [
        { label: 'Payments', icon: RiMoneyDollarCircleLine },
    ];

    const accountLinks = [
        { href: '/dashboard/account', label: 'Profile', icon: RiUserLine },
    ];

    const eventLinks = eventId
        ? [
            { href: `/dashboard/events/${eventId}`, label: 'Overview', exact: true },
            { href: `/dashboard/events/${eventId}/edit`, label: 'Edit Event' },
            { href: `/dashboard/events/${eventId}/tickets`, label: 'Tickets' },
            { href: `/dashboard/events/${eventId}/orders`, label: 'Orders' },
            { href: `/dashboard/events/${eventId}/scanners`, label: 'Scanners' },
        ]
        : [];

    const isActive = (href: string, exact = false) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

    const activeClass = 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/40 dark:text-indigo-400';
    const inactiveClass = 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200';

    return (
        <aside className="w-56 shrink-0 hidden md:block">
            <nav className="flex flex-col gap-1">
                <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Manage
                </p>
                {topLinks.map(({ href, label, icon: Icon, exact }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${isActive(href, exact) ? activeClass : inactiveClass}`}
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                    </Link>
                ))}

                <p className="mt-4 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Insights
                </p>
                {analyticsLinks.map(({ label, icon: Icon }) => (
                    <div
                        key={label}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 dark:text-zinc-600 cursor-not-allowed select-none"
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{label}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wide bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 rounded-full px-1.5 py-0.5 leading-none">
                            Soon
                        </span>
                    </div>
                ))}

                <p className="mt-4 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Earnings
                </p>
                {paymentsLinks.map(({ label, icon: Icon }) => (
                    <div
                        key={label}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 dark:text-zinc-600 cursor-not-allowed select-none"
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{label}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wide bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 rounded-full px-1.5 py-0.5 leading-none">
                            Soon
                        </span>
                    </div>
                ))}

                <p className="mt-4 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Account
                </p>
                {accountLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${isActive(href, true) ? activeClass : inactiveClass}`}
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                    </Link>
                ))}

                {eventLinks.length > 0 && (
                    <>
                        <p className="mt-4 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            Event
                        </p>
                        {eventLinks.map(({ href, label, exact }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${isActive(href, exact) ? activeClass : inactiveClass}`}
                            >
                                <RiCalendarEventLine className="h-4 w-4 shrink-0" />
                                {label}
                            </Link>
                        ))}
                    </>
                )}
            </nav>
        </aside>
    );
}


