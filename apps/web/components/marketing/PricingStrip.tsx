import Link from 'next/link';
import { RiCheckLine } from 'react-icons/ri';

const INCLUDED = [
    'Unlimited events and ticket tiers',
    'Free tickets cost you nothing',
    'QR check-in and scanner accounts',
    'Analytics on every event',
];

/** Compact pricing summary. The full breakdown lives on /pricing. */
export function PricingStrip() {
    return (
        <section className="border-b border-line bg-paper">
            <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-20">
                <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-text">
                            Pricing
                        </p>
                        <h2 className="mt-3 font-display text-[32px] leading-tight text-ink sm:text-[38px]">
                            One number, no monthly bill
                        </h2>
                        <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-3">
                            eventza takes 5% of each paid ticket, charged at checkout. There is no
                            subscription, no listing fee, and nothing to pay on a month where you
                            sell nothing.
                        </p>
                        <Link
                            href="/pricing"
                            className="mt-6 inline-flex text-[14px] font-medium text-accent-text transition-opacity hover:opacity-70"
                        >
                            Full pricing details
                        </Link>
                    </div>

                    <div className="rounded-[var(--radius-panel)] border border-line-strong bg-surface p-8 shadow-sm sm:p-10">
                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-[56px] leading-none text-ink">5%</span>
                            <span className="text-[15px] text-ink-3">per paid ticket</span>
                        </div>
                        <p className="mt-2 text-[13px] text-ink-4">
                            Plus Stripe&apos;s own card processing fee, which they charge directly.
                        </p>
                        <ul className="mt-7 flex flex-col gap-3 border-t border-line pt-7">
                            {INCLUDED.map((item) => (
                                <li key={item} className="flex items-start gap-2.5 text-[14px] text-ink-2">
                                    <RiCheckLine className="mt-0.5 h-4 w-4 shrink-0 text-accent-text" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
