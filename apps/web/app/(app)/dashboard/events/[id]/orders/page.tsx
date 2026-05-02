'use client';

import { use } from 'react';
import { OrdersTable } from '@/components/events/OrdersTable';
import { Spinner } from '@/components/ui/Spinner';
import { useEventOrders } from '@/lib/queries/orders';
import { useTickets } from '@/lib/queries/tickets';

export default function OrdersPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const eventId = Number(id);
    const { data: ordersData, isLoading } = useEventOrders(eventId);
    const { data: ticketsData } = useTickets(eventId);

    const orders = ordersData?.orders ?? [];
    const ticketNames = Object.fromEntries((ticketsData?.tickets ?? []).map((t) => [t.id, t.name]));

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Orders</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? 's' : ''}` : 'No orders yet'}
                </p>
            </div>
            {isLoading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
                : <OrdersTable orders={orders} ticketNames={ticketNames} />}
        </div>
    );
}
