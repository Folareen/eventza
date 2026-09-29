'use client';

import { useEffect, useRef } from 'react';

interface QrScannerProps {
    onScan: (code: string) => void;
    onError?: (message: string) => void;
}

export function QrScanner({ onScan, onError }: QrScannerProps) {
    const instanceRef = useRef<any>(null);
    const firedRef = useRef(false);
    const stoppingRef = useRef(false);
    const containerId = 'qr-scanner-viewport';

    useEffect(() => {
        firedRef.current = false;
        stoppingRef.current = false;
        let cancelled = false;

        (async () => {
            try {
                const { Html5Qrcode } = await import('html5-qrcode');
                if (cancelled) return;

                const scanner = new Html5Qrcode(containerId);
                instanceRef.current = scanner;

                await scanner.start(
                    { facingMode: 'environment' },
                    {
                        fps: 12,
                        qrbox: (w: number, h: number) => {
                            const side = Math.floor(Math.min(w, h) * 0.72);
                            return { width: side, height: side };
                        },
                        aspectRatio: 1,
                    },
                    (decoded: string) => {
                        if (firedRef.current || stoppingRef.current) return;
                        firedRef.current = true;
                        stoppingRef.current = true;
                        // Short haptic confirms the read before the network call.
                        navigator.vibrate?.(40);
                        scanner.stop().catch(() => {}).finally(() => onScan(decoded));
                    },
                    () => {},
                );
            } catch (err: any) {
                if (!cancelled) onError?.(err?.message ?? 'Camera not available');
            }
        })();

        return () => {
            cancelled = true;
            if (!stoppingRef.current) {
                stoppingRef.current = true;
                instanceRef.current?.stop().catch(() => {});
                instanceRef.current = null;
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-panel)] bg-black">
                <div
                    id={containerId}
                    className="h-full w-full [&>img]:hidden [&>video]:h-full [&>video]:w-full [&>video]:object-cover"
                />

                {/* Dim everything outside the reticle so the eye goes to it. */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="absolute left-1/2 top-1/2 aspect-square w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[18px] bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,.45)]" />

                    <div className="absolute left-1/2 top-1/2 aspect-square w-[72%] -translate-x-1/2 -translate-y-1/2">
                        {[
                            'top-0 left-0 rounded-tl-[14px] border-t-[3px] border-l-[3px]',
                            'top-0 right-0 rounded-tr-[14px] border-t-[3px] border-r-[3px]',
                            'bottom-0 left-0 rounded-bl-[14px] border-b-[3px] border-l-[3px]',
                            'bottom-0 right-0 rounded-br-[14px] border-b-[3px] border-r-[3px]',
                        ].map((pos) => (
                            <span key={pos} className={`absolute h-8 w-8 border-accent ${pos}`} />
                        ))}
                        <span className="animate-laser absolute left-3 right-3 h-0.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
                    </div>
                </div>
            </div>

            <p className="text-[13px] text-ink-3">Point the camera at the ticket QR code</p>
        </div>
    );
}
