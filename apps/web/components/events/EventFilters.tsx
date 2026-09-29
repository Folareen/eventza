'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RiSearchLine, RiEqualizerLine, RiCloseLine } from 'react-icons/ri';
import { cn } from '@/lib/cn';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { controlClasses } from '../ui/Field';
import { COUNTRIES, EVENT_CATEGORIES } from '@/lib/constants';

const countryOptions = COUNTRIES.map((c) => ({ value: c.name, label: c.name }));
const categoryOptions = EVENT_CATEGORIES.map((c) => ({ value: c, label: c }));

export function EventFilters() {
    const router = useRouter();
    const sp = useSearchParams();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(sp.get('search') ?? '');
    const [country, setCountry] = useState(sp.get('country') ?? '');
    const [category, setCategory] = useState(sp.get('category') ?? '');
    const [startDate, setStartDate] = useState(sp.get('startDate') ?? '');
    const [endDate, setEndDate] = useState(sp.get('endDate') ?? '');

    useEffect(() => {
        setSearch(sp.get('search') ?? '');
        setCountry(sp.get('country') ?? '');
        setCategory(sp.get('category') ?? '');
        setStartDate(sp.get('startDate') ?? '');
        setEndDate(sp.get('endDate') ?? '');
    }, [sp]);

    // Count only the advanced filters — search has its own visible field.
    const activeCount = [country, category, startDate, endDate].filter(Boolean).length;

    const push = (overrides: Record<string, string> = {}) => {
        const p = new URLSearchParams();
        const vals = { search, country, category, startDate, endDate, ...overrides };
        Object.entries(vals).forEach(([k, v]) => { if (v) p.set(k, v); });
        const qs = p.toString();
        router.push(qs ? `/?${qs}#events` : '/#events');
        setOpen(false);
    };

    const handleReset = () => {
        setSearch(''); setCountry(''); setCategory(''); setStartDate(''); setEndDate('');
        router.push('/');
        setOpen(false);
    };

    const chips = [
        country && { key: 'country', label: country, clear: () => push({ country: '' }) },
        category && { key: 'category', label: category, clear: () => push({ category: '' }) },
        startDate && { key: 'startDate', label: `From ${startDate}`, clear: () => push({ startDate: '' }) },
        endDate && { key: 'endDate', label: `To ${endDate}`, clear: () => push({ endDate: '' }) },
    ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-2">
                <div className="relative flex flex-1 items-center">
                    <RiSearchLine className="pointer-events-none absolute left-3 h-4 w-4 text-ink-4" />
                    <input
                        type="search"
                        placeholder="Search events, venues, organisers…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') push(); }}
                        aria-label="Search events"
                        className={cn(controlClasses(), 'h-11 pl-9 pr-3')}
                    />
                </div>

                <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setOpen((o) => !o)}
                    aria-expanded={open}
                    className="shrink-0"
                >
                    <RiEqualizerLine className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {activeCount > 0 && (
                        <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-white">
                            {activeCount}
                        </span>
                    )}
                </Button>

                <Button size="lg" onClick={() => push()} className="shrink-0">
                    Search
                </Button>
            </div>

            {chips.length > 0 && !open && (
                <div className="flex flex-wrap items-center gap-2 animate-fade">
                    {chips.map((chip) => (
                        <button
                            key={chip.key}
                            onClick={chip.clear}
                            className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pl-3 pr-2 text-[12px] font-medium text-ink-2 transition-colors hover:border-ink-4 cursor-pointer"
                        >
                            {chip.label}
                            <RiCloseLine className="h-3.5 w-3.5 text-ink-4 transition-colors group-hover:text-danger" />
                        </button>
                    ))}
                    <button
                        onClick={handleReset}
                        className="ml-1 text-[12px] font-medium text-ink-4 underline underline-offset-2 transition-colors hover:text-ink cursor-pointer"
                    >
                        Clear all
                    </button>
                </div>
            )}

            {open && (
                <div className="animate-scale-in origin-top rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-sm">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Select
                            label="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="All countries"
                            options={countryOptions}
                        />
                        <Select
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="All categories"
                            options={categoryOptions}
                        />
                        <Input
                            label="From date"
                            type="date"
                            value={startDate}
                            max={endDate || undefined}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <Input
                            label="To date"
                            type="date"
                            value={endDate}
                            min={startDate || undefined}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-line pt-4">
                        <button
                            onClick={handleReset}
                            className="text-[13px] font-medium text-ink-3 transition-colors hover:text-ink cursor-pointer"
                        >
                            Reset all
                        </button>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button size="sm" onClick={() => push()}>Apply filters</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
