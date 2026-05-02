import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api-client';
import type { Event, PaginationMeta } from '../types';

export interface EventsParams {
    search?: string;
    country?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
}

function buildQs(params: EventsParams) {
    const p = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') p.set(k, String(v)); });
    return p.toString();
}

export const eventKeys = {
    all: ['events'] as const,
    list: (p: EventsParams) => [...eventKeys.all, 'list', p] as const,
    detail: (id: number) => [...eventKeys.all, id] as const,
    mine: ['events', 'mine'] as const,
    myDetail: (id: number) => [...eventKeys.mine, id] as const,
};

export function useEvents(params: EventsParams) {
    return useQuery({
        queryKey: eventKeys.list(params),
        queryFn: () => api.get<{ events: Event[]; pagination: PaginationMeta }>(`/events?${buildQs(params)}`),
    });
}

export function useEvent(id: number) {
    return useQuery({
        queryKey: eventKeys.detail(id),
        queryFn: () => api.get<{ event: Event }>(`/events/${id}`),
        enabled: !!id,
    });
}

export function useMyEvents() {
    return useQuery({
        queryKey: eventKeys.mine,
        queryFn: () => api.get<{ events: Event[] }>('/users/me/events'),
    });
}

export function useMyEvent(id: number) {
    return useQuery({
        queryKey: eventKeys.myDetail(id),
        queryFn: () => api.get<{ event: Event }>(`/users/me/events/${id}`),
        enabled: !!id,
    });
}

export function useCreateEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: FormData) => api.postForm<{ event: Event }>('/events', body),
        onSuccess: () => qc.invalidateQueries({ queryKey: eventKeys.mine }),
    });
}

export function useUpdateEvent(id: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: FormData) => api.putForm<{ event: Event }>(`/events/${id}`, body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: eventKeys.myDetail(id) });
            qc.invalidateQueries({ queryKey: eventKeys.mine });
        },
    });
}

export function useDeleteEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete<{ message: string }>(`/events/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: eventKeys.mine }),
    });
}
