'use client';

import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri';
import { Button } from '../ui/Button';
import type { Ticket } from '@/lib/types';

interface TicketCardProps {
    ticket: Ticket;
    onEdit: (ticket: Ticket) => void;
    onDelete: (ticket: Ticket) => void;
}

export function TicketCard({ ticket, onEdit, onDelete }: TicketCardProps) {
    const sold = ticket.quantitySold ?? 0;
    const available = ticket.quantityAvailable;
    const remaining = available - sold;
    const pct = available > 0 ? (sold / available) * 100 : 0;

    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-50 truncate">{ticket.name}</h3>
                    {ticket.description && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{ticket.description}</p>
                    )}
                    <p className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                        {Number(ticket.price) === 0 ? 'Free' : `$${Number(ticket.price).toFixed(2)}`}
                    </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(ticket)} className="h-8 w-8 p-0">
                        <RiEditLine className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(ticket)} className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <RiDeleteBinLine className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="mt-3 flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{sold} sold</span>
                    <span>{remaining} remaining</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                        className="h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-50 transition-all"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <p className="text-xs text-zinc-400">{available} total capacity</p>
            </div>
        </div>
    );
}
