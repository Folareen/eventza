import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api-client';
import type { Ticket } from '../types';

const keys = {
    list: (eventId: number) => ['tickets', eventId] as const,
};

export function useTickets(eventId: number) {
    return useQuery({
        queryKey: keys.list(eventId),
        queryFn: () => api.get<{ tickets: Ticket[] }>(`/events/${eventId}/tickets`),
        enabled: !!eventId,
    });
}

export function useCreateTicket(eventId: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: { name: string; description?: string; price: number; quantityAvailable: number }) =>
            api.post<{ ticket: Ticket }>(`/events/${eventId}/tickets`, body),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.list(eventId) }),
    });
}

export function useUpdateTicket(eventId: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketId, ...body }: { ticketId: number; name?: string; description?: string; price?: number; quantityAvailable?: number }) =>
            api.put<{ ticket: Ticket }>(`/events/${eventId}/tickets/${ticketId}`, body),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.list(eventId) }),
    });
}

export function useDeleteTicket(eventId: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (ticketId: number) =>
            api.delete<{ message: string }>(`/events/${eventId}/tickets/${ticketId}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.list(eventId) }),
    });
}
