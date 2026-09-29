interface QA {
    q: string;
    a: string;
}

const DEFAULT_ITEMS: QA[] = [
    {
        q: 'When do I get paid?',
        a: 'Ticket money goes to your own Stripe account on Stripe’s normal payout schedule. eventza never holds your balance, so there is nothing to request or withdraw.',
    },
    {
        q: 'Do I need the scanner app?',
        a: 'Only if you want to check people in at the door. It runs in a phone browser, so there is nothing to install from an app store.',
    },
    {
        q: 'Can I run a free event?',
        a: 'Yes. Set a ticket price of zero and guests still get a QR code by email. Free tickets carry no platform fee.',
    },
    {
        q: 'What happens if someone forwards their ticket?',
        a: 'Each QR code can only be scanned once. The second attempt is rejected and the scanner shows that the code has already been used.',
    },
    {
        q: 'Can I edit an event after it is published?',
        a: 'Yes. Details, tickets, and capacity stay editable from the dashboard while the event is live.',
    },
    {
        q: 'Can other people help me on the door?',
        a: 'Create a scanner account for each staff member. They can scan tickets but cannot see revenue or change the event.',
    },
];

/** Accordion built on native details/summary, so it works without JS. */
export function Faq({ items = DEFAULT_ITEMS, title = 'Questions people ask first' }: {
    items?: QA[];
    title?: string;
}) {
    return (
        <section className="border-b border-line bg-surface">
            <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-20">
                <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-text">
                            FAQ
                        </p>
                        <h2 className="mt-3 font-display text-[32px] leading-tight text-ink sm:text-[38px]">
                            {title}
                        </h2>
                    </div>

                    <div className="border-t border-line">
                        {items.map(({ q, a }) => (
                            <details key={q} className="group border-b border-line">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[16px] font-medium text-ink transition-colors hover:text-accent-text [&::-webkit-details-marker]:hidden">
                                    {q}
                                    <span
                                        aria-hidden
                                        className="relative h-4 w-4 shrink-0 text-ink-4 before:absolute before:left-0 before:top-1/2 before:h-px before:w-4 before:-translate-y-1/2 before:bg-current after:absolute after:left-1/2 after:top-0 after:h-4 after:w-px after:-translate-x-1/2 after:bg-current after:transition-transform group-open:after:scale-y-0"
                                    />
                                </summary>
                                <p className="pb-5 pr-8 text-[15px] leading-relaxed text-ink-3">{a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
