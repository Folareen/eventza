'use client';

import { use, useMemo } from 'react';
import { OrdersTable } from '@/components/events/OrdersTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatMoney } from '@/lib/format';
import { useEventOrders } from '@/lib/queries/orders';
import { useTickets } from '@/lib/queries/tickets';

export default function OrdersPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const eventId = Number(id);
    const { data: ordersData, isLoading } = useEventOrders(eventId);
    const { data: ticketsData } = useTickets(eventId);

    const orders = useMemo(() => ordersData?.orders ?? [], [ordersData]);
    const ticketNames = useMemo(
        () => Object.fromEntries((ticketsData?.tickets ?? []).map((t) => [t.id, t.name])),
        [ticketsData],
    );

    const revenue = useMemo(
        () => orders
            .filter((o) => o.status === 'confirmed')
            .reduce((sum, o) => sum + Number(o.amount || 0), 0),
        [orders],
    );

    return (
        <div className="flex flex-col gap-7">
            <PageHeader
                title="Orders"
                description={
                    orders.length > 0
                        ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} · ${formatMoney(revenue)} confirmed revenue`
                        : 'Every booking for this event shows up here.'
                }
            />

            {isLoading ? (
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-9 w-72" />
                    <Skeleton className="h-[320px] rounded-[var(--radius-card)]" />
                </div>
            ) : (
                <OrdersTable orders={orders} ticketNames={ticketNames} />
            )}
        </div>
    );
}
