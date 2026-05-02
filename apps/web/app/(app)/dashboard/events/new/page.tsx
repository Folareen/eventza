'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { EventForm } from '@/components/events/EventForm';
import { useCreateEvent } from '@/lib/queries/events';

export default function NewEventPage() {
    const router = useRouter();
    const { mutateAsync: createEvent, isPending } = useCreateEvent();

    const handleSubmit = async (formData: FormData) => {
        try {
            const result = await createEvent(formData);
            toast.success('Event created successfully');
            router.push(`/dashboard/events/${result.event.id}`);
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to create event');
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <div>
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Create event</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Fill in the details for your new event</p>
            </div>
            <EventForm onSubmit={handleSubmit} loading={isPending} />
        </div>
    );
}
