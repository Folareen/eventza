import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
    RiCalendarLine, RiMapPinLine, RiTimeLine, RiGroupLine,
    RiTicket2Line, RiArrowLeftLine,
} from 'react-icons/ri';
import { Badge } from '@/components/ui/Badge';
import { Footer } from '@/components/layout/Footer';
import { PurchaseTicketButton } from '@/components/events/PurchaseTicketButton';
import { formatDate, formatTime, formatMoney, dateParts, relativeDay, isPast } from '@/lib/format';
import type { Event, Ticket } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

async function getEvent(id: string): Promise<Event | null> {
    try {
        const res = await fetch(`${API_URL}/events/${id}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        // Guard against a non-JSON body (e.g. an HTML error page).
        const data = await res.json();
        return data?.event ?? null;
    } catch {
        return null;
    }
}

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
    const { id } = await params;
    const event = await getEvent(id);
    if (!event) return { title: 'Event not found' };
    return {
        title: event.title,
        description: event.description?.slice(0, 160),
        openGraph: {
            title: event.title,
            description: event.description?.slice(0, 160),
            images: event.bannerImage ? [event.bannerImage] : undefined,
        },
    };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEvent(id);
    if (!event) notFound();

    const { month, day } = dateParts(event.date);
    const past = isPast(event.date, event.time);
    const proximity = past ? null : relativeDay(event.date, event.time);
    const tickets: Ticket[] = event.tickets ?? [];

    const facts = [
        { icon: RiCalendarLine, label: 'Date', value: formatDate(event.date, 'long') },
        { icon: RiTimeLine, label: 'Time', value: formatTime(event.time) },
        { icon: RiMapPinLine, label: 'Location', value: `${event.venue}, ${event.state}, ${event.country}` },
        { icon: RiGroupLine, label: 'Capacity', value: `${event.capacity} attendees` },
    ];

    return (
        <main className="flex flex-1 flex-col">
            {/* ── Banner ───────────────────────────────────────────── */}
            <div className="relative h-[240px] w-full overflow-hidden bg-surface-2 sm:h-[340px] lg:h-[400px]">
                {event.bannerImage ? (
                    <>
                        <Image
                            src={event.bannerImage}
                            alt=""
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-ink/25" />
                    </>
                ) : (
                    <div className="grain absolute inset-0 bg-ink" />
                )}

                <div className="absolute inset-x-0 top-0 mx-auto max-w-[1240px] px-4 pt-5 sm:px-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 rounded-full bg-ink/40 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-ink/60"
                    >
                        <RiArrowLeftLine className="h-3.5 w-3.5" /> All events
                    </Link>
                </div>

                <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1240px] px-4 pb-7 sm:px-6">
                    <div className="flex items-end gap-4 animate-rise">
                        <div className="hidden h-[72px] w-[72px] shrink-0 flex-col items-center justify-center rounded-[var(--radius-card)] bg-surface shadow-lg sm:flex">
                            <span className="text-[11px] font-semibold uppercase leading-none tracking-[0.08em] text-accent">
                                {month}
                            </span>
                            <span className="font-display text-[30px] leading-tight text-ink">{day}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <Badge className="border-white/25 bg-white/15 text-white backdrop-blur-sm">
                                    {event.category}
                                </Badge>
                                {past ? (
                                    <Badge className="border-white/25 bg-ink/50 text-white/80 backdrop-blur-sm">
                                        Past event
                                    </Badge>
                                ) : proximity ? (
                                    <Badge className="border-transparent bg-accent text-white">{proximity}</Badge>
                                ) : null}
                            </div>
                            <h1 className="font-display text-[32px] leading-[1.1] text-white drop-shadow-sm sm:text-[44px] lg:text-[52px]">
                                {event.title}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ─────────────────────────────────────────────── */}
            <div className="mx-auto grid w-full max-w-[1240px] flex-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-14">
                <div className="flex min-w-0 flex-col gap-10">
                    {/* Fact strip */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:grid-cols-4">
                        {facts.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex min-w-0 flex-col gap-1.5">
                                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-4">
                                    <Icon className="h-3.5 w-3.5" /> {label}
                                </span>
                                <span className="text-[13px] leading-snug text-ink-2">{value}</span>
                            </div>
                        ))}
                    </div>

                    <section>
                        <h2 className="font-display text-[26px] leading-tight text-ink">About this event</h2>
                        <div className="rule-fade my-5" />
                        <p className="whitespace-pre-wrap text-[15px] leading-[1.75] text-ink-2">
                            {event.description}
                        </p>
                    </section>
                </div>

                {/* ── Ticket panel ─────────────────────────────────── */}
                <aside className="lg:sticky lg:top-24 lg:self-start">
                    <div className="overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface shadow-sm">
                        <div className="flex items-center gap-2 border-b border-line px-5 py-4">
                            <RiTicket2Line className="h-[18px] w-[18px] text-accent" />
                            <h2 className="font-display text-[20px] leading-none text-ink">Tickets</h2>
                        </div>

                        {tickets.length === 0 ? (
                            <p className="px-5 py-10 text-center text-sm text-ink-3">
                                No tickets are on sale for this event yet.
                            </p>
                        ) : past ? (
                            <p className="px-5 py-10 text-center text-sm text-ink-3">
                                This event has already taken place.
                            </p>
                        ) : (
                            <div className="stagger flex flex-col divide-y divide-line">
                                {tickets.map((ticket) => {
                                    const remaining = ticket.quantityAvailable - (ticket.quantitySold ?? 0);
                                    const scarce = remaining > 0 && remaining <= 10;
                                    return (
                                        <div key={ticket.id} className="flex flex-col gap-3 p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium text-ink">{ticket.name}</p>
                                                    {ticket.description && (
                                                        <p className="mt-1 text-[13px] leading-snug text-ink-3">
                                                            {ticket.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="shrink-0 font-display text-[22px] leading-none text-ink">
                                                    {formatMoney(ticket.price)}
                                                </span>
                                            </div>

                                            {remaining > 0 && (
                                                <p className={`text-[12px] font-medium ${scarce ? 'text-accent-text' : 'text-ink-4'}`}>
                                                    {scarce ? `Only ${remaining} left` : `${remaining} remaining`}
                                                </p>
                                            )}

                                            <PurchaseTicketButton eventId={event.id} ticket={ticket as never} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <p className="mt-4 px-1 text-center text-[12px] leading-relaxed text-ink-4">
                        Your ticket QR code is emailed to you right after checkout.
                    </p>
                </aside>
            </div>

            <Footer />
        </main>
    );
}
