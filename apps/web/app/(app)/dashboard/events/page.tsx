'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';
import {
    RiAddLine, RiMapPinLine, RiArrowRightSLine, RiCalendarEventLine,
    RiTimeLine, RiCheckboxCircleLine, RiBarChartLine, RiTicket2Line,
} from 'react-icons/ri';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { RowSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { formatDate, dateParts, isPast, relativeDay } from '@/lib/format';
import { useMyEvents } from '@/lib/queries/events';
import type { Event } from '@/lib/types';

export default function MyEventsPage() {
    const { data, isLoading } = useMyEvents();
    const events = useMemo(() => data?.events ?? [], [data]);

    const { upcoming, past } = useMemo(() => ({
        upcoming: events.filter((e) => !isPast(e.date, e.time)),
        past: events.filter((e) => isPast(e.date, e.time)),
    }), [events]);

    const stats = [
        { label: 'Total events', value: events.length, icon: RiCalendarEventLine },
        { label: 'Upcoming', value: upcoming.length, icon: RiTimeLine },
        { label: 'Completed', value: past.length, icon: RiCheckboxCircleLine },
    ];

    return (
        <div className="flex flex-col gap-7">
            <PageHeader
                title="My events"
                description="Manage, track, and grow everything you're hosting."
                action={
                    <Button asChild>
                        <Link href="/dashboard/events/new">
                            <RiAddLine className="h-4 w-4" /> Create event
                        </Link>
                    </Button>
                }
            />

            {isLoading ? (
                <>
                    <div className="grid grid-cols-3 gap-3">
                        {Array.from({ length: 3 }, (_, i) => (
                            <Skeleton key={i} className="h-[84px] rounded-[var(--radius-card)]" />
                        ))}
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {Array.from({ length: 4 }, (_, i) => <RowSkeleton key={i} />)}
                    </div>
                </>
            ) : events.length === 0 ? (
                <EmptyState
                    icon={RiTicket2Line}
                    title="No events yet"
                    description="Create your first event and start selling tickets in minutes."
                    action={
                        <Button asChild>
                            <Link href="/dashboard/events/new">
                                <RiAddLine className="h-4 w-4" /> Create your first event
                            </Link>
                        </Button>
                    }
                />
            ) : (
                <>
                    <div className="stagger grid grid-cols-3 gap-3">
                        {stats.map(({ label, value, icon: Icon }) => (
                            <div
                                key={label}
                                className="flex flex-col gap-2.5 rounded-[var(--radius-card)] border border-line bg-surface p-4"
                            >
                                <Icon className="h-4 w-4 text-ink-4" />
                                <div>
                                    <p className="font-display text-[26px] leading-none text-ink">{value}</p>
                                    <p className="mt-1.5 text-[12px] text-ink-4">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {upcoming.length > 0 && (
                        <EventGroup title="Upcoming" count={upcoming.length} events={upcoming} />
                    )}
                    {past.length > 0 && (
                        <EventGroup title="Past" count={past.length} events={past} muted />
                    )}
                </>
            )}
        </div>
    );
}

function EventGroup({
    title, count, events, muted,
}: { title: string; count: number; events: Event[]; muted?: boolean }) {
    return (
        <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-4">{title}</h2>
                <span className="text-[13px] text-ink-4">{count}</span>
                <div className="ml-1 h-px flex-1 bg-line" />
            </div>
            <div className="stagger flex flex-col gap-2.5">
                {events.map((event) => (
                    <EventRow key={event.id} event={event} muted={muted} />
                ))}
            </div>
        </section>
    );
}

function EventRow({ event, muted }: { event: Event; muted?: boolean }) {
    const { month, day } = dateParts(event.date);
    const proximity = muted ? null : relativeDay(event.date, event.time);

    return (
        <div className="group relative flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface px-3 py-3 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-line-strong hover:shadow-md sm:px-4">
            <Link
                href={`/dashboard/events/${event.id}`}
                className="flex min-w-0 flex-1 items-center gap-4"
            >
                {/* Thumbnail doubles as the date chip when no image exists. */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[10px] bg-surface-2 sm:h-14 sm:w-14">
                    {event.bannerImage ? (
                        <Image
                            src={event.bannerImage}
                            alt=""
                            fill
                            className={`object-cover ${muted ? 'opacity-60 grayscale' : ''}`}
                            sizes="56px"
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center">
                            <span className="text-[9px] font-semibold uppercase leading-none tracking-wide text-accent">
                                {month}
                            </span>
                            <span className="font-display text-[17px] leading-tight text-ink">{day}</span>
                        </div>
                    )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className={`truncate font-medium ${muted ? 'text-ink-2' : 'text-ink'}`}>
                        {event.title}
                    </span>
                    <div className="flex items-center gap-2.5 text-[12px] text-ink-4">
                        <span className="shrink-0">{formatDate(event.date, 'medium')}</span>
                        <span className="hidden min-w-0 items-center gap-1 sm:flex">
                            <RiMapPinLine className="h-3 w-3 shrink-0" />
                            <span className="truncate">{event.venue}</span>
                        </span>
                    </div>
                </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
                {proximity && (
                    <Badge variant="accent" className="hidden sm:inline-flex">{proximity}</Badge>
                )}
                <Badge variant="outline" className="hidden md:inline-flex">{event.category}</Badge>

                <Link
                    href={`/dashboard/events/${event.id}/analytics`}
                    title="Analytics"
                    aria-label={`Analytics for ${event.title}`}
                    className="hidden h-8 w-8 items-center justify-center rounded-[var(--radius-control)] text-ink-4 transition-colors hover:bg-surface-2 hover:text-accent sm:flex"
                >
                    <RiBarChartLine className="h-4 w-4" />
                </Link>
                <Link
                    href={`/dashboard/events/${event.id}`}
                    aria-label={`Open ${event.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] text-ink-4 transition-all group-hover:translate-x-0.5 group-hover:text-ink"
                >
                    <RiArrowRightSLine className="h-5 w-5" />
                </Link>
            </div>
        </div>
    );
}
