'use client';

import { use, useState } from 'react';
import toast from 'react-hot-toast';
import { RiAddLine, RiTicket2Line } from 'react-icons/ri';
import { TicketCard } from '@/components/events/TicketCard';
import { TicketForm } from '@/components/events/TicketForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTickets, useCreateTicket, useUpdateTicket, useDeleteTicket } from '@/lib/queries/tickets';
import type { Ticket } from '@/lib/types';

export default function TicketsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const eventId = Number(id);
    const { data, isLoading } = useTickets(eventId);
    const { mutateAsync: createTicket, isPending: creating } = useCreateTicket(eventId);
    const { mutateAsync: updateTicket, isPending: updating } = useUpdateTicket(eventId);
    const { mutateAsync: deleteTicket } = useDeleteTicket(eventId);

    const [showCreate, setShowCreate] = useState(false);
    const [editTicket, setEditTicket] = useState<Ticket | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Ticket | null>(null);
    const [deleting, setDeleting] = useState(false);

    const tickets = data?.tickets ?? [];

    const handleCreate = async (body: { name: string; description?: string; price: number; quantityAvailable: number }) => {
        try {
            await createTicket(body);
            toast.success('Ticket added');
            setShowCreate(false);
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to add ticket');
        }
    };

    const handleUpdate = async (body: { name?: string; description?: string; price?: number; quantityAvailable?: number }) => {
        if (!editTicket) return;
        try {
            await updateTicket({ ticketId: editTicket.id, ...body });
            toast.success('Ticket updated');
            setEditTicket(null);
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to update ticket');
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        setDeleting(true);
        try {
            await deleteTicket(confirmDelete.id);
            toast.success('Ticket deleted');
            setConfirmDelete(null);
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to delete ticket');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex flex-col gap-7">
            <PageHeader
                title="Tickets"
                description="Set up the ticket types people can buy for this event."
                action={
                    tickets.length > 0 && (
                        <Button size="sm" onClick={() => setShowCreate(true)}>
                            <RiAddLine className="h-4 w-4" /> Add ticket
                        </Button>
                    )
                }
            />

            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 2 }, (_, i) => (
                        <Skeleton key={i} className="h-[190px] rounded-[var(--radius-card)]" />
                    ))}
                </div>
            ) : tickets.length === 0 ? (
                <EmptyState
                    icon={RiTicket2Line}
                    title="No tickets yet"
                    description="Add at least one ticket type before people can register for your event."
                    action={
                        <Button onClick={() => setShowCreate(true)}>
                            <RiAddLine className="h-4 w-4" /> Add your first ticket
                        </Button>
                    }
                />
            ) : (
                <div className="stagger grid gap-4 sm:grid-cols-2">
                    {tickets.map((t) => (
                        <TicketCard key={t.id} ticket={t} onEdit={setEditTicket} onDelete={setConfirmDelete} />
                    ))}
                </div>
            )}

            <Modal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                title="Add ticket"
                description="Name it, price it, and set how many are available."
            >
                <TicketForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} loading={creating} />
            </Modal>

            <Modal
                open={!!editTicket}
                onClose={() => setEditTicket(null)}
                title="Edit ticket"
                description={editTicket?.name}
            >
                <TicketForm
                    initialData={editTicket ?? undefined}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditTicket(null)}
                    loading={updating}
                />
            </Modal>

            <Modal
                open={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                title="Delete ticket?"
                maxWidth="sm"
            >
                <p className="text-sm leading-relaxed text-ink-2">
                    <span className="font-medium text-ink">{confirmDelete?.name}</span> will be
                    permanently removed. Existing orders for it are not affected.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                    <Button variant="danger" loading={deleting} onClick={handleDelete}>
                        Delete ticket
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
