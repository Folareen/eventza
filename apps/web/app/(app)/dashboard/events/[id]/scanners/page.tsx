'use client';

import { use, useState } from 'react';
import toast from 'react-hot-toast';
import { RiAddLine, RiInformationLine } from 'react-icons/ri';
import { ScannersTable } from '@/components/events/ScannersTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { CheckboxList } from '@/components/ui/CheckboxList';
import { RowSkeleton } from '@/components/ui/Skeleton';
import {
    useScanners, useCreateScanner, useUpdateScanner, useDeleteScanner,
} from '@/lib/queries/scanners';
import { useMyEvents } from '@/lib/queries/events';

const SCANNER_URL = process.env.NEXT_PUBLIC_SCANNER_URL ?? 'http://localhost:3002';

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
    const [busyId, setBusyId] = useState<number | null>(null);

    const scanners = scannersData?.scanners ?? [];
    const userEvents = (eventsData?.events ?? []).map((e) => ({ id: e.id, title: e.title }));

    const toggleEvent = (eid: number) =>
        setEventIds((ids) => (ids.includes(eid) ? ids.filter((i) => i !== eid) : [...ids, eid]));

    const resetForm = () => {
        setShowCreate(false);
        setUsername('');
        setPassword('');
        setEventIds([Number(id)]);
        setErrors({});
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (username.trim().length < 3) errs.username = 'At least 3 characters';
        if (password.length < 8) errs.password = 'At least 8 characters';
        if (eventIds.length === 0) errs.events = 'Assign at least one event';
        if (Object.keys(errs).length) { setErrors(errs); return; }

        try {
            await createScanner({ username: username.trim(), password, eventIds });
            toast.success('Scanner created');
            resetForm();
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to create scanner');
        }
    };

    const handleUpdate = async (
        scannerId: number,
        data: { username?: string; password?: string; eventIds?: number[] },
    ) => {
        setBusyId(scannerId);
        try {
            await updateScanner({ scannerId, ...data });
            toast.success('Scanner updated');
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to update scanner');
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async (scannerId: number) => {
        setBusyId(scannerId);
        try {
            await deleteScanner(scannerId);
            toast.success('Scanner deleted');
        } catch (err: any) {
            toast.error(err?.message ?? 'Failed to delete scanner');
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="flex flex-col gap-7">
            <PageHeader
                title="Scanners"
                description="Accounts your door staff use to check attendees in."
                action={
                    scanners.length > 0 && (
                        <Button size="sm" onClick={() => setShowCreate(true)}>
                            <RiAddLine className="h-4 w-4" /> Add scanner
                        </Button>
                    )
                }
            />

            <div className="flex items-start gap-2.5 rounded-[var(--radius-card)] border border-line bg-surface-2/60 px-4 py-3">
                <RiInformationLine className="mt-px h-4 w-4 shrink-0 text-ink-4" />
                <p className="text-[13px] leading-relaxed text-ink-3">
                    Staff sign in at{' '}
                    <a
                        href={SCANNER_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-accent-text underline underline-offset-2"
                    >
                        the scanner app
                    </a>{' '}
                    with these credentials. Each scanner only sees the events you assign.
                </p>
            </div>

            {isLoading ? (
                <div className="flex flex-col gap-2.5">
                    {Array.from({ length: 3 }, (_, i) => <RowSkeleton key={i} />)}
                </div>
            ) : (
                <>
                    <ScannersTable
                        scanners={scanners}
                        userEvents={userEvents}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        updating={busyId}
                    />
                    {scanners.length === 0 && (
                        <div className="flex justify-center">
                            <Button onClick={() => setShowCreate(true)}>
                                <RiAddLine className="h-4 w-4" /> Create a scanner
                            </Button>
                        </div>
                    )}
                </>
            )}

            <Modal
                open={showCreate}
                onClose={resetForm}
                title="Add scanner"
                description="These credentials are shared with your door staff."
            >
                <form onSubmit={handleCreate} className="flex flex-col gap-4">
                    <Input
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={errors.username}
                        placeholder="door_staff_1"
                        autoComplete="off"
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                        hint="At least 8 characters"
                        autoComplete="new-password"
                    />
                    <div className="flex flex-col gap-1">
                        <CheckboxList
                            label="Assign to events"
                            items={userEvents}
                            selected={eventIds}
                            onToggle={toggleEvent}
                        />
                        {errors.events && <p className="text-xs text-danger">{errors.events}</p>}
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                        <Button type="submit" loading={creating}>Create scanner</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
