'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import {
    RiArrowLeftSLine, RiArrowRightSLine,
    RiMusicLine, RiCodeSSlashLine, RiBriefcaseLine, RiBookOpenLine,
    RiRestaurantLine, RiRunLine, RiPaletteLine, RiGroupLine,
    RiHeartPulseLine, RiFilmLine, RiSparkling2Line, RiTeamLine,
    RiPriceTag3Line,
} from 'react-icons/ri';
import { cn } from '@/lib/cn';

/** Icons live here, not in the server page: React cannot serialise
 *  component references across the server/client boundary. */
const ICONS: Record<string, React.ElementType> = {
    'Music': RiMusicLine,
    'Technology': RiCodeSSlashLine,
    'Business & Networking': RiBriefcaseLine,
    'Education': RiBookOpenLine,
    'Food & Drink': RiRestaurantLine,
    'Sports & Fitness': RiRunLine,
    'Arts & Culture': RiPaletteLine,
    'Health & Wellness': RiHeartPulseLine,
    'Community': RiGroupLine,
    'Film & Media': RiFilmLine,
    'Festivals & Fairs': RiSparkling2Line,
    'Family & Kids': RiTeamLine,
};

interface CategoryRailProps {
    /** Plain strings, safe to pass from a server component. */
    categories: readonly string[];
    active?: string;
}

export function CategoryRail({ categories, active }: CategoryRailProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(true);

    const sync = () => {
        const el = ref.current;
        if (!el) return;
        setAtStart(el.scrollLeft <= 2);
        setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    };

    useEffect(() => {
        sync();
        const el = ref.current;
        if (!el) return;
        const ro = new ResizeObserver(sync);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const nudge = (dir: 1 | -1) =>
        ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });

    return (
        <div className="relative">
            <div
                ref={ref}
                onScroll={sync}
                className="flex gap-2 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {categories.map((label) => {
                    const Icon = ICONS[label] ?? RiPriceTag3Line;
                    const isActive = active === label;
                    return (
                        <Link
                            key={label}
                            href={isActive ? '/' : `/?category=${encodeURIComponent(label)}`}
                            className={cn(
                                'group flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2',
                                'text-[13px] font-medium whitespace-nowrap',
                                'transition-[background-color,border-color,color] duration-200',
                                isActive
                                    ? 'border-accent bg-accent text-white'
                                    : 'border-line bg-surface text-ink-2 hover:border-ink-4 hover:bg-surface-2',
                            )}
                        >
                            <Icon
                                className={cn(
                                    'h-4 w-4 transition-colors',
                                    isActive ? 'text-white' : 'text-ink-4 group-hover:text-accent',
                                )}
                            />
                            {label}
                        </Link>
                    );
                })}
            </div>

            {!atStart && (
                <>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-paper to-transparent" />
                    <button
                        onClick={() => nudge(-1)}
                        aria-label="Scroll categories left"
                        className="absolute left-0 top-1/2 hidden h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink-2 shadow-sm transition-colors hover:bg-surface-2 sm:flex"
                    >
                        <RiArrowLeftSLine className="h-4 w-4" />
                    </button>
                </>
            )}
            {!atEnd && (
                <>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper to-transparent" />
                    <button
                        onClick={() => nudge(1)}
                        aria-label="Scroll categories right"
                        className="absolute right-0 top-1/2 hidden h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink-2 shadow-sm transition-colors hover:bg-surface-2 sm:flex"
                    >
                        <RiArrowRightSLine className="h-4 w-4" />
                    </button>
                </>
            )}
        </div>
    );
}
