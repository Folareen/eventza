'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    RiCheckLine, RiCloseLine, RiLogoutBoxRLine, RiQrScanLine,
    RiKeyboardLine, RiCameraLine, RiAlertLine, RiErrorWarningLine,
    RiArrowLeftSLine,
} from 'react-icons/ri';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useScannerAuth } from '@/lib/auth-context';
import { useGetEvent, useCheckIn } from '@/lib/queries/scanner';

const QrScanner = dynamic(
    () => import('@/components/QrScanner').then((m) => m.QrScanner),
    {
        ssr: false,
        loading: () => (
            <div className="flex aspect-square w-full items-center justify-center rounded-[var(--radius-panel)] bg-black">
                <Spinner className="text-white/60" />
            </div>
        ),
    },
);

type Mode = 'camera' | 'manual';
type Status = 'success' | 'already' | 'error';

interface CheckInState {
    status: Status;
    message: string;
    name?: string;
}

/** Colour, icon and copy for each outcome. Kept in one place so the
 *  result card can't drift out of sync with itself. */
const RESULT_STYLES: Record<Status, {
    icon: React.ElementType;
    ring: string;
    chip: string;
    text: string;
    label: string;
}> = {
    success: {
        icon: RiCheckLine,
        ring: 'border-success-line bg-success-soft',
        chip: 'bg-success text-white',
        text: 'text-success',
        label: 'Checked in',
    },
    already: {
        icon: RiAlertLine,
        ring: 'border-warning-line bg-warning-soft',
        chip: 'bg-warning text-white',
        text: 'text-warning',
        label: 'Already checked in',
    },
    error: {
        icon: RiErrorWarningLine,
        ring: 'border-danger-line bg-danger-soft',
        chip: 'bg-danger text-white',
        text: 'text-danger',
        label: 'Not valid',
    },
};

function EventOption({
    eventId, selected, onSelect,
}: { eventId: number; selected: boolean; onSelect: (id: number) => void }) {
    const { data } = useGetEvent(eventId);
    const event = data?.event;

    return (
        <button
            type="button"
            onClick={() => onSelect(eventId)}
            className={cn(
                'flex w-full items-center gap-3 rounded-[var(--radius-card)] border px-4 py-3.5 text-left',
                'transition-[border-color,background-color] duration-150 cursor-pointer active:scale-[.99]',
                selected
                    ? 'border-accent bg-accent-soft'
                    : 'border-line bg-surface hover:border-ink-4',
            )}
        >
            <span
                className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    selected ? 'border-accent bg-accent' : 'border-line-strong',
                )}
            >
                {selected && <RiCheckLine className="h-3 w-3 text-white" />}
            </span>
            {event ? (
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{event.title}</span>
                    <span className="mt-0.5 block truncate text-[12px] text-ink-4">
                        {event.venue} ·{' '}
                        {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                        })}
                    </span>
                </span>
            ) : (
                <span className="h-9 flex-1 animate-pulse rounded bg-surface-2" />
            )}
        </button>
    );
}

function EventHeader({ eventId }: { eventId: number }) {
    const { data } = useGetEvent(eventId);
    const event = data?.event;
    if (!event) return null;
    return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface px-4 py-3">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-4">
                Checking in for
            </p>
            <p className="mt-1 truncate font-display text-[19px] leading-tight text-ink">
                {event.title}
            </p>
        </div>
    );
}

