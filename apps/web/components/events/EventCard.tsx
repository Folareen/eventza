import Link from 'next/link';
import Image from 'next/image';
import { RiCalendarLine, RiMapPinLine } from 'react-icons/ri';
import { Badge } from '../ui/Badge';
import type { Event } from '@/lib/types';

interface EventCardProps {
    event: Event;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr: string) {
    const [h, m] = timeStr.split(':');
    const d = new Date();
    d.setHours(Number(h), Number(m));
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function priceLabel(tickets?: Event['tickets']) {
    if (!tickets || tickets.length === 0) return null;
    const prices = tickets.map((t) => Number(t.price));
    const min = Math.min(...prices);
    if (min === 0) return 'Free';
    return `From $${min.toFixed(2)}`;
}

export function EventCard({ event }: EventCardProps) {
    return (
        <Link href={`/events/${event.id}`} className="group flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 shadow-sm">
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {event.bannerImage ? (
                    <>
                        <Image
                            src={event.bannerImage}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30">
                        <RiCalendarLine className="h-10 w-10 text-indigo-300 dark:text-indigo-700" />
                    </div>
                )}
                <div className="absolute top-2.5 left-2.5">
                    <Badge>{event.category}</Badge>
                </div>
            </div>

            <div className="flex flex-col gap-2.5 p-4">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-2 leading-snug">{event.title}</h3>
                <div className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                        <RiCalendarLine className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                        {formatDate(event.date)} · {formatTime(event.time)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <RiMapPinLine className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                        <span className="truncate">{event.venue}, {event.state}</span>
                    </span>
                </div>
                {event.tickets && (
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {priceLabel(event.tickets)}
                    </p>
                )}
            </div>
        </Link>
    );
}
