import { Navbar } from '@/components/layout/Navbar';
import { UnverifiedBanner } from '@/components/layout/UnverifiedBanner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <UnverifiedBanner />
            <div className="flex-1 flex flex-col">{children}</div>
        </div>
    );
}
