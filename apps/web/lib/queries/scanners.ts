import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api-client';
import type { Scanner } from '../types';

const keys = {
    all: ['scanners'] as const,
};

export function useScanners() {
    return useQuery({
        queryKey: keys.all,
        queryFn: () => api.get<{ scanners: Scanner[] }>('/scanners'),
    });
}

export function useCreateScanner() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: { username: string; password: string; eventIds?: number[] }) =>
            api.post<{ scanner: Scanner }>('/scanners', body),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
    });
}

export function useUpdateScanner() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ scannerId, ...body }: { scannerId: number; username?: string; password?: string; eventIds?: number[] }) =>
            api.patch<{ scanner: Scanner }>(`/scanners/${scannerId}`, body),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
    });
}

export function useDeleteScanner() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (scannerId: number) => api.delete<{ message: string }>(`/scanners/${scannerId}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
    });
}
