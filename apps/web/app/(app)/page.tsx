import Link from 'next/link';
import { Suspense } from 'react';
import {
    RiArrowRightLine,
    RiCalendarEventLine,
    RiMusicLine,
    RiCodeSSlashLine,
    RiBriefcaseLine,
    RiBookOpenLine,
    RiRestaurantLine,
    RiRunLine,
    RiPaletteLine,
    RiGroupLine,
    RiHeartPulseLine,
    RiFilmLine,
    RiSparkling2Line,
    RiTeamLine,
} from 'react-icons/ri';
import { EventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { Footer } from '@/components/layout/Footer';
import { Spinner } from '@/components/ui/Spinner';
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

    try {
        const res = await fetch(`${API}/events?${p.toString()}`, { next: { revalidate: 60 } });
        if (!res.ok) return { events: [], pagination: null };
        return res.json() as Promise<{ events: Event[]; pagination: PaginationMeta }>;
    } catch {
        return { events: [], pagination: null };
    }
}

const CATEGORIES = [
    { label: 'Music', icon: RiMusicLine },
    { label: 'Technology', icon: RiCodeSSlashLine },
    { label: 'Business & Networking', icon: RiBriefcaseLine },
    { label: 'Education', icon: RiBookOpenLine },
    { label: 'Food & Drink', icon: RiRestaurantLine },
    { label: 'Sports & Fitness', icon: RiRunLine },
    { label: 'Arts & Culture', icon: RiPaletteLine },
    { label: 'Health & Wellness', icon: RiHeartPulseLine },
    { label: 'Community', icon: RiGroupLine },
    { label: 'Film & Media', icon: RiFilmLine },
    { label: 'Festivals & Fairs', icon: RiSparkling2Line },
    { label: 'Family & Kids', icon: RiTeamLine },
] as const;

const isFiltered = (sp: SearchParams) =>
    !!(sp.search || sp.country || sp.category || sp.startDate || sp.endDate);

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const sp = await searchParams;
    const { events, pagination } = await fetchEvents(sp);
    const page = Number(sp.page ?? 1);
    const filtered = isFiltered(sp);

    return (
        <main className="flex-1 flex flex-col">

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white">
                {/* Decorative blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-violet-400/15 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs font-medium text-indigo-100 mb-6 backdrop-blur-sm">
                            <RiCalendarEventLine className="h-3.5 w-3.5" />
                            Discover · Attend · Experience
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
                            Find events worth<br />your time
                        </h1>
                        <p className="text-lg sm:text-xl text-indigo-200 leading-relaxed mb-8 max-w-lg">
                            From intimate workshops to large-scale concerts — browse, book, and go. Everything in one place.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="#events"
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors shadow-sm"
                            >
                                Browse Events <RiArrowRightLine className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/auth/register"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
                            >
                                Host an Event
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats bar ────────────────────────────────────────── */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 grid grid-cols-3 divide-x divide-zinc-200 dark:divide-zinc-800">
                    {[
                        { value: '500+', label: 'Events listed' },
                        { value: '50+', label: 'Cities covered' },
                        { value: '10k+', label: 'Tickets sold' },
                    ].map(({ value, label }) => (
                        <div key={label} className="flex flex-col items-center px-4 sm:px-8 gap-0.5">
                            <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">{value}</span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 text-center">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Browse by category ───────────────────────────────── */}
            {!filtered && (
                <section className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-5">Browse by category</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {CATEGORIES.map(({ label, icon: Icon }) => (
                                <Link
                                    key={label}
                                    href={`/?category=${encodeURIComponent(label)}`}
                                    className="group flex flex-col items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-4 text-center hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all duration-150"
                                >
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/60 transition-colors">
                                        <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </span>
                                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-tight">{label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Events section ───────────────────────────────────── */}
            <section id="events" className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                            {filtered ? 'Search results' : 'Upcoming events'}
                        </h2>
                        {filtered && (
                            <Link href="/" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-0.5 inline-block">
                                ← Clear filters
                            </Link>
                        )}
                    </div>
                    {sp.category && (
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            Category: <span className="font-medium text-zinc-700 dark:text-zinc-300">{sp.category}</span>
                        </span>
                    )}
                </div>

                <EventFilters />

                <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
                    {events.length === 0 ? (
                        <div className="flex flex-col items-center py-24 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                                <RiCalendarEventLine className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
                            </div>
                            <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-1">No events found</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 max-w-xs">
                                {filtered ? 'Try adjusting or clearing your filters.' : 'No upcoming events yet. Check back soon.'}
                            </p>
                            {filtered && (
                                <Link href="/" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                                    View all events
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
                </Suspense>

                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-2">
                        {page > 1 && <PaginationLink sp={sp} page={page - 1} label="← Previous" />}
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">Page {page} of {pagination.totalPages}</span>
                        {page < pagination.totalPages && <PaginationLink sp={sp} page={page + 1} label="Next →" />}
                    </div>
                )}
            </section>

            {/* ── Host CTA ─────────────────────────────────────────── */}
            <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="max-w-lg">
                        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                            Ready to host your own event?
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                            Create an event, set up tickets, and reach your audience — all from your dashboard. No setup fees.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                        <Link
                            href="/auth/register"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            Get started for free <RiArrowRightLine className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function PaginationLink({ sp, page, label }: { sp: SearchParams; page: number; label: string }) {
    const p = new URLSearchParams();
    Object.entries({ ...sp, page: String(page) }).forEach(([k, v]) => { if (v) p.set(k, v); });
    return (
        <Link
            href={`/?${p.toString()}`}
            className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
            {label}
        </Link>
    );
}
