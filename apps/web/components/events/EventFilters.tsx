'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RiSearchLine, RiFilter3Line } from 'react-icons/ri';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
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

    const push = (overrides: Record<string, string> = {}) => {
        const p = new URLSearchParams();
        const vals = { search, country, category, startDate, endDate, ...overrides };
        Object.entries(vals).forEach(([k, v]) => { if (v) p.set(k, v); });
        router.push(`/?${p.toString()}`);
        setOpen(false);
    };

    const handleReset = () => {
        setSearch(''); setCountry(''); setCategory(''); setStartDate(''); setEndDate('');
        router.push('/');
        setOpen(false);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') push(); }}
                        className="h-10 w-full rounded border border-zinc-300 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                    />
                </div>
                <Button variant="secondary" onClick={() => setOpen((o) => !o)} className="gap-2 shrink-0">
                    <RiFilter3Line className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                </Button>
                <Button onClick={() => push()} className="shrink-0">Search</Button>
            </div>

            {open && (
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <Select label="Country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="All countries" options={countryOptions} />
                        <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="All categories" options={categoryOptions} />
                        <Input label="From date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <Input label="To date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={handleReset}>Reset</Button>
                        <Button size="sm" onClick={() => push()}>Apply</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
