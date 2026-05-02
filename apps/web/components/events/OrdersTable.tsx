'use client';

import { RiCheckLine, RiCloseLine } from 'react-icons/ri';
import { Badge } from '../ui/Badge';
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

function formatDate(str: string) {
    return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function OrdersTable({ orders, ticketNames }: OrdersTableProps) {
    if (orders.length === 0) {
        return (
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 py-12 text-center text-sm text-zinc-400">
                No orders yet.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm">
                <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Code</th>
                        <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Name</th>
                        <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400 hidden sm:table-cell">Email</th>
                        {ticketNames && <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400 hidden md:table-cell">Ticket</th>}
                        <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Amount</th>
                        <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                        <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400 hidden lg:table-cell">Checked in</th>
                        <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400 hidden lg:table-cell">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400 max-w-30 truncate">{order.code}</td>
                            <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{order.name}</td>
                            <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 hidden sm:table-cell">{order.email}</td>
                            {ticketNames && <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 hidden md:table-cell">{ticketNames[order.ticketId] ?? '—'}</td>}
                            <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                                {Number(order.amount) === 0 ? 'Free' : `$${Number(order.amount).toFixed(2)}`}
                            </td>
                            <td className="px-4 py-3">
                                <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                                {order.checkedIn
                                    ? <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><RiCheckLine className="h-4 w-4" /> Yes</span>
                                    : <span className="flex items-center gap-1 text-zinc-400"><RiCloseLine className="h-4 w-4" /> No</span>
                                }
                            </td>
                            <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 hidden lg:table-cell">{formatDate(order.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
