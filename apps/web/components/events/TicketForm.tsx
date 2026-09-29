'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import type { Ticket } from '@/lib/types';

const schema = z.object({
    name: z.string().min(1, 'Name is required').max(80, 'Keep it under 80 characters'),
    description: z.string().max(240, 'Keep it under 240 characters').optional(),
    price: z.number({ error: 'Enter a price' }).min(0, 'Must be 0 or greater'),
    quantityAvailable: z.number({ error: 'Enter a quantity' }).int('Whole numbers only').min(1, 'At least 1'),
});

type FormData = z.infer<typeof schema>;

interface TicketFormProps {
    initialData?: Ticket;
    onSubmit: (data: {
        name: string; description?: string; price: number; quantityAvailable: number;
    }) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export function TicketForm({ initialData, onSubmit, onCancel, loading }: TicketFormProps) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: initialData?.name ?? '',
            description: initialData?.description ?? '',
            price: initialData ? Number(initialData.price) : 0,
            quantityAvailable: initialData?.quantityAvailable ?? 100,
        },
    });

    const price = watch('price');
    const quantity = watch('quantityAvailable');
    const potential = (Number(price) || 0) * (Number(quantity) || 0);
    const sold = initialData?.quantitySold ?? 0;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
                label="Ticket name"
                {...register('name')}
                error={errors.name?.message}
                placeholder="General Admission"
                autoFocus
            />
            <Textarea
                label="Description"
                {...register('description')}
                error={errors.description?.message}
                placeholder="What's included with this ticket?"
                rows={2}
                hint="Optional, shown under the ticket name at checkout."
            />
            <div className="grid gap-4 sm:grid-cols-2">
                <Input
                    label="Price"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    error={errors.price?.message}
                    icon={<span className="text-[13px]">$</span>}
                    hint="0 makes it free"
                />
                <Input
                    label="Quantity"
                    type="number"
                    min={sold || 1}
                    {...register('quantityAvailable', { valueAsNumber: true })}
                    error={errors.quantityAvailable?.message}
                    hint={sold > 0 ? `${sold} already sold` : undefined}
                />
            </div>

            {potential > 0 && (
                <div className="flex items-center justify-between rounded-[var(--radius-control)] bg-surface-2 px-4 py-3">
                    <span className="text-[13px] text-ink-3">If it sells out</span>
                    <span className="font-display text-[19px] leading-none text-ink tabular-nums">
                        ${potential.toFixed(2)}
                    </span>
                </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit" loading={loading}>
                    {initialData ? 'Save changes' : 'Add ticket'}
                </Button>
            </div>
        </form>
    );
}
