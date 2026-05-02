import { Suspense } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { RiCalendarLine, RiMapPinLine, RiTimeLine, RiUserLine, RiTicketLine } from 'react-icons/ri';
import { Badge } from '@/components/ui/Badge';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

async function getEvent(id: string) {
    const res = await fetch(`${API_URL}/events/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.event ?? null;
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
function formatTime(t: string) {
    const [h, m] = t.split(':');
    const d = new Date(); d.setHours(Number(h), Number(m));
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEvent(id);
    if (!event) notFound();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
            {event.bannerImage && (
                <div className="relative h-56 sm:h-72 w-full rounded-xl overflow-hidden">
                    <Image src={event.bannerImage} alt={event.title} fill className="object-cover" />
                </div>
            )}

            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-start gap-3 justify-between">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{event.title}</h1>
                    <Badge>{event.category}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5"><RiCalendarLine className="h-4 w-4" />{formatDate(event.date)}</span>
                    <span className="flex items-center gap-1.5"><RiTimeLine className="h-4 w-4" />{formatTime(event.time)}</span>
                    <span className="flex items-center gap-1.5"><RiMapPinLine className="h-4 w-4" />{event.venue}, {event.state}, {event.country}</span>
                    <span className="flex items-center gap-1.5"><RiUserLine className="h-4 w-4" />Capacity: {event.capacity}</span>
                </div>
            </div>

            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                <h2 className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-2">About this event</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{event.description}</p>
            </div>

            {event.tickets && event.tickets.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h2 className="text-base font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2"><RiTicketLine className="h-4 w-4" /> Tickets</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {event.tickets.map((ticket: any) => (
                            <div key={ticket.id} className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex justify-between items-start gap-3">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-medium text-zinc-800 dark:text-zinc-100">{ticket.name}</span>
                                    {ticket.description && <p className="text-xs text-zinc-500 dark:text-zinc-400">{ticket.description}</p>}
                                    <span className="text-xs text-zinc-400">{ticket.quantityAvailable - (ticket.quantitySold ?? 0)} remaining</span>
                                </div>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-50 shrink-0">
                                    {ticket.price === 0 ? 'Free' : `$${Number(ticket.price).toFixed(2)}`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
