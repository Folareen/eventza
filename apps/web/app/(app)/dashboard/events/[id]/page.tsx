'use client';

import { use } from 'react';
import Link from 'next/link';
import { RiCalendarLine, RiMapPinLine, RiTimeLine, RiUserLine, RiPencilLine, RiTicketLine } from 'react-icons/ri';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useMyEvent } from '@/lib/queries/events';

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
function formatTime(t: string) {
    const [h, m] = t.split(':');
    const d = new Date(); d.setHours(Number(h), Number(m));
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function EventOverviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data, isLoading } = useMyEvent(Number(id));
    const event = data?.event;

    if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
    if (!event) return <p className="text-zinc-400">Event not found.</p>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{event.title}</h1>
                    <Badge>{event.category}</Badge>
                </div>
                <Button variant="secondary" size="sm" asChild>
                    <Link href={`/dashboard/events/${id}/edit`} className="flex items-center gap-1.5">
                        <RiPencilLine className="h-4 w-4" /> Edit
                    </Link>
                </Button>
            </div>

            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Details</h2>
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                    <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"><RiCalendarLine className="h-4 w-4 shrink-0" />{formatDate(event.date)}</span>
                    <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"><RiTimeLine className="h-4 w-4 shrink-0" />{formatTime(event.time)}</span>
                    <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 sm:col-span-2"><RiMapPinLine className="h-4 w-4 shrink-0" />{event.venue}, {event.state}, {event.country}</span>
                    <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"><RiUserLine className="h-4 w-4 shrink-0" />Capacity: {event.capacity}</span>
                </div>
            </div>

            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Description</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{event.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                {[
                    { label: 'Tickets', href: `/dashboard/events/${id}/tickets`, icon: RiTicketLine },
                    { label: 'Orders', href: `/dashboard/events/${id}/orders`, icon: RiUserLine },
                    { label: 'Scanners', href: `/dashboard/events/${id}/scanners`, icon: RiUserLine },
                ].map(({ label, href, icon: Icon }) => (
                    <Link key={href} href={href} className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center gap-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
                        <Icon className="h-5 w-5 text-zinc-400" />
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
