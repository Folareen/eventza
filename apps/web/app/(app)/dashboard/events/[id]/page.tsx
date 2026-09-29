'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    RiCalendarLine, RiMapPinLine, RiTimeLine, RiGroupLine,
    RiPencilLine, RiTicket2Line, RiBarChartLine, RiShoppingBag3Line,
    RiQrScanLine, RiExternalLinkLine, RiArrowRightLine,
} from 'react-icons/ri';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatTime, isPast, relativeDay } from '@/lib/format';
import { useMyEvent } from '@/lib/queries/events';

export default function EventOverviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data, isLoading } = useMyEvent(Number(id));
    const event = data?.event;

    if (isLoading) {
        return (
            <div className="flex flex-col gap-7">
                <Skeleton className="h-9 w-2/5" />
                <Skeleton className="h-[200px] rounded-[var(--radius-card)]" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }, (_, i) => (
                        <Skeleton key={i} className="h-[84px] rounded-[var(--radius-card)]" />
                    ))}
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <EmptyState
                icon={RiTicket2Line}
                title="Event not found"
                description="This event may have been deleted, or you don't have access to it."
                action={<Button variant="secondary" asChild><Link href="/dashboard/events">Back to my events</Link></Button>}
            />
        );
    }

    const past = isPast(event.date, event.time);
    const proximity = past ? null : relativeDay(event.date, event.time);

    const facts = [
        { icon: RiCalendarLine, label: 'Date', value: formatDate(event.date, 'long') },
        { icon: RiTimeLine, label: 'Time', value: formatTime(event.time) },
        { icon: RiMapPinLine, label: 'Venue', value: `${event.venue}, ${event.state}, ${event.country}` },
        { icon: RiGroupLine, label: 'Capacity', value: `${event.capacity} attendees` },
    ];

    const shortcuts = [
        { label: 'Analytics', description: 'Revenue & check-ins', href: `/dashboard/events/${id}/analytics`, icon: RiBarChartLine },
        { label: 'Tickets', description: 'Types & pricing', href: `/dashboard/events/${id}/tickets`, icon: RiTicket2Line },
        { label: 'Orders', description: 'Attendee list', href: `/dashboard/events/${id}/orders`, icon: RiShoppingBag3Line },
        { label: 'Scanners', description: 'Check-in accounts', href: `/dashboard/events/${id}/scanners`, icon: RiQrScanLine },
    ];

    return (
        <div className="flex flex-col gap-7">
            <PageHeader
                title={event.title}
                eyebrow={
                    <>
                        <Badge variant="outline">{event.category}</Badge>
                        {past ? (
                            <Badge>Past event</Badge>
                        ) : proximity ? (
                            <Badge variant="accent">{proximity}</Badge>
                        ) : null}
                    </>
                }
                action={
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/events/${id}`} target="_blank">
                                View public page <RiExternalLinkLine className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                        <Button variant="secondary" size="sm" asChild>
                            <Link href={`/dashboard/events/${id}/edit`}>
                                <RiPencilLine className="h-4 w-4" /> Edit
                            </Link>
                        </Button>
                    </>
                }
            />

            {event.bannerImage && (
                <div className="relative h-44 w-full overflow-hidden rounded-[var(--radius-card)] border border-line sm:h-56">
                    <Image src={event.bannerImage} alt="" fill className="object-cover" sizes="100vw" />
                </div>
            )}

            <div className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:grid-cols-4">
                {facts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex min-w-0 flex-col gap-1.5">
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-4">
                            <Icon className="h-3.5 w-3.5" /> {label}
                        </span>
                        <span className="text-[13px] leading-snug text-ink-2">{value}</span>
                    </div>
                ))}
            </div>

            <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-4">Description</h2>
                <p className="mt-3 whitespace-pre-wrap text-[14px] leading-[1.7] text-ink-2">
                    {event.description}
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-4">Manage</h2>
                <div className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {shortcuts.map(({ label, description, href, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] bg-surface-2 text-ink-3 transition-colors group-hover:bg-accent-soft group-hover:text-accent">
                                <Icon className="h-[18px] w-[18px]" />
                            </span>
                            <span>
                                <span className="flex items-center gap-1 text-[14px] font-medium text-ink">
                                    {label}
                                    <RiArrowRightLine className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                                </span>
                                <span className="mt-0.5 block text-[12px] text-ink-4">{description}</span>
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
