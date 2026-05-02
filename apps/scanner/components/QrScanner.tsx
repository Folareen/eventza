'use client';

import { useEffect, useRef } from 'react';
import { RiCameraLine } from 'react-icons/ri';

interface QrScannerProps {
    onScan: (code: string) => void;
    onError?: (message: string) => void;
}

export function QrScanner({ onScan, onError }: QrScannerProps) {
    const instanceRef = useRef<any>(null);
    const firedRef = useRef(false);
    const containerId = 'qr-scanner-viewport';

    useEffect(() => {
        firedRef.current = false;

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
                        if (!firedRef.current) {
                            firedRef.current = true;
                            scanner.stop().catch(() => { }).finally(() => onScan(decoded));
                        }
                    },
                    () => { /* per-frame "no QR" — silence */ }
                );
            } catch (err: any) {
                if (!cancelled) {
                    onError?.(err?.message ?? 'Camera not available');
                }
            }
        })();

        return () => {
            cancelled = true;
            const inst = instanceRef.current;
            if (inst) {
                inst.stop().catch(() => { });
                instanceRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ aspectRatio: '1' }}>
                <div
                    id={containerId}
                    className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover [&>img]:hidden"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[68%] aspect-square">
                        <span className="absolute top-0 left-0 h-7 w-7 rounded-tl-lg border-t-[3px] border-l-[3px] border-white" />
                        <span className="absolute top-0 right-0 h-7 w-7 rounded-tr-lg border-t-[3px] border-r-[3px] border-white" />
                        <span className="absolute bottom-0 left-0 h-7 w-7 rounded-bl-lg border-b-[3px] border-l-[3px] border-white" />
                        <span className="absolute bottom-0 right-0 h-7 w-7 rounded-br-lg border-b-[3px] border-r-[3px] border-white" />
                        <span className="absolute left-2 right-2 top-1/2 h-0.5 -translate-y-1/2 bg-indigo-400/70 animate-pulse" />
                    </div>
                </div>
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                <RiCameraLine className="h-3.5 w-3.5" />
                Point camera at the ticket QR code
            </p>
        </div>
    );
}
