'use client';

import { use, useState } from 'react';
import toast from 'react-hot-toast';
import { RiAddLine } from 'react-icons/ri';
import { ScannersTable } from '@/components/events/ScannersTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useScanners, useCreateScanner, useUpdateScanner, useDeleteScanner } from '@/lib/queries/scanners';
import { useMyEvents } from '@/lib/queries/events';

export default function ScannersPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: scannersData, isLoading } = useScanners();
    const { data: eventsData } = useMyEvents();
    const { mutateAsync: createScanner, isPending: creating } = useCreateScanner();
    const { mutateAsync: updateScanner } = useUpdateScanner();
    const { mutateAsync: deleteScanner } = useDeleteScanner();

    const [showCreate, setShowCreate] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [eventIds, setEventIds] = useState<number[]>([Number(id)]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const scanners = scannersData?.scanners ?? [];
    const userEvents = (eventsData?.events ?? []).map((e) => ({ id: e.id, title: e.title }));

    const toggleEvent = (eid: number) =>
        setEventIds((ids) => ids.includes(eid) ? ids.filter((i) => i !== eid) : [...ids, eid]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (username.length < 3) errs.username = 'At least 3 characters';
        if (password.length < 8) errs.password = 'At least 8 characters';
        if (Object.keys(errs).length) { setErrors(errs); return; }
        try {
            await createScanner({ username, password, eventIds });
            toast.success('Scanner created');
            setShowCreate(false); setUsername(''); setPassword(''); setEventIds([Number(id)]); setErrors({});
        } catch (err: any) { toast.error(err?.message ?? 'Failed to create scanner'); }
    };

    const handleUpdate = async (scannerId: number, data: { username?: string; password?: string; eventIds?: number[] }) => {
        try { await updateScanner({ scannerId, ...data }); toast.success('Scanner updated'); }
        catch (err: any) { toast.error(err?.message ?? 'Failed to update scanner'); }
    };

    const handleDelete = async (scannerId: number) => {
        try { await deleteScanner(scannerId); toast.success('Scanner deleted'); }
        catch (err: any) { toast.error(err?.message ?? 'Failed to delete scanner'); }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Scanners</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Manage check-in scanner accounts</p>
                </div>
                <Button size="sm" onClick={() => setShowCreate(true)} className="flex items-center gap-1.5">
                    <RiAddLine className="h-4 w-4" /> Add scanner
                </Button>
            </div>

            {isLoading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
                : <ScannersTable scanners={scanners} userEvents={userEvents} onUpdate={handleUpdate} onDelete={handleDelete} />}

            <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add scanner">
                <form onSubmit={handleCreate} className="flex flex-col gap-4">
                    <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} error={errors.username} placeholder="scanner_username" />
                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Assign to events</label>
                        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto rounded border border-zinc-200 dark:border-zinc-800 p-2">
                            {userEvents.map((event) => (
                                <label key={event.id} className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer text-sm text-zinc-700 dark:text-zinc-300">
                                    <input type="checkbox" checked={eventIds.includes(event.id)} onChange={() => toggleEvent(event.id)} className="rounded" />
                                    {event.title}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
                        <Button type="submit" loading={creating}>Create scanner</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
