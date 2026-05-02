'use client';

import { useState } from 'react';
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import type { Scanner } from '@/lib/types';

interface ScannersTableProps {
    scanners: Scanner[];
    userEvents: { id: number; title: string }[];
    onUpdate: (scannerId: number, data: { username?: string; password?: string; eventIds?: number[] }) => Promise<void>;
    onDelete: (scannerId: number) => Promise<void>;
    updating?: number | null;
}

export function ScannersTable({ scanners, userEvents, onUpdate, onDelete, updating }: ScannersTableProps) {
    const [editScanner, setEditScanner] = useState<Scanner | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);

    const openEdit = (s: Scanner) => {
        setEditScanner(s);
        setUsername(s.username);
        setPassword('');
        setSelectedEventIds(s.events?.map((e) => e.id) ?? []);
    };

    const toggleEvent = (id: number) =>
        setSelectedEventIds((ids) => ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]);

    const handleSave = async () => {
        if (!editScanner) return;
        const data: { username?: string; password?: string; eventIds?: number[] } = { eventIds: selectedEventIds };
        if (username !== editScanner.username) data.username = username;
        if (password) data.password = password;
        await onUpdate(editScanner.id, data);
        setEditScanner(null);
    };

    if (scanners.length === 0) {
        return (
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 py-12 text-center text-sm text-zinc-400">
                No scanners yet.
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-sm">
                    <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Username</th>
                            <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Assigned events</th>
                            <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                        {scanners.map((scanner) => (
                            <tr key={scanner.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{scanner.username}</td>
                                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                                    {scanner.events?.length
                                        ? scanner.events.map((e) => e.title).join(', ')
                                        : <span className="text-zinc-400">None assigned</span>
                                    }
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => openEdit(scanner)} className="h-8 w-8 p-0">
                                            <RiEditLine className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" loading={updating === scanner.id} onClick={() => onDelete(scanner.id)} className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                            <RiDeleteBinLine className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal open={!!editScanner} onClose={() => setEditScanner(null)} title="Edit Scanner">
                <div className="flex flex-col gap-4">
                    <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} hint="Leave blank to keep current password" />
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Assigned events</label>
                        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto rounded border border-zinc-200 dark:border-zinc-800 p-2">
                            {userEvents.map((event) => (
                                <label key={event.id} className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer text-sm text-zinc-700 dark:text-zinc-300">
                                    <input
                                        type="checkbox"
                                        checked={selectedEventIds.includes(event.id)}
                                        onChange={() => toggleEvent(event.id)}
                                        className="rounded"
                                    />
                                    {event.title}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button variant="ghost" onClick={() => setEditScanner(null)}>Cancel</Button>
                        <Button onClick={handleSave} loading={updating === editScanner?.id}>Save changes</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
