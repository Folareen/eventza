'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
    RiTicket2Line, RiCheckLine, RiSubtractLine, RiAddLine,
    RiDownload2Line, RiShieldCheckLine,
} from 'react-icons/ri';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useCreateOrder } from '@/lib/queries/orders';
import { useAuth } from '@/lib/auth-context';
import { formatMoney } from '@/lib/format';
import type { Order } from '@/lib/types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const MAX_PER_ORDER = 10;

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
    name: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email'),
    quantity: z.number().int().min(1, 'At least 1').max(MAX_PER_ORDER, `Maximum ${MAX_PER_ORDER} per order`),
});

type FormData = z.infer<typeof schema>;

function PaymentForm({ total, onSuccess }: { total: number; onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [paying, setPaying] = useState(false);

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setPaying(true);
        const { error } = await stripe.confirmPayment({ elements, redirect: 'if_required' });
        setPaying(false);
        if (error) toast.error(error.message ?? 'Payment failed');
        else onSuccess();
    };

    return (
        <form onSubmit={handlePay} className="flex flex-col gap-5">
            <PaymentElement />
            <Button type="submit" loading={paying} size="lg" className="w-full">
                Pay {formatMoney(total)}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-[12px] text-ink-4">
                <RiShieldCheckLine className="h-3.5 w-3.5" />
                Payments are processed securely by Stripe
            </p>
        </form>
    );
}

