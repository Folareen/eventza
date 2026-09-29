import Link from 'next/link';
import { Suspense } from 'react';
import { RiArrowRightLine, RiSearchLine, RiTicket2Line } from 'react-icons/ri';
import { EventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { CategoryRail } from '@/components/events/CategoryRail';
import { Footer } from '@/components/layout/Footer';
import { EmptyState } from '@/components/ui/EmptyState';
import { EventCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import type { Event, PaginationMeta } from '@/lib/types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

interface SearchParams {
    search?: string;
    country?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
}

async function fetchEvents(sp: SearchParams) {
    const p = new URLSearchParams();
    if (sp.search) p.set('search', sp.search);
    if (sp.country) p.set('country', sp.country);
    if (sp.category) p.set('category', sp.category);
    if (sp.startDate) p.set('startDate', sp.startDate);
    if (sp.endDate) p.set('endDate', sp.endDate);
    p.set('page', sp.page ?? '1');
    p.set('limit', '12');
    p.set('sort', 'date');
    p.set('order', 'asc');

    const empty = { events: [] as Event[], pagination: null };
    try {
        const res = await fetch(`${API}/events?${p.toString()}`, { next: { revalidate: 60 } });
        if (!res.ok) return empty;
        // Await here: a non-JSON body (an HTML error page from a proxy, say)
        // must be caught rather than rejecting after this function returns.
        const data = await res.json();
        return {
            events: Array.isArray(data?.events) ? (data.events as Event[]) : [],
            pagination: (data?.pagination ?? null) as PaginationMeta | null,
        };
    } catch {
        return empty;
    }
}

const CATEGORIES = [
    'Music',
    'Technology',
    'Business & Networking',
    'Education',
    'Food & Drink',
    'Sports & Fitness',
    'Arts & Culture',
    'Health & Wellness',
    'Community',
    'Film & Media',
    'Festivals & Fairs',
    'Family & Kids',
] as const;

const isFiltered = (sp: SearchParams) =>
    Boolean(sp.search || sp.country || sp.category || sp.startDate || sp.endDate);

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const sp = await searchParams;
    const { events, pagination } = await fetchEvents(sp);
    const page = Number(sp.page ?? 1);
    const filtered = isFiltered(sp);

    // Real counts from the API — no invented metrics.
    const total = pagination?.total ?? events.length;
    const cities = new Set(events.map((e) => e.state).filter(Boolean)).size;

    return (
        <main className="flex flex-1 flex-col">
            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-b border-line bg-surface">
                <div className="relative mx-auto grid max-w-[1240px] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:py-24">
                    <div className="animate-rise">
                        <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-text">
                            <span className="h-px w-7 bg-accent" />
                            Discover · Attend · Experience
                        </p>

                        <h1 className="font-display text-[42px] leading-[1.04] tracking-tight text-ink sm:text-[56px] lg:text-[64px]">
                            Find events worth
                            <br />
                            <span className="relative inline-block">
                                your time
                                {/* Hand-drawn underline — a deliberately imperfect stroke. */}
                                <svg
                                    className="absolute -bottom-2 left-0 h-[10px] w-full text-accent"
                                    viewBox="0 0 200 10"
                                    preserveAspectRatio="none"
                                    aria-hidden
                                >
                                    <path
                                        d="M2 7.5C40 3.2 90 2.4 128 4.6c26 1.5 48 2.8 70 1.2"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        fill="none"
                                    />
                                </svg>
                            </span>
                        </h1>

                        <p className="mt-7 max-w-md text-[17px] leading-relaxed text-ink-3">
                            From intimate workshops to large-scale concerts — browse, book, and go.
                            Everything in one place.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Button size="lg" asChild>
                                <Link href="#events">
                                    Browse events <RiArrowRightLine className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/auth/register">Host an event</Link>
                            </Button>
                        </div>

                        {total > 0 && (
                            <p className="mt-8 text-[13px] text-ink-4">
                                <span className="font-semibold text-ink-2">{total}</span>{' '}
                                {total === 1 ? 'event' : 'events'} listed
                                {cities > 0 && (
                                    <> across <span className="font-semibold text-ink-2">{cities}</span>{' '}
                                    {cities === 1 ? 'region' : 'regions'}</>
                                )}
                            </p>
                        )}
                    </div>

                    {/* Editorial collage — real event imagery, not decorative blobs. */}
                    <HeroCollage events={events.slice(0, 3)} />
                </div>
            </section>

            {/* ── Category rail ────────────────────────────────────── */}
            <section className="border-b border-line bg-paper">
                <div className="mx-auto max-w-[1240px] px-4 py-5 sm:px-6">
                    <CategoryRail categories={CATEGORIES} active={sp.category} />
                </div>
            </section>

            {/* ── Events ───────────────────────────────────────────── */}
            <section id="events" className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-6 px-4 py-12 sm:px-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="font-display text-[30px] leading-tight text-ink">
                            {filtered ? 'Search results' : 'Upcoming events'}
                        </h2>
                        <p className="mt-1 text-sm text-ink-3">
                            {filtered
                                ? `${total} ${total === 1 ? 'match' : 'matches'}`
                                : 'Freshly listed, sorted by date'}
                        </p>
                    </div>
                    {filtered && (
                        <Link
                            href="/"
                            className="text-[13px] font-medium text-accent-text transition-opacity hover:opacity-70"
                        >
                            Clear all filters
                        </Link>
                    )}
                </div>

                <EventFilters />

                <Suspense
                    fallback={
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }, (_, i) => <EventCardSkeleton key={i} />)}
                        </div>
                    }
                >
                    {events.length === 0 ? (
                        <EmptyState
                            icon={filtered ? RiSearchLine : RiTicket2Line}
                            title={filtered ? 'No matching events' : 'No events yet'}
                            description={
                                filtered
                                    ? 'Try widening your search or clearing a filter or two.'
                                    : 'Nothing is listed right now. Check back soon, or host the first one.'
                            }
                            action={
                                filtered ? (
                                    <Button variant="secondary" asChild><Link href="/">View all events</Link></Button>
                                ) : (
                                    <Button asChild><Link href="/auth/register">Host an event</Link></Button>
                                )
                            }
                        />
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {events.map((event, i) => (
                                <EventCard key={event.id} event={event} index={i} />
                            ))}
                        </div>
                    )}
                </Suspense>

                {pagination && pagination.totalPages > 1 && (
                    <nav className="mt-4 flex items-center justify-center gap-2" aria-label="Pagination">
                        <PaginationLink sp={sp} page={page - 1} disabled={page <= 1} label="Previous" />
                        <span className="px-3 text-[13px] text-ink-3">
                            Page <span className="font-semibold text-ink">{page}</span> of {pagination.totalPages}
                        </span>
                        <PaginationLink sp={sp} page={page + 1} disabled={page >= pagination.totalPages} label="Next" />
                    </nav>
                )}
            </section>

            {/* ── Host CTA ─────────────────────────────────────────── */}
            <section className="border-t border-line bg-surface">
                <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6">
                    <div className="grain relative overflow-hidden rounded-[var(--radius-panel)] bg-ink px-8 py-14 text-center sm:px-16">
                        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                            For organisers
                        </p>
                        <h2 className="mx-auto max-w-xl font-display text-[34px] leading-[1.12] text-paper sm:text-[42px]">
                            Ready to host your own event?
                        </h2>
                        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-paper/65">
                            Create an event, set up tickets, and reach your audience — all from one
                            dashboard. No setup fees.
                        </p>
                        <div className="mt-9 flex flex-wrap justify-center gap-3">
                            <Link
                                href="/auth/register"
                                className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-control)] bg-accent px-6 text-[15px] font-medium text-white transition-colors hover:bg-accent-hover"
                            >
                                Get started free <RiArrowRightLine className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/auth/login"
                                className="inline-flex h-12 items-center rounded-[var(--radius-control)] border border-paper/25 px-6 text-[15px] font-medium text-paper transition-colors hover:bg-paper/10"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

