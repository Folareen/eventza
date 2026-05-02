'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { RiCheckLine, RiCloseLine, RiLogoutBoxRLine, RiQrCodeLine } from 'react-icons/ri';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useScannerAuth } from '@/lib/auth-context';
import { useGetEvent, useCheckIn } from '@/lib/queries/scanner';

interface CheckInState {
    status: 'success' | 'error' | 'already';
    message: string;
    name?: string;
}

function EventOption({ eventId, selected, onSelect }: { eventId: number; selected: boolean; onSelect: (id: number) => void }) {
    const { data } = useGetEvent(eventId);
    const event = data?.event;
    return (
        <button
            type="button"
            onClick={() => onSelect(eventId)}
            className={`text-left rounded-lg border px-4 py-3 transition-colors ${selected ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400'}`}
        >
            {event ? (
                <div>
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className={`text-xs mt-0.5 ${selected ? 'text-zinc-300' : 'text-zinc-500'}`}>{event.venue} &bull; {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
            ) : (
                <span className="text-sm text-zinc-400">Loading event {eventId}…</span>
            )}
        </button>
    );
}

function SelectedEventLabel({ eventId }: { eventId: number }) {
    const { data } = useGetEvent(eventId);
    const event = data?.event;
    if (!event) return null;
    return (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
            <p className="text-xs text-zinc-500">Selected event</p>
            <p className="font-medium text-sm text-zinc-900 mt-0.5">{event.title}</p>
        </div>
    );
}

export default function ScanPage() {
    const router = useRouter();
    const { scanner, isLoading, logout } = useScannerAuth();
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
    const [code, setCode] = useState('');
    const [result, setResult] = useState<CheckInState | null>(null);
    const { mutateAsync: checkIn, isPending: checking } = useCheckIn(selectedEvent);

    useEffect(() => {
        if (!isLoading && !scanner) router.replace('/');
    }, [isLoading, scanner, router]);

    useEffect(() => {
        if (scanner?.eventIds?.length === 1) setSelectedEvent(scanner.eventIds[0]);
    }, [scanner]);

    const handleCheckIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent || !code.trim()) return;
        setResult(null);
        try {
            const res = await checkIn(code.trim());
            if (res.order.checkedIn) {
                setResult({ status: 'success', message: 'Check-in successful', name: res.order.name });
                toast.success(`Checked in: ${res.order.name}`);
            } else {
                setResult({ status: 'error', message: res.message });
            }
            setCode('');
        } catch (err: any) {
            const msg = err?.message ?? 'Check-in failed';
            if (msg.toLowerCase().includes('already')) {
                setResult({ status: 'already', message: 'Already checked in' });
            } else if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('invalid')) {
                setResult({ status: 'error', message: 'Ticket not found' });
            } else {
                setResult({ status: 'error', message: msg });
            }
            setCode('');
        }
    };

    if (isLoading || !scanner) {
        return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <header className="bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
                <div>
                    <span className="font-bold text-zinc-900 text-sm">eventza</span>
                    <span className="text-xs text-zinc-400 ml-2">scanner</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">{scanner.username}</span>
                    <button onClick={() => { logout(); router.replace('/'); }} className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500" title="Sign out">
                        <RiLogoutBoxRLine className="h-4 w-4" />
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center px-4 py-8">
                <div className="w-full max-w-sm flex flex-col gap-6">
                    {(scanner.eventIds?.length ?? 0) > 1 && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-zinc-700">Select event</p>
                            <div className="flex flex-col gap-1">
                                {scanner.eventIds!.map((id: number) => (
                                    <EventOption key={id} eventId={id} selected={selectedEvent === id} onSelect={setSelectedEvent} />
                                ))}
                            </div>
                        </div>
                    )}

                    {(scanner.eventIds?.length ?? 0) === 1 && selectedEvent && <SelectedEventLabel eventId={selectedEvent} />}

                    {selectedEvent ? (
                        <form onSubmit={handleCheckIn} className="flex flex-col gap-3">
                            <Input
                                label="Ticket code"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="XXXX-XXXX-XXXX"
                                className="font-mono text-center tracking-widest text-base"
                                autoFocus
                                autoComplete="off"
                                autoCapitalize="characters"
                            />
                            <Button type="submit" size="lg" loading={checking} className="w-full flex items-center justify-center gap-2">
                                <RiQrCodeLine className="h-5 w-5" /> Check in
                            </Button>
                        </form>
                    ) : (
                        <p className="text-sm text-zinc-400 text-center">Select an event above to start scanning</p>
                    )}

                    {result && (
                        <div className={`rounded-xl border p-5 flex items-start gap-3 ${result.status === 'success' ? 'border-green-300 bg-green-50' : result.status === 'already' ? 'border-amber-300 bg-amber-50' : 'border-red-300 bg-red-50'}`}>
                            <div className={`mt-0.5 rounded-full p-1 ${result.status === 'success' ? 'bg-green-200' : result.status === 'already' ? 'bg-amber-200' : 'bg-red-200'}`}>
                                {result.status === 'success' ? <RiCheckLine className="h-4 w-4 text-green-700" /> : <RiCloseLine className="h-4 w-4 text-red-700" />}
                            </div>
                            <div>
                                <p className={`font-semibold text-sm ${result.status === 'success' ? 'text-green-800' : result.status === 'already' ? 'text-amber-800' : 'text-red-800'}`}>{result.message}</p>
                                {result.name && <p className="text-sm text-green-700 mt-0.5">{result.name}</p>}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function EventSelector({
    eventIds,
    selected,
    onSelect,
}: {
    eventIds: number[];
    selected: number | null;
    onSelect: (id: number) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-700">Select event</p>
            <div className="flex flex-col gap-1">
                {eventIds.map((id) => (
                    <EventOption key={id} eventId={id} selected={selected === id} onSelect={onSelect} />
                ))}
            </div>
        </div>
    );
}