export function PurchaseTicketButton({ eventId, ticket }: Props) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<'form' | 'payment' | 'done'>('form');
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [qrCodes, setQrCodes] = useState<{ code: string; dataUrl: string }[]>([]);
    const { mutateAsync: createOrder } = useCreateOrder();

    const price = Number(ticket.price);
    const remaining = ticket.quantityAvailable - (ticket.quantitySold ?? 0);
    const maxQty = Math.max(1, Math.min(MAX_PER_ORDER, remaining));

    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, reset } =
        useForm<FormData>({
            resolver: zodResolver(schema),
            defaultValues: {
                name: user ? `${user.firstName} ${user.lastName}` : '',
                email: user?.email ?? '',
                quantity: 1,
            },
        });

    const qty = Number(watch('quantity')) || 1;
    const total = price * qty;

    // Render QR codes for display. The user chooses whether to download,
    // rather than the browser firing N downloads unprompted.
    useEffect(() => {
        if (step !== 'done' || orders.length === 0) return;
        let cancelled = false;
        Promise.all(
            orders.map(async (order) => ({
                code: order.code,
                dataUrl: await QRCode.toDataURL(order.code, { width: 400, margin: 2 }),
            })),
        ).then((codes) => { if (!cancelled) setQrCodes(codes); });
        return () => { cancelled = true; };
    }, [step, orders]);

    const downloadAll = () => {
        qrCodes.forEach(({ code, dataUrl }, i) => {
            // Stagger so browsers don't suppress the later downloads.
            setTimeout(() => {
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = `ticket-${code}.png`;
                a.click();
            }, i * 250);
        });
    };

    const onSubmit = async (data: FormData) => {
        try {
            const result = await createOrder({ eventId, ticketId: ticket.id, ...data });
            setOrders(result.orders ?? []);
            if (result.clientSecret) {
                setClientSecret(result.clientSecret);
                setStep('payment');
            } else {
                setStep('done');
                toast.success('You’re going! Check your email.');
            }
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to place order');
        }
    };

    const handleClose = () => {
        setOpen(false);
        // Reset after the exit animation so the content doesn't flash.
        setTimeout(() => {
            setStep('form');
            setClientSecret(null);
            setOrders([]);
            setQrCodes([]);
            reset();
        }, 250);
    };

    if (remaining <= 0) {
        return <Button size="sm" disabled className="w-full">Sold out</Button>;
    }

    const title =
        step === 'done' ? 'You’re going!'
        : step === 'payment' ? 'Complete payment'
        : ticket.name;

    return (
        <>
            <Button size="sm" className="w-full" onClick={() => setOpen(true)}>
                {price === 0 ? 'Get free ticket' : `Buy · ${formatMoney(price)}`}
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                title={title}
                description={
                    step === 'form'
                        ? price === 0 ? 'Free registration' : `${formatMoney(price)} per ticket`
                        : undefined
                }
            >
                {step === 'done' && (
                    <div className="flex flex-col items-center gap-5 py-2 text-center">
                        <span className="flex h-14 w-14 animate-pop items-center justify-center rounded-full bg-success-soft">
                            <RiCheckLine className="h-7 w-7 text-success" />
                        </span>
                        <div>
                            <p className="font-display text-[22px] leading-tight text-ink">
                                {orders.length > 1 ? `${orders.length} tickets confirmed` : 'Ticket confirmed'}
                            </p>
                            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">
                                We&apos;ve emailed your {orders.length > 1 ? 'QR codes' : 'QR code'} — show
                                {orders.length > 1 ? ' them' : ' it'} at the door.
                            </p>
                        </div>

                        {qrCodes.length > 0 && (
                            <div className="flex w-full flex-col gap-3">
                                <div className="flex flex-wrap justify-center gap-3">
                                    {qrCodes.slice(0, 3).map(({ code, dataUrl }) => (
                                        <figure key={code} className="flex flex-col items-center gap-1.5">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={dataUrl}
                                                alt={`QR code for ticket ${code}`}
                                                className="h-24 w-24 rounded-[var(--radius-control)] border border-line bg-white p-1"
                                            />
                                            <figcaption className="font-mono text-[10px] text-ink-4">
                                                {code.slice(0, 10)}
                                            </figcaption>
                                        </figure>
                                    ))}
                                </div>
                                {qrCodes.length > 3 && (
                                    <p className="text-[12px] text-ink-4">
                                        +{qrCodes.length - 3} more in your email
                                    </p>
                                )}
                                <Button variant="secondary" onClick={downloadAll} className="w-full">
                                    <RiDownload2Line className="h-4 w-4" />
                                    Download {qrCodes.length > 1 ? `all ${qrCodes.length}` : 'ticket'}
                                </Button>
                            </div>
                        )}

                        <Button onClick={handleClose} className="w-full">Done</Button>
                    </div>
                )}

                {step === 'payment' && clientSecret && (
                    <Elements
                        stripe={stripePromise}
                        options={{
                            clientSecret,
                            appearance: { theme: 'stripe', variables: { colorPrimary: '#C2410C', borderRadius: '8px' } },
                        }}
                    >
                        <PaymentForm total={total} onSuccess={() => setStep('done')} />
                    </Elements>
                )}

                {step === 'form' && (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Input
                            label="Full name"
                            placeholder="Ada Lovelace"
                            error={errors.name?.message}
                            autoComplete="name"
                            {...register('name')}
                        />
                        <Input
                            label="Email address"
                            type="email"
                            placeholder="you@example.com"
                            error={errors.email?.message}
                            hint="Your ticket QR code goes here"
                            autoComplete="email"
                            {...register('email')}
                        />

                        <div className="flex flex-col gap-1.5">
                            <span className="text-[13px] font-medium text-ink-2">Quantity</span>
                            <div className="flex items-center justify-between rounded-[var(--radius-control)] border border-line-strong bg-surface px-2 py-1.5">
                                <button
                                    type="button"
                                    onClick={() => setValue('quantity', Math.max(1, qty - 1), { shouldValidate: true })}
                                    disabled={qty <= 1}
                                    aria-label="Decrease quantity"
                                    className="flex h-8 w-8 items-center justify-center rounded-[6px] text-ink-2 transition-colors hover:bg-surface-2 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    <RiSubtractLine className="h-4 w-4" />
                                </button>
                                <input
                                    type="number"
                                    min={1}
                                    max={maxQty}
                                    aria-label="Quantity"
                                    {...register('quantity', { valueAsNumber: true })}
                                    className="w-14 border-0 bg-transparent text-center text-[15px] font-medium text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setValue('quantity', Math.min(maxQty, qty + 1), { shouldValidate: true })}
                                    disabled={qty >= maxQty}
                                    aria-label="Increase quantity"
                                    className="flex h-8 w-8 items-center justify-center rounded-[6px] text-ink-2 transition-colors hover:bg-surface-2 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    <RiAddLine className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="text-xs text-ink-4">
                                {remaining <= 10 ? `Only ${remaining} left` : `${remaining} available`}
                                {maxQty < remaining && ` · max ${MAX_PER_ORDER} per order`}
                            </p>
                            {errors.quantity && <p className="text-xs text-danger">{errors.quantity.message}</p>}
                        </div>

                        {price > 0 && (
                            <div className="flex flex-col gap-2 rounded-[var(--radius-control)] bg-surface-2 px-4 py-3.5">
                                <div className="flex justify-between text-[13px] text-ink-3">
                                    <span>{formatMoney(price)} × {qty}</span>
                                    <span className="tabular-nums">${total.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-line" />
                                <div className="flex items-baseline justify-between">
                                    <span className="text-[13px] font-medium text-ink">Total</span>
                                    <span className="font-display text-[22px] leading-none text-ink tabular-nums">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
                            <RiTicket2Line className="h-4 w-4" />
                            {price === 0 ? 'Confirm registration' : `Continue to payment`}
                        </Button>
                    </form>
                )}
            </Modal>
        </>
    );
}
