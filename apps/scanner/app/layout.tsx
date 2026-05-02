import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ScannerAuthProvider } from '@/lib/auth-context';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
    title: 'Eventza Scanner',
    description: 'Event check-in scanner',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={geist.variable}>
            <body className="font-sans bg-white text-zinc-900 min-h-screen">
                <QueryProvider>
                    <ScannerAuthProvider>
                        {children}
                        <Toaster position="top-center" />
                    </ScannerAuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
