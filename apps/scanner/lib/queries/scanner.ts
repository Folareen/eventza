import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api-client';

export function useGetEvent(eventId: number | null) {
    return useQuery({
        queryKey: ['scanner-event', eventId],
        queryFn: () => api.get<{ event: any }>(`/events/${eventId}`),
        enabled: eventId !== null,
        staleTime: 60_000,
    });
}

export function useCheckIn(eventId: number | null) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (code: string) =>
            api.post<{ message: string; order: any }>(`/scanners/${eventId}/checkin`, { code }),
        onSuccess: () => {
            if (eventId) qc.invalidateQueries({ queryKey: ['scanner-event', eventId] });
        },
    });
}
