'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import type { Ticket } from '@/lib/types';

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    price: z.number().min(0, 'Must be 0 or greater'),
    quantityAvailable: z.number().int().min(1, 'At least 1'),
});

type FormData = z.infer<typeof schema>;

interface TicketFormProps {
    initialData?: Ticket;
    onSubmit: (data: { name: string; description?: string; price: number; quantityAvailable: number }) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export function TicketForm({ initialData, onSubmit, onCancel, loading }: TicketFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: initialData?.name ?? '',
            description: initialData?.description ?? '',
            price: initialData?.price ?? 0,
            quantityAvailable: initialData?.quantityAvailable ?? undefined,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Ticket name" {...register('name')} error={errors.name?.message} placeholder="e.g. General Admission" />
            <Textarea label="Description (optional)" {...register('description')} placeholder="What's included with this ticket?" rows={2} />
            <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Price ($)" type="number" min="0" step="0.01" {...register('price', { valueAsNumber: true })} error={errors.price?.message} hint="Set to 0 for a free ticket" />
                <Input label="Quantity available" type="number" min="1" {...register('quantityAvailable', { valueAsNumber: true })} error={errors.quantityAvailable?.message} />
            </div>
            <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit" loading={loading}>{initialData ? 'Save changes' : 'Add ticket'}</Button>
            </div>
        </form>
    );
}
