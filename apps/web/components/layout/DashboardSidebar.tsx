'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
    RiAddLine, RiListCheck2, RiBarChartLine, RiUserLine,
    RiTicket2Line, RiShoppingBag3Line, RiQrScanLine, RiPencilLine,
    RiArrowLeftSLine, RiInformationLine,
} from 'react-icons/ri';
import { cn } from '@/lib/cn';
import { useMyEvent } from '@/lib/queries/events';

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    exact?: boolean;
}

function useNavModel() {
    const params = useParams<{ id?: string }>();
    const eventId = params?.id;

    const manage: NavItem[] = [
        { href: '/dashboard/events', label: 'My events', icon: RiListCheck2, exact: true },
        { href: '/dashboard/events/new', label: 'Create event', icon: RiAddLine, exact: true },
    ];

    const eventNav: NavItem[] = eventId
        ? [
            { href: `/dashboard/events/${eventId}`, label: 'Overview', icon: RiInformationLine, exact: true },
            { href: `/dashboard/events/${eventId}/analytics`, label: 'Analytics', icon: RiBarChartLine },
            { href: `/dashboard/events/${eventId}/tickets`, label: 'Tickets', icon: RiTicket2Line },
            { href: `/dashboard/events/${eventId}/orders`, label: 'Orders', icon: RiShoppingBag3Line },
            { href: `/dashboard/events/${eventId}/scanners`, label: 'Scanners', icon: RiQrScanLine },
            { href: `/dashboard/events/${eventId}/edit`, label: 'Edit event', icon: RiPencilLine },
        ]
        : [];

    const account: NavItem[] = [
        { href: '/dashboard/account', label: 'Account', icon: RiUserLine, exact: true },
    ];

    return { eventId, manage, eventNav, account };
}

export function DashboardSidebar() {
    const pathname = usePathname();
    const { eventId, manage, eventNav, account } = useNavModel();
    // 'new' is a route segment, not a real event id.
    const numericId = eventId && /^\d+$/.test(eventId) ? Number(eventId) : null;
    const { data } = useMyEvent(numericId ?? 0);
    const eventTitle = numericId ? data?.event?.title : null;

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

    const renderItem = ({ href, label, icon: Icon, exact }: NavItem) => {
        const active = isActive(href, exact);
        return (
            <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                    'group relative flex items-center gap-2.5 rounded-[var(--radius-control)] px-3 py-2',
                    'text-[13.5px] transition-colors duration-150',
                    active
                        ? 'bg-surface-2 font-medium text-ink'
                        : 'text-ink-3 hover:bg-surface-2/70 hover:text-ink',
                )}
            >
                {/* Active marker rides the left edge. */}
                <span
                    className={cn(
                        'absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-accent',
                        'transition-opacity duration-200',
                        active ? 'opacity-100' : 'opacity-0',
                    )}
                />
                <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-accent' : 'text-ink-4 group-hover:text-ink-3')} />
                {label}
            </Link>
        );
    };

    const heading = (text: string) => (
        <p className="px-3 pb-1.5 pt-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-4">
            {text}
        </p>
    );

    return (
        <aside className="hidden w-56 shrink-0 md:block">
            <nav className="sticky top-24 flex flex-col gap-1">
                {heading('Manage')}
                {manage.map(renderItem)}

                {eventNav.length > 0 && (
                    <>
                        <div className="mt-5 flex flex-col gap-1">
                            <Link
                                href="/dashboard/events"
                                className="flex items-center gap-1 px-3 pb-1 text-[11px] font-medium text-ink-4 transition-colors hover:text-ink-2"
                            >
                                <RiArrowLeftSLine className="h-3.5 w-3.5" /> All events
                            </Link>
                            {eventTitle && (
                                <p
                                    className="truncate px-3 pb-2 font-display text-[15px] leading-snug text-ink"
                                    title={eventTitle}
                                >
                                    {eventTitle}
                                </p>
                            )}
                        </div>
                        {eventNav.map(renderItem)}
                    </>
                )}

                <div className="mt-5">{heading('Account')}</div>
                {account.map(renderItem)}
            </nav>
        </aside>
    );
}

/** Horizontal nav shown on small screens, where the sidebar is hidden. */
export function DashboardMobileNav() {
    const pathname = usePathname();
    const { eventNav, manage, account } = useNavModel();
    const items = eventNav.length > 0 ? eventNav : [...manage, ...account];

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

    return (
        <div className="md:hidden -mx-4 border-b border-line px-4 sm:-mx-6 sm:px-6">
            <nav className="flex gap-1 overflow-x-auto pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {items.map(({ href, label, icon: Icon, exact }) => {
                    const active = isActive(href, exact);
                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] transition-colors',
                                active
                                    ? 'border-accent font-medium text-ink'
                                    : 'border-transparent text-ink-3 hover:text-ink',
                            )}
                        >
                            <Icon className={cn('h-4 w-4', active ? 'text-accent' : 'text-ink-4')} />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
