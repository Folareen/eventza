'use client';

import { useState } from 'react';
import { RiPencilLine, RiDeleteBin6Line, RiQrScanLine } from 'react-icons/ri';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { CheckboxList } from '../ui/CheckboxList';
import type { Scanner } from '@/lib/types';

interface ScannersTableProps {
    scanners: Scanner[];
    userEvents: { id: number; title: string }[];
    onUpdate: (scannerId: number, data: { username?: string; password?: string; eventIds?: number[] }) => Promise<void>;
    onDelete: (scannerId: number) => Promise<void>;
    updating?: number | null;
}

export function ScannersTable({
    scanners, userEvents, onUpdate, onDelete, updating,
}: ScannersTableProps) {
    const [editScanner, setEditScanner] = useState<Scanner | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Scanner | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
    const [saving, setSaving] = useState(false);

    const openEdit = (s: Scanner) => {
        setEditScanner(s);
        setUsername(s.username);
        setPassword('');
        setSelectedEventIds(s.events?.map((e) => e.id) ?? []);
    };

    const toggleEvent = (id: number) =>
        setSelectedEventIds((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));

    const handleSave = async () => {
        if (!editScanner) return;
        setSaving(true);
        try {
            const data: { username?: string; password?: string; eventIds?: number[] } = {
                eventIds: selectedEventIds,
            };
            if (username !== editScanner.username) data.username = username;
            if (password) data.password = password;
            await onUpdate(editScanner.id, data);
            setEditScanner(null);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        await onDelete(confirmDelete.id);
        setConfirmDelete(null);
    };

    if (scanners.length === 0) {
        return (
            <EmptyState
                icon={RiQrScanLine}
                title="No scanners yet"
                description="Create a scanner account so staff can check attendees in at the door."
            />
        );
    }

    return (
        <>
            <div className="stagger flex flex-col gap-2.5">
                {scanners.map((scanner) => (
                    <div
                        key={scanner.id}
                        className="group flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface px-4 py-3.5 transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-sm"
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-surface-2 text-ink-3">
                            <RiQrScanLine className="h-[18px] w-[18px]" />
                        </span>

                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                            <span className="truncate font-medium text-ink">{scanner.username}</span>
                            <div className="flex flex-wrap items-center gap-1.5">
                                {scanner.events?.length ? (
                                    <>
                                        {scanner.events.slice(0, 2).map((e) => (
                                            <Badge key={e.id} variant="outline">{e.title}</Badge>
                                        ))}
                                        {scanner.events.length > 2 && (
                                            <span className="text-[12px] text-ink-4">
                                                +{scanner.events.length - 2} more
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-[12px] text-ink-4">No events assigned</span>
                                )}
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => openEdit(scanner)}
                                aria-label={`Edit ${scanner.username}`}
                            >
                                <RiPencilLine className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="danger-ghost"
                                size="icon-sm"
                                loading={updating === scanner.id}
                                onClick={() => setConfirmDelete(scanner)}
                                aria-label={`Delete ${scanner.username}`}
                            >
                                <RiDeleteBin6Line className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                open={!!editScanner}
                onClose={() => setEditScanner(null)}
                title="Edit scanner"
                description={editScanner?.username}
            >
                <div className="flex flex-col gap-4">
                    <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <Input
                        label="New password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        hint="Leave blank to keep the current password"
                        autoComplete="new-password"
                    />
                    <CheckboxList
                        label="Assigned events"
                        items={userEvents}
                        selected={selectedEventIds}
                        onToggle={toggleEvent}
                    />
                    <div className="flex justify-end gap-2 pt-1">
                        <Button variant="ghost" onClick={() => setEditScanner(null)}>Cancel</Button>
                        <Button onClick={handleSave} loading={saving || updating === editScanner?.id}>
                            Save changes
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                open={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                title="Delete scanner?"
                maxWidth="sm"
            >
                <p className="text-sm leading-relaxed text-ink-2">
                    <span className="font-medium text-ink">{confirmDelete?.username}</span> will no
                    longer be able to sign in or check attendees in.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                    <Button
                        variant="danger"
                        loading={updating === confirmDelete?.id}
                        onClick={handleDelete}
                    >
                        Delete scanner
                    </Button>
                </div>
            </Modal>
        </>
    );
}
