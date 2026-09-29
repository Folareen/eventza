'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { RiTicket2Line } from 'react-icons/ri';
import { EventForm } from '@/components/events/EventForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useMyEvent, useUpdateEvent } from '@/lib/queries/events';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { data, isLoading } = useMyEvent(Number(id));
    const { mutateAsync: updateEvent, isPending } = useUpdateEvent(Number(id));
    const event = data?.event;

    const handleSubmit = async (formData: FormData) => {
        try {
            await updateEvent(formData);
            toast.success('Event updated');
            router.push(`/dashboard/events/${id}`);
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to update event');
        }
    };

    return (
        <div className="flex max-w-3xl flex-col gap-7">
            <PageHeader title="Edit event" description="Update the details attendees see." />

            {isLoading ? (
                <div className="flex flex-col gap-6">
                    {Array.from({ length: 3 }, (_, i) => (
                        <Skeleton key={i} className="h-[120px] rounded-[var(--radius-card)]" />
                    ))}
                </div>
            ) : !event ? (
                <EmptyState
                    icon={RiTicket2Line}
                    title="Event not found"
                    description="It may have been deleted, or you don't have access to it."
                    action={
                        <Button variant="secondary" asChild>
                            <Link href="/dashboard/events">Back to my events</Link>
                        </Button>
                    }
                />
            ) : (
                <EventForm initialData={event} onSubmit={handleSubmit} loading={isPending} />
            )}
        </div>
    );
}
