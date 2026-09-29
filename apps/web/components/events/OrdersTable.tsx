'use client';

import { useState, useMemo } from 'react';
import { RiCheckLine, RiSubtractLine, RiSearchLine, RiShoppingBag3Line } from 'react-icons/ri';
import { cn } from '@/lib/cn';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { controlClasses } from '../ui/Field';
import { formatDateTime, formatMoney } from '@/lib/format';
import type { Order, OrderStatus } from '@/lib/types';

interface OrdersTableProps {
    orders: Order[];
    ticketNames?: Record<number, string>;
}

const statusVariant: Record<OrderStatus, 'success' | 'warning' | 'danger'> = {
    confirmed: 'success',
    pending: 'warning',
    cancelled: 'danger',
};

type Filter = 'all' | OrderStatus;

export function OrdersTable({ orders, ticketNames }: OrdersTableProps) {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<Filter>('all');

    const counts = useMemo(() => ({
        all: orders.length,
        confirmed: orders.filter((o) => o.status === 'confirmed').length,
        pending: orders.filter((o) => o.status === 'pending').length,
        cancelled: orders.filter((o) => o.status === 'cancelled').length,
    }), [orders]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return orders.filter((o) => {
            if (filter !== 'all' && o.status !== filter) return false;
            if (!q) return true;
            return (
                o.name.toLowerCase().includes(q) ||
                o.email.toLowerCase().includes(q) ||
                o.code.toLowerCase().includes(q)
            );
        });
    }, [orders, query, filter]);

    if (orders.length === 0) {
        return (
            <EmptyState
                icon={RiShoppingBag3Line}
                title="No orders yet"
                description="Orders appear here as soon as people start booking tickets."
            />
        );
    }

    const tabs: { key: Filter; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'confirmed', label: 'Confirmed' },
        { key: 'pending', label: 'Pending' },
        { key: 'cancelled', label: 'Cancelled' },
    ];

    const th = 'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-4 whitespace-nowrap';
    const td = 'px-4 py-3.5 align-middle';

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-1 rounded-[var(--radius-control)] bg-surface-2 p-1">
                    {tabs.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={cn(
                                'rounded-[6px] px-3 py-1.5 text-[13px] font-medium transition-colors cursor-pointer',
                                filter === key
                                    ? 'bg-surface text-ink shadow-sm'
                                    : 'text-ink-3 hover:text-ink',
                            )}
                        >
                            {label}
                            <span className="ml-1.5 text-ink-4">{counts[key]}</span>
                        </button>
                    ))}
                </div>

                <div className="relative flex min-w-[220px] flex-1 items-center sm:max-w-xs sm:flex-none">
                    <RiSearchLine className="pointer-events-none absolute left-3 h-4 w-4 text-ink-4" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search name, email, code…"
                        aria-label="Search orders"
                        className={cn(controlClasses(), 'h-9 pl-9 pr-3 text-[13px]')}
                    />
                </div>
            </div>

            {visible.length === 0 ? (
                <div className="rounded-[var(--radius-card)] border border-dashed border-line-strong py-14 text-center">
                    <p className="text-sm text-ink-3">No orders match your search.</p>
                    <button
                        onClick={() => { setQuery(''); setFilter('all'); }}
                        className="mt-2 text-[13px] font-medium text-accent-text underline underline-offset-2 cursor-pointer"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface">
                    <table className="w-full text-sm">
                        <thead className="border-b border-line bg-surface-2/60">
                            <tr>
                                <th className={th}>Attendee</th>
                                <th className={cn(th, 'hidden md:table-cell')}>Code</th>
                                {ticketNames && <th className={cn(th, 'hidden lg:table-cell')}>Ticket</th>}
                                <th className={cn(th, 'text-right')}>Amount</th>
                                <th className={th}>Status</th>
                                <th className={cn(th, 'hidden sm:table-cell')}>Check-in</th>
                                <th className={cn(th, 'hidden xl:table-cell')}>Ordered</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {visible.map((order) => (
                                <tr key={order.id} className="transition-colors hover:bg-surface-2/50">
                                    <td className={td}>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-ink">{order.name}</span>
                                            <span className="text-[12px] text-ink-4">{order.email}</span>
                                        </div>
                                    </td>
                                    <td className={cn(td, 'hidden md:table-cell')}>
                                        <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-ink-3">
                                            {order.code}
                                        </code>
                                    </td>
                                    {ticketNames && (
                                        <td className={cn(td, 'hidden lg:table-cell text-[13px] text-ink-2')}>
                                            {ticketNames[order.ticketId] ?? '-'}
                                        </td>
                                    )}
                                    <td className={cn(td, 'text-right font-medium text-ink tabular-nums')}>
                                        {formatMoney(order.amount)}
                                    </td>
                                    <td className={td}>
                                        <Badge variant={statusVariant[order.status]} className="capitalize">
                                            {order.status}
                                        </Badge>
                                    </td>
                                    <td className={cn(td, 'hidden sm:table-cell')}>
                                        {order.checkedIn ? (
                                            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-success">
                                                <RiCheckLine className="h-4 w-4" /> In
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[13px] text-ink-4">
                                                <RiSubtractLine className="h-4 w-4" /> -
                                            </span>
                                        )}
                                    </td>
                                    <td className={cn(td, 'hidden xl:table-cell whitespace-nowrap text-[13px] text-ink-4')}>
                                        {formatDateTime(order.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="text-[12px] text-ink-4">
                Showing {visible.length} of {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </p>
        </div>
    );
}
