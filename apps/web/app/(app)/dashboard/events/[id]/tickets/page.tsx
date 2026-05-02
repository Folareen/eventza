'use client';

import { use, useState } from 'react';
import toast from 'react-hot-toast';
import { RiAddLine } from 'react-icons/ri';
import { TicketCard } from '@/components/events/TicketCard';
import { TicketForm } from '@/components/events/TicketForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
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
    const tickets = data?.tickets ?? [];

    const handleCreate = async (body: { name: string; description?: string; price: number; quantityAvailable: number }) => {
        try { await createTicket(body); toast.success('Ticket added'); setShowCreate(false); }
        catch (err: any) { toast.error(err?.message ?? 'Failed to add ticket'); }
    };

    const handleUpdate = async (body: { name?: string; description?: string; price?: number; quantityAvailable?: number }) => {
        if (!editTicket) return;
        try { await updateTicket({ ticketId: editTicket.id, ...body }); toast.success('Ticket updated'); setEditTicket(null); }
        catch (err: any) { toast.error(err?.message ?? 'Failed to update ticket'); }
    };

    const handleDelete = async (ticket: Ticket) => {
        try { await deleteTicket(ticket.id); toast.success('Ticket deleted'); }
        catch (err: any) { toast.error(err?.message ?? 'Failed to delete ticket'); }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Tickets</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Manage ticket types for this event</p>
                </div>
                <Button size="sm" onClick={() => setShowCreate(true)} className="flex items-center gap-1.5">
                    <RiAddLine className="h-4 w-4" /> Add ticket
                </Button>
            </div>

            {isLoading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
                : tickets.length === 0 ? (
                    <div className="flex flex-col items-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 py-16 text-center">
                        <p className="font-medium text-zinc-500 dark:text-zinc-400">No tickets yet</p>
                        <p className="text-sm text-zinc-400 mt-1 mb-4">Add ticket types for your event</p>
                        <Button size="sm" onClick={() => setShowCreate(true)}>Add ticket</Button>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {tickets.map((t) => <TicketCard key={t.id} ticket={t} onEdit={setEditTicket} onDelete={handleDelete} />)}
                    </div>
                )}

            <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add ticket">
                <TicketForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} loading={creating} />
            </Modal>
            <Modal open={!!editTicket} onClose={() => setEditTicket(null)} title="Edit ticket">
                <TicketForm initialData={editTicket ?? undefined} onSubmit={handleUpdate} onCancel={() => setEditTicket(null)} loading={updating} />
            </Modal>
        </div>
    );
}