/** Staggered image collage. Falls back to a typographic panel when
 *  there are no events to show yet. */
function HeroCollage({ events }: { events: Event[] }) {
    const withImages = events.filter((e) => e.bannerImage);

    if (withImages.length === 0) {
        return (
            <div className="relative hidden lg:block">
                <div className="grain relative aspect-[4/3] overflow-hidden rounded-[var(--radius-panel)] bg-surface-2">
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                        <RiTicket2Line className="h-10 w-10 text-ink-4/40" />
                        <p className="font-display text-[22px] text-ink-3">Your next night out</p>
                        <p className="max-w-[200px] text-[13px] leading-relaxed text-ink-4">
                            Listed events appear here as organisers publish them.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative hidden lg:block" aria-hidden>
            <div className="relative aspect-[4/3]">
                {withImages.map((event, i) => {
                    // Three overlapping plates, each rotated slightly.
                    const layout = [
                        'left-0 top-4 h-[62%] w-[58%] -rotate-[3deg] z-20',
                        'right-0 top-0 h-[46%] w-[46%] rotate-[4deg] z-10',
                        'bottom-0 right-6 h-[50%] w-[54%] rotate-[-2deg] z-30',
                    ][i];
                    return (
                        <div
                            key={event.id}
                            style={{ animationDelay: `${120 + i * 110}ms` }}
                            className={`absolute animate-rise overflow-hidden rounded-[var(--radius-card)] border-4 border-surface shadow-xl ${layout}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={event.bannerImage}
                                alt=""
                                className="h-full w-full object-cover"
                                loading="eager"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function PaginationLink({
    sp, page, label, disabled,
}: { sp: SearchParams; page: number; label: string; disabled: boolean }) {
    if (disabled) {
        return (
            <span className="inline-flex h-9 cursor-not-allowed items-center rounded-[var(--radius-control)] border border-line px-4 text-[13px] font-medium text-ink-4/50">
                {label}
            </span>
        );
    }
    const p = new URLSearchParams();
    Object.entries({ ...sp, page: String(page) }).forEach(([k, v]) => { if (v) p.set(k, v); });
    return (
        <Link
            href={`/?${p.toString()}#events`}
            className="inline-flex h-9 items-center rounded-[var(--radius-control)] border border-line-strong bg-surface px-4 text-[13px] font-medium text-ink-2 transition-colors hover:bg-surface-2"
        >
            {label}
        </Link>
    );
}
