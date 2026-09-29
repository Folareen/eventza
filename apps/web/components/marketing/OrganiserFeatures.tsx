import Link from 'next/link';
import {
    RiArrowRightLine, RiTicket2Line, RiQrScanLine, RiLineChartLine,
    RiBankCardLine, RiTeamLine, RiMailSendLine,
} from 'react-icons/ri';

const FEATURES = [
    {
        icon: RiTicket2Line,
        title: 'Tiered tickets',
        body: 'Early bird, general, VIP, free RSVPs. Each tier gets its own price, quantity, and sales window.',
    },
    {
        icon: RiBankCardLine,
        title: 'Payouts to your own account',
        body: 'Connect Stripe once. Ticket money settles into your bank account, not into a balance you have to withdraw.',
    },
    {
        icon: RiQrScanLine,
        title: 'Door scanning',
        body: 'A separate scanner app checks QR codes against the guest list and rejects duplicates on the spot.',
    },
    {
        icon: RiTeamLine,
        title: 'Scanner accounts',
        body: 'Give door staff their own logins. They can scan tickets without seeing your revenue or editing the event.',
    },
    {
        icon: RiLineChartLine,
        title: 'Sales analytics',
        body: 'Revenue by day, sales per ticket tier, capacity used, and how many of your guests actually turned up.',
    },
    {
        icon: RiMailSendLine,
        title: 'Automatic ticket delivery',
        body: 'Buyers get their QR code by email the moment payment clears. Nothing for you to send manually.',
    },
];

/** Feature grid for the organiser side of the product. */
export function OrganiserFeatures() {
    return (
        <section className="border-b border-line bg-surface">
            <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-20">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div className="max-w-lg">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-text">
                            For organisers
                        </p>
                        <h2 className="mt-3 font-display text-[32px] leading-tight text-ink sm:text-[38px]">
                            Everything between publishing and the door
                        </h2>
                    </div>
                    <Link
                        href="/host"
                        className="inline-flex items-center gap-1.5 text-[14px] font-medium text-accent-text transition-opacity hover:opacity-70"
                    >
                        See how hosting works <RiArrowRightLine className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map(({ icon: Icon, title, body }) => (
                        <div key={title} className="bg-surface p-7">
                            <Icon className="h-5 w-5 text-accent-text" />
                            <h3 className="mt-4 text-[16px] font-semibold text-ink">{title}</h3>
                            <p className="mt-2 text-[14px] leading-relaxed text-ink-3">{body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
