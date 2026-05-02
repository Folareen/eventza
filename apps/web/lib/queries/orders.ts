import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api-client';
import type { Order } from '../types';

const keys = {
    list: (eventId: number) => ['orders', eventId] as const,
};

export function useEventOrders(eventId: number) {
    return useQuery({
        queryKey: keys.list(eventId),
        queryFn: () => api.get<{ orders: Order[] }>(`/users/me/events/${eventId}/orders`),
        enabled: !!eventId,
    });
}

export function useCreateOrder() {
    return useMutation({
        mutationFn: ({ eventId, ticketId, ...body }: { eventId: number; ticketId: number; name: string; email: string; quantity: number }) =>
            api.post<{ orders: Order[] }>(`/events/${eventId}/tickets/${ticketId}/order`, body),
    });
}
