import { RiSearchLine, RiBankCardLine, RiQrScanLine } from 'react-icons/ri';

const STEPS = [
    {
        icon: RiSearchLine,
        title: 'Find something on',
        body: 'Filter by city, date, or category until the list is only events you would actually go to.',
    },
    {
        icon: RiBankCardLine,
        title: 'Book in a minute',
        body: 'Pick a ticket type, pay with card, and your QR code lands in your inbox straight away.',
    },
    {
        icon: RiQrScanLine,
        title: 'Walk in',
        body: 'Show the code at the door. The organiser scans it once and you are checked in.',
    },
];

/** Three-step explainer for first-time visitors who have not booked yet. */
export function HowItWorks() {
    return (
        <section className="border-b border-line bg-paper">
            <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-20">
                <div className="max-w-lg">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-text">
                        For attendees
                    </p>
                    <h2 className="mt-3 font-display text-[32px] leading-tight text-ink sm:text-[38px]">
                        Three steps, no account gymnastics
                    </h2>
                </div>

                <ol className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-6">
                    {STEPS.map(({ icon: Icon, title, body }, i) => (
                        <li key={title} className="relative">
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-ink-2">
                                    <Icon className="h-[18px] w-[18px]" />
                                </span>
                                <span className="font-mono text-[12px] text-ink-4">
                                    0{i + 1}
                                </span>
                            </div>
                            <h3 className="mt-5 font-display text-[21px] text-ink">{title}</h3>
                            <p className="mt-2 text-[15px] leading-relaxed text-ink-3">{body}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
