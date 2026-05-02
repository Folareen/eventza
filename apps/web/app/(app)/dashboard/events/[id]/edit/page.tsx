'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { EventForm } from '@/components/events/EventForm';
import { Spinner } from '@/components/ui/Spinner';
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
        <div className="flex flex-col gap-6 max-w-2xl">
            <div>
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Edit event</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Update your event details</p>
            </div>
            {isLoading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
                : !event ? <p className="text-zinc-400">Event not found.</p>
                    : <EventForm initialData={event} onSubmit={handleSubmit} loading={isPending} />}
        </div>
    );
}
