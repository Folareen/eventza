import type { Metadata, Viewport } from 'next';
import { Geist, Instrument_Serif } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ScannerAuthProvider } from '@/lib/auth-context';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const display = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-display' });

export const metadata: Metadata = {
    title: 'eventza scanner',
    description: 'Event check-in scanner',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    // Prevents iOS zooming on input focus mid-queue.
    maximumScale: 1,
    themeColor: '#171614',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${geist.variable} ${display.variable}`}>
            <body className="min-h-screen bg-paper text-ink antialiased">
                <QueryProvider>
                    <ScannerAuthProvider>
                        {children}
                        <Toaster
                            position="top-center"
                            toastOptions={{
                                duration: 2500,
                                className:
                                    '!bg-surface !text-ink !border !border-line !shadow-lg !rounded-[var(--radius-control)] !text-sm !font-medium',
                            }}
                        />
                    </ScannerAuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
