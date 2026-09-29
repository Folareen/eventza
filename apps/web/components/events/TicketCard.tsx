'use client';

import { RiPencilLine, RiDeleteBin6Line } from 'react-icons/ri';
import { cn } from '@/lib/cn';
import { Button } from '../ui/Button';
import { formatMoney } from '@/lib/format';
import type { Ticket } from '@/lib/types';

interface TicketCardProps {
    ticket: Ticket;
    onEdit: (ticket: Ticket) => void;
    onDelete: (ticket: Ticket) => void;
}

export function TicketCard({ ticket, onEdit, onDelete }: TicketCardProps) {
    const sold = ticket.quantitySold ?? 0;
    const available = ticket.quantityAvailable;
    const remaining = Math.max(available - sold, 0);
    const pct = available > 0 ? Math.min((sold / available) * 100, 100) : 0;
    const soldOut = remaining === 0 && available > 0;
    const revenue = Number(ticket.price) * sold;

    return (
        <div className="group relative flex flex-col gap-4 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-sm">
            {/* Perforated left edge — the ticket-stub motif. */}
            <span
                className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
                style={{
                    background:
                        'repeating-linear-gradient(to bottom, var(--accent) 0 6px, transparent 6px 12px)',
                    opacity: soldOut ? 0.25 : 0.7,
                }}
                aria-hidden
            />

            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h3 className="truncate font-medium text-ink">{ticket.name}</h3>
                        {soldOut && (
                            <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-4">
                                Sold out
                            </span>
                        )}
                    </div>
                    {ticket.description && (
                        <p className="line-clamp-2 text-[13px] leading-snug text-ink-3">
                            {ticket.description}
                        </p>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 focus-within:opacity-100 group-hover:opacity-100">
                    <Button variant="ghost" size="icon-sm" onClick={() => onEdit(ticket)} aria-label={`Edit ${ticket.name}`}>
                        <RiPencilLine className="h-4 w-4" />
                    </Button>
                    <Button variant="danger-ghost" size="icon-sm" onClick={() => onDelete(ticket)} aria-label={`Delete ${ticket.name}`}>
                        <RiDeleteBin6Line className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <p className="font-display text-[26px] leading-none text-ink">{formatMoney(ticket.price)}</p>

            <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between text-[12px]">
                    <span className="font-medium text-ink-2">
                        {sold} <span className="font-normal text-ink-4">of {available} sold</span>
                    </span>
                    <span className="text-ink-4">{Math.round(pct)}%</span>
                </div>
                <div
                    className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3"
                    role="progressbar"
                    aria-valuenow={Math.round(pct)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${ticket.name} sales progress`}
                >
                    <div
                        className={cn(
                            'h-full rounded-full transition-[width] duration-700 ease-[var(--ease-out-quint)]',
                            soldOut ? 'bg-ink-4' : 'bg-accent',
                        )}
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <div className="flex justify-between text-[11px] text-ink-4">
                    <span>{remaining} remaining</span>
                    {revenue > 0 && <span>${revenue.toFixed(2)} earned</span>}
                </div>
            </div>
        </div>
    );
}
