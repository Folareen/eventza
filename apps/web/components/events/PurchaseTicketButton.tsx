'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { RiTicketLine, RiCheckLine } from 'react-icons/ri';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useCreateOrder } from '@/lib/queries/orders';
import { useAuth } from '@/lib/auth-context';

interface Ticket {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    quantityAvailable: number;
    quantitySold?: number;
}

interface Props {
    eventId: number;
    ticket: Ticket;
}

const schema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email is required'),
    quantity: z.number().int().min(1, 'Minimum 1').max(10, 'Maximum 10 per order'),
});

type FormData = z.infer<typeof schema>;

export function PurchaseTicketButton({ eventId, ticket }: Props) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [done, setDone] = useState(false);
    const { mutateAsync: createOrder } = useCreateOrder();

    const remaining = ticket.quantityAvailable - (ticket.quantitySold ?? 0);

    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: user ? `${user.firstName} ${user.lastName}` : '',
            email: user?.email ?? '',
            quantity: 1,
        },
    });

    const qty = watch('quantity') || 1;
    const total = Number(ticket.price) * qty;

    const onSubmit = async (data: FormData) => {
        try {
            await createOrder({ eventId, ticketId: ticket.id, ...data });
            setDone(true);
            toast.success('Order placed! Check your email for your ticket.');
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to place order');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => { setDone(false); reset(); }, 300);
    };

    if (remaining <= 0) {
        return (
            <Button size="sm" disabled className="w-full">Sold out</Button>
        );
    }

    return (
        <>
            <Button size="sm" className="w-full" onClick={() => setOpen(true)}>
                {ticket.price === 0 ? 'Get free ticket' : 'Buy ticket'}
            </Button>

            <Modal open={open} onClose={handleClose} title={done ? 'Order confirmed!' : `Get tickets — ${ticket.name}`}>
                {done ? (
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                            <RiCheckLine className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-lg">You're going!</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                Your ticket confirmation and QR code have been sent to your email.
                            </p>
                        </div>
                        <Button onClick={handleClose} className="w-full">Done</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Input
                            label="Full name"
                            placeholder="Your name"
                            error={errors.name?.message}
                            {...register('name')}
                        />
                        <Input
                            label="Email address"
                            type="email"
                            placeholder="you@example.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Quantity</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={1}
                                    max={Math.min(10, remaining)}
                                    {...register('quantity', { valueAsNumber: true })}
                                    className="w-20 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">{remaining} remaining</span>
                            </div>
                            {errors.quantity && <p className="text-xs text-red-500">{errors.quantity.message}</p>}
                        </div>

                        {ticket.price > 0 && (
                            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 flex items-center justify-between">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Total</span>
                                <span className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">${total.toFixed(2)}</span>
                            </div>
                        )}

                        <Button type="submit" loading={isSubmitting} className="w-full flex items-center justify-center gap-2">
                            <RiTicketLine className="h-4 w-4" />
                            {ticket.price === 0 ? 'Confirm registration' : `Pay $${total.toFixed(2)}`}
                        </Button>
                    </form>
                )}
            </Modal>
        </>
    );
}
