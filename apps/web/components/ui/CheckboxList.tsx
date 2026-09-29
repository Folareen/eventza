'use client';

import { RiCheckLine } from 'react-icons/ri';
import { cn } from '@/lib/cn';

interface CheckboxListProps {
    label?: string;
    items: { id: number; title: string }[];
    selected: number[];
    onToggle: (id: number) => void;
    emptyText?: string;
}

/** Scrollable multi-select. Replaces the raw checkboxes that rendered
 *  inconsistently across browsers. */
export function CheckboxList({
    label, items, selected, onToggle, emptyText = 'Nothing to choose from yet.',
}: CheckboxListProps) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <div className="flex items-baseline justify-between">
                    <span className="text-[13px] font-medium text-ink-2">{label}</span>
                    {selected.length > 0 && (
                        <span className="text-[12px] text-ink-4">{selected.length} selected</span>
                    )}
                </div>
            )}
            <div className="flex max-h-52 flex-col gap-0.5 overflow-y-auto rounded-[var(--radius-control)] border border-line-strong bg-surface p-1.5">
                {items.length === 0 ? (
                    <p className="px-2 py-6 text-center text-[13px] text-ink-4">{emptyText}</p>
                ) : (
                    items.map((item) => {
                        const checked = selected.includes(item.id);
                        return (
                            <label
                                key={item.id}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[13px] transition-colors',
                                    checked ? 'bg-accent-soft text-ink' : 'text-ink-2 hover:bg-surface-2',
                                )}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => onToggle(item.id)}
                                    className="sr-only"
                                />
                                <span
                                    className={cn(
                                        'flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[5px] border transition-colors',
                                        checked
                                            ? 'border-accent bg-accent text-white'
                                            : 'border-line-strong bg-surface',
                                    )}
                                >
                                    {checked && <RiCheckLine className="h-3 w-3" />}
                                </span>
                                <span className="truncate">{item.title}</span>
                            </label>
                        );
                    })
                )}
            </div>
        </div>
    );
}
