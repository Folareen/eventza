import Link from 'next/link';
import Image from 'next/image';
import { RiMapPinLine, RiTicket2Line } from 'react-icons/ri';
import { cn } from '@/lib/cn';
import { dateParts, formatTime, relativeDay, isPast } from '@/lib/format';
import type { Event } from '@/lib/types';

interface EventCardProps {
    event: Event;
    /** Index in a grid, drives the entrance stagger. */
    index?: number;
}

function priceLabel(tickets?: Event['tickets']): string | null {
    if (!tickets || tickets.length === 0) return null;
    const prices = tickets.map((t) => Number(t.price)).filter(Number.isFinite);
    if (prices.length === 0) return null;
    const min = Math.min(...prices);
    return min === 0 ? 'Free' : `From $${min.toFixed(2)}`;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
    const { month, day } = dateParts(event.date);
    const price = priceLabel(event.tickets);
    const past = isPast(event.date, event.time);
    const soon = !past && relativeDay(event.date, event.time);

    return (
        <Link
            href={`/events/${event.id}`}
            style={{ animationDelay: `${Math.min(index, 11) * 40}ms` }}
            className={cn(
                'group relative flex flex-col overflow-hidden animate-rise',
                'rounded-[var(--radius-card)] border border-line bg-surface',
                'transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)]',
                'hover:-translate-y-1 hover:border-line-strong hover:shadow-lg',
            )}
        >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2">
                {event.bannerImage ? (
                    <Image
                        src={event.bannerImage}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-surface-3">
                        <RiTicket2Line className="h-9 w-9 text-ink-4/50" />
                    </div>
                )}

                {/* Scrim anchors the date block regardless of image brightness. */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/45 to-transparent" />

                {/* Calendar-block motif, the card's signature element. */}
                <div className="absolute left-3 top-3 flex h-[46px] w-[46px] flex-col items-center justify-center rounded-[10px] bg-surface/95 shadow-md backdrop-blur-sm">
                    <span className="text-[9px] font-semibold uppercase leading-none tracking-[0.08em] text-accent">
                        {month}
                    </span>
                    <span className="font-display text-[19px] leading-tight text-ink">{day}</span>
                </div>

                {past && (
                    <span className="absolute right-3 top-3 rounded-full bg-ink/75 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                        Past
                    </span>
                )}
                {!past && price && (
                    <span className="absolute bottom-3 right-3 rounded-full bg-surface/95 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm backdrop-blur-sm">
                        {price}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-4">
                    <span className="truncate">{event.category}</span>
                    {soon && (
                        <>
                            <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-ink-4" />
                            <span className="shrink-0 text-accent-text normal-case tracking-normal">{soon}</span>
                        </>
                    )}
                </div>

                <h3 className="font-display text-[19px] leading-[1.25] text-ink line-clamp-2 transition-colors group-hover:text-accent-text">
                    {event.title}
                </h3>

                <div className="mt-auto flex flex-col gap-1.5 pt-1.5 text-[13px] text-ink-3">
                    <span className="flex items-center gap-1.5">
                        <RiMapPinLine className="h-3.5 w-3.5 shrink-0 text-ink-4" />
                        <span className="truncate">{event.venue}, {event.state}</span>
                    </span>
                    <span className="text-ink-4">{formatTime(event.time)}</span>
                </div>
            </div>
        </Link>
    );
}
