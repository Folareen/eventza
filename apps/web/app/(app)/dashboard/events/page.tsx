'use client';

import Link from 'next/link';
import {
    RiAddLine,
    RiCalendarLine,
    RiMapPinLine,
    RiArrowRightSLine,
    RiCalendarEventLine,
    RiTimeLine,
    RiCheckboxCircleLine,
} from 'react-icons/ri';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMyEvents } from '@/lib/queries/events';
import type { Event } from '@/lib/types';

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getEventStatus(event: Event): { label: string; color: string } {
    const eventDate = new Date(`${event.date}T${event.time}`);
    const now = new Date();
    if (eventDate > now) return { label: 'Upcoming', color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30' };
    return { label: 'Past', color: 'text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800' };
}

export default function MyEventsPage() {
    const { data, isLoading } = useMyEvents();
    const events = data?.events ?? [];

    const upcoming = events.filter(e => new Date(`${e.date}T${e.time}`) > new Date());
    const past = events.filter(e => new Date(`${e.date}T${e.time}`) <= new Date());

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">My Events</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Manage and track all your events</p>
                </div>
                <Button asChild size="sm">
                    <Link href="/dashboard/events/new" className="flex items-center gap-1.5">
                        <RiAddLine className="h-4 w-4" /> Create event
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            {!isLoading && events.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Total events', value: events.length, icon: RiCalendarEventLine, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
                        { label: 'Upcoming', value: upcoming.length, icon: RiTimeLine, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
                        { label: 'Past', value: past.length, icon: RiCheckboxCircleLine, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                                <Icon className={`h-5 w-5 ${color}`} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-none">{value}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-indigo-600" />
                </div>
            ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 py-20 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                        <RiCalendarLine className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
                    </div>
                    <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">No events yet</p>
                    <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-5 max-w-xs">Create your first event and start selling tickets in minutes.</p>
                    <Button size="sm" asChild>
                        <Link href="/dashboard/events/new">Create your first event</Link>
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {events.map((event) => {
                        const status = getEventStatus(event);
                        return (
                            <Link
                                key={event.id}
                                href={`/dashboard/events/${event.id}`}
                                className="flex items-center gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3.5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all group"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
                                    <RiCalendarEventLine className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                    <span className="font-medium text-zinc-900 dark:text-zinc-50 truncate">{event.title}</span>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                                        <span className="flex items-center gap-1"><RiCalendarLine className="h-3 w-3" />{formatDate(event.date)}</span>
                                        <span className="hidden sm:flex items-center gap-1 truncate"><RiMapPinLine className="h-3 w-3 shrink-0" />{event.venue}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 shrink-0">
                                    <span className={`hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
                                        {status.label}
                                    </span>
                                    <Badge>{event.category}</Badge>
                                    <RiArrowRightSLine className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}


