import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../api-client';
import type { Order } from '../types';

export interface EventAnalytics {
    totalTicketsSold: number;
    totalRevenue: number;
    totalCheckIns: number;
    capacityUsed: number;
    ticketBreakdown: Array<{
        id: number;
        name: string;
        sold: number;
        available: number;
        revenue: number;
        price: number;
    }>;
    revenueByDay: Array<{ date: string; revenue: number; orders: number }>;
    ordersByStatus: { confirmed: number; pending: number; cancelled: number };
}

const keys = {
    list: (eventId: number) => ['orders', eventId] as const,
    analytics: (eventId: number) => ['analytics', eventId] as const,
};

export function useEventOrders(eventId: number) {
    return useQuery({
        queryKey: keys.list(eventId),
        queryFn: () => api.get<{ orders: Order[] }>(`/users/me/events/${eventId}/orders`),
        enabled: !!eventId,
    });
}

export function useEventAnalytics(eventId: number) {
    return useQuery({
        queryKey: keys.analytics(eventId),
        queryFn: () => api.get<EventAnalytics>(`/users/me/events/${eventId}/analytics`),
        enabled: !!eventId,
    });
}

export function useCreateOrder() {
    return useMutation({
        mutationFn: ({ eventId, ticketId, ...body }: { eventId: number; ticketId: number; name: string; email: string; quantity: number }) =>
            api.post<{ clientSecret?: string; orders: Order[] }>(`/events/${eventId}/tickets/${ticketId}/order`, body),
    });
}
