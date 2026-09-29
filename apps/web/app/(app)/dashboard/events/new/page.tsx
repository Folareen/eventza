'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { EventForm } from '@/components/events/EventForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { useCreateEvent } from '@/lib/queries/events';

export default function NewEventPage() {
    const router = useRouter();
    const { mutateAsync: createEvent, isPending } = useCreateEvent();

    const handleSubmit = async (formData: FormData) => {
        try {
            const result = await createEvent(formData);
            toast.success('Event created — add tickets next');
            router.push(`/dashboard/events/${result.event.id}/tickets`);
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to create event');
        }
    };

    return (
        <div className="flex max-w-3xl flex-col gap-7">
            <PageHeader
                title="Create event"
                description="Tell people what's happening, when, and where."
            />
            <EventForm onSubmit={handleSubmit} loading={isPending} />
        </div>
    );
}
