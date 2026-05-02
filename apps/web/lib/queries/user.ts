import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api-client';
import type { User } from '../types';

export const userKeys = {
    me: ['user', 'me'] as const,
};

export function useCurrentUser() {
    return useQuery({
        queryKey: userKeys.me,
        queryFn: () => api.get<{ user: User }>('/users/me'),
        retry: false,
    });
}

export function useRequestEmailVerification() {
    return useMutation({
        mutationFn: () => api.post<{ message: string }>('/users/me/request-email-verification', {}),
    });
}

export function useVerifyEmail() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (otp: string) => api.post<{ message: string }>('/users/me/verify-email', { otp }),
        onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.me }),
    });
}