export default function ScanPage() {
    const router = useRouter();
    const { scanner, isLoading, logout } = useScannerAuth();
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
    const [mode, setMode] = useState<Mode>('camera');
    const [manualCode, setManualCode] = useState('');
    const [result, setResult] = useState<CheckInState | null>(null);
    const [cameraKey, setCameraKey] = useState(0);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [scanCount, setScanCount] = useState(0);
    const { mutateAsync: checkIn, isPending: checking } = useCheckIn(selectedEvent);

    useEffect(() => {
        if (!isLoading && !scanner) router.replace('/');
    }, [isLoading, scanner, router]);

    useEffect(() => {
        if (scanner?.eventIds?.length === 1) setSelectedEvent(scanner.eventIds[0]);
    }, [scanner]);

    const processCode = useCallback(async (code: string) => {
        if (!selectedEvent || !code.trim()) return;
        setResult(null);
        try {
            const res = await checkIn(code.trim());
            if (res.order.checkedIn) {
                setResult({ status: 'success', message: 'Checked in', name: res.order.name });
                setScanCount((n) => n + 1);
                navigator.vibrate?.([30, 50, 30]);
            } else {
                setResult({ status: 'error', message: res.message });
            }
        } catch (err: any) {
            const msg: string = err?.message ?? 'Check-in failed';
            const lower = msg.toLowerCase();
            if (lower.includes('already')) {
                setResult({ status: 'already', message: 'This ticket was already used' });
            } else if (lower.includes('not found') || lower.includes('invalid')) {
                setResult({ status: 'error', message: 'Ticket not found for this event' });
            } else {
                setResult({ status: 'error', message: msg });
            }
            navigator.vibrate?.(200);
        }
        setManualCode('');
    }, [selectedEvent, checkIn]);

    const handleScanAgain = () => {
        setResult(null);
        if (mode === 'camera') setCameraKey((k) => k + 1);
    };

    const switchMode = (next: Mode) => {
        setMode(next);
        setResult(null);
        setCameraError(null);
        if (next === 'camera') setCameraKey((k) => k + 1);
    };

    if (isLoading || !scanner) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-paper">
                <Spinner size="lg" className="text-accent" />
            </div>
        );
    }

    const multipleEvents = (scanner.eventIds?.length ?? 0) > 1;

    return (
        <div className="flex min-h-screen flex-col bg-paper">
            <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur-md">
                <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <RiQrScanLine className="h-[18px] w-[18px] text-accent" />
                        <span className="font-display text-[19px] leading-none text-ink">eventza</span>
                        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-4">
                            scanner
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {scanCount > 0 && (
                            <span className="rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success">
                                {scanCount} in
                            </span>
                        )}
                        <span className="hidden text-[12px] text-ink-4 sm:inline">{scanner.username}</span>
                        <button
                            onClick={() => { logout(); router.replace('/'); }}
                            aria-label="Sign out"
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[var(--radius-control)] text-ink-4 transition-colors hover:bg-surface-2 hover:text-ink"
                        >
                            <RiLogoutBoxRLine className="h-[18px] w-[18px]" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-5">
                {multipleEvents && !selectedEvent && (
                    <div className="flex flex-col gap-3 animate-rise">
                        <h1 className="font-display text-[24px] leading-tight text-ink">
                            Which event?
                        </h1>
                        <div className="flex flex-col gap-2">
                            {scanner.eventIds!.map((id: number) => (
                                <EventOption
                                    key={id}
                                    eventId={id}
                                    selected={selectedEvent === id}
                                    onSelect={setSelectedEvent}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {selectedEvent && (
                    <>
                        <div className="flex items-center gap-2">
                            {multipleEvents && (
                                <button
                                    onClick={() => { setSelectedEvent(null); setResult(null); }}
                                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-control)] border border-line bg-surface text-ink-3 transition-colors hover:bg-surface-2"
                                    aria-label="Change event"
                                >
                                    <RiArrowLeftSLine className="h-5 w-5" />
                                </button>
                            )}
                            <div className="min-w-0 flex-1">
                                <EventHeader eventId={selectedEvent} />
                            </div>
                        </div>

                        {result ? (
                            <ResultCard result={result} onNext={handleScanAgain} />
                        ) : (
                            <>
                                <div className="flex gap-1 rounded-[var(--radius-control)] bg-surface-2 p-1">
                                    {([
                                        { key: 'camera', label: 'Camera', icon: RiCameraLine },
                                        { key: 'manual', label: 'Manual', icon: RiKeyboardLine },
                                    ] as const).map(({ key, label, icon: Icon }) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => switchMode(key)}
                                            className={cn(
                                                'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[6px] py-2.5',
                                                'text-[13px] font-medium transition-colors',
                                                mode === key
                                                    ? 'bg-surface text-ink shadow-sm'
                                                    : 'text-ink-3 hover:text-ink',
                                            )}
                                        >
                                            <Icon className="h-4 w-4" /> {label}
                                        </button>
                                    ))}
                                </div>

                                {mode === 'camera' && (
                                    cameraError ? (
                                        <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-warning-line bg-warning-soft p-4">
                                            <RiAlertLine className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                                            <div>
                                                <p className="text-sm font-medium text-ink">Camera unavailable</p>
                                                <p className="mt-0.5 text-[12px] leading-relaxed text-ink-3">
                                                    {cameraError}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => switchMode('manual')}
                                                    className="mt-2.5 cursor-pointer text-[13px] font-medium text-warning underline underline-offset-2"
                                                >
                                                    Enter codes manually
                                                </button>
                                            </div>
                                        </div>
                                    ) : checking ? (
                                        <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-[var(--radius-panel)] bg-black">
                                            <Spinner className="text-white/70" />
                                            <p className="text-[13px] text-white/60">Checking in…</p>
                                        </div>
                                    ) : (
                                        <QrScanner
                                            key={cameraKey}
                                            onScan={processCode}
                                            onError={setCameraError}
                                        />
                                    )
                                )}

                                {mode === 'manual' && (
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); processCode(manualCode); }}
                                        className="flex flex-col gap-3"
                                    >
                                        <Input
                                            label="Ticket code"
                                            value={manualCode}
                                            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                            placeholder="Type or paste the code"
                                            className="text-center font-mono tracking-[0.15em]"
                                            autoFocus
                                            autoComplete="off"
                                            autoCapitalize="characters"
                                            autoCorrect="off"
                                        />
                                        <Button
                                            type="submit"
                                            size="lg"
                                            loading={checking}
                                            disabled={!manualCode.trim()}
                                            className="w-full"
                                        >
                                            <RiQrScanLine className="h-5 w-5" /> Check in
                                        </Button>
                                    </form>
                                )}
                            </>
                        )}
                    </>
                )}

                {multipleEvents && !selectedEvent && (
                    <p className="mt-2 text-center text-[13px] text-ink-4">
                        Pick an event to start scanning.
                    </p>
                )}
            </main>
        </div>
    );
}

function ResultCard({ result, onNext }: { result: CheckInState; onNext: () => void }) {
    const style = RESULT_STYLES[result.status];
    const Icon = style.icon;

    // Enter advances to the next ticket without reaching for the button.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter') onNext(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onNext]);

    return (
        <div className="flex flex-col gap-3">
            <div
                className={cn(
                    'animate-result flex flex-col items-center gap-4 rounded-[var(--radius-panel)] border px-6 py-10 text-center',
                    style.ring,
                )}
                role="status"
                aria-live="assertive"
            >
                <span className={cn('flex h-16 w-16 animate-pop items-center justify-center rounded-full', style.chip)}>
                    <Icon className="h-9 w-9" />
                </span>
                <div>
                    <p className={cn('font-display text-[26px] leading-tight', style.text)}>
                        {style.label}
                    </p>
                    {result.name && (
                        <p className="mt-1.5 text-[17px] font-medium text-ink">{result.name}</p>
                    )}
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">{result.message}</p>
                </div>
            </div>

            <Button size="lg" className="w-full" onClick={onNext} autoFocus>
                Scan next ticket
            </Button>
        </div>
    );
}
