import Link from 'next/link';
import type { Metadata } from 'next';
import { RiArrowRightLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';
import { Footer } from '@/components/layout/Footer';
import { Faq } from '@/components/marketing/Faq';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
    title: 'Pricing',
    description:
        'eventza charges 5% of each paid ticket. No subscription, no listing fee, and free tickets cost nothing.',
};

const INCLUDED = [
    'Unlimited events',
    'Unlimited ticket tiers per event',
    'Free tickets at no charge',
    'QR codes emailed to buyers',
    'Door check-in through the scanner app',
    'Scanner accounts for door staff',
    'Revenue and check-in analytics',
    'Payouts to your own Stripe account',
];

const NOT_CHARGED = [
    'Monthly or annual subscription',
    'Fee for listing an event',
    'Charge for adding team members',
    'Minimum sales commitment',
];

/** Worked example at a few common ticket prices. Figures are the platform
 *  fee only; Stripe bills its processing fee separately. */
const EXAMPLES = [
    { price: 10, sold: 50 },
    { price: 25, sold: 120 },
    { price: 75, sold: 300 },
];

const money = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function PricingPage() {
    return (
        <main className="flex flex-1 flex-col">
            <section className="border-b border-line bg-surface">
                <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-24">
                    <div className="max-w-2xl animate-rise">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-text">
                            Pricing
                        </p>
                        <h1 className="mt-4 font-display text-[42px] leading-[1.06] tracking-tight text-ink sm:text-[56px]">
                            5% of each paid ticket. That is the whole price list.
                        </h1>
                        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-3">
                            The fee comes out at checkout, so there is no invoice to settle later.
                            Free tickets are free to issue, and a month with no sales costs you
                            nothing at all.
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-b border-line bg-paper">
                <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-20">
                    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
                        <div className="rounded-[var(--radius-panel)] border border-line-strong bg-surface p-8 shadow-sm sm:p-10">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-text">
                                What you pay
                            </p>
                            <div className="mt-5 flex items-baseline gap-2">
                                <span className="font-display text-[64px] leading-none text-ink">5%</span>
                                <span className="text-[15px] text-ink-3">per paid ticket</span>
                            </div>
                            <p className="mt-4 text-[14px] leading-relaxed text-ink-3">
                                Stripe charges its own card processing fee on top, billed by Stripe
                                directly against your account. eventza does not add anything to it.
                            </p>
                            <div className="mt-8">
                                <Button size="lg" asChild>
                                    <Link href="/auth/register">
                                        Start hosting <RiArrowRightLine className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-8 sm:p-10">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-4">
                                Included
                            </p>
                            <ul className="mt-5 flex flex-col gap-3">
                                {INCLUDED.map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-[14px] text-ink-2">
                                        <RiCheckLine className="mt-0.5 h-4 w-4 shrink-0 text-accent-text" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <p className="mt-8 border-t border-line pt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-4">
                                Never charged
                            </p>
                            <ul className="mt-5 flex flex-col gap-3">
                                {NOT_CHARGED.map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-[14px] text-ink-4">
                                        <RiCloseLine className="mt-0.5 h-4 w-4 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-line bg-surface">
                <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-20">
                    <div className="max-w-lg">
                        <h2 className="font-display text-[32px] leading-tight text-ink sm:text-[38px]">
                            What that looks like in practice
                        </h2>
                        <p className="mt-4 text-[15px] leading-relaxed text-ink-3">
                            A few worked examples. Platform fee only, before Stripe&apos;s
                            processing fee.
                        </p>
                    </div>

                    <div className="mt-10 overflow-x-auto rounded-[var(--radius-panel)] border border-line">
                        <table className="w-full min-w-[520px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-line bg-surface-2">
                                    {['Ticket price', 'Tickets sold', 'Gross sales', 'eventza fee', 'You keep'].map((h) => (
                                        <th
                                            key={h}
                                            className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-4"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {EXAMPLES.map(({ price, sold }) => {
                                    const gross = price * sold;
                                    const fee = gross * 0.05;
                                    return (
                                        <tr key={price} className="border-b border-line last:border-0 bg-surface">
                                            <td className="px-5 py-4 text-[14px] text-ink-2">{money(price)}</td>
                                            <td className="px-5 py-4 text-[14px] text-ink-2">{sold}</td>
                                            <td className="px-5 py-4 text-[14px] text-ink-2">{money(gross)}</td>
                                            <td className="px-5 py-4 text-[14px] text-ink-3">{money(fee)}</td>
                                            <td className="px-5 py-4 text-[14px] font-semibold text-ink">
                                                {money(gross - fee)}
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr className="bg-surface-2">
                                    <td className="px-5 py-4 text-[14px] text-ink-2">Free</td>
                                    <td className="px-5 py-4 text-[14px] text-ink-2">Any number</td>
                                    <td className="px-5 py-4 text-[14px] text-ink-3">{money(0)}</td>
                                    <td className="px-5 py-4 text-[14px] text-ink-3">{money(0)}</td>
                                    <td className="px-5 py-4 text-[14px] font-semibold text-ink">{money(0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <Faq
                title="Pricing questions"
                items={[
                    {
                        q: 'Who pays the 5%, me or the buyer?',
                        a: 'It is deducted from the ticket price you set, so the buyer pays exactly the amount shown on the listing.',
                    },
                    {
                        q: 'What is Stripe’s fee?',
                        a: 'Stripe sets its own card processing rate by country and card type, and bills it against your Stripe account. Their current rates are published on stripe.com.',
                    },
                    {
                        q: 'Do free tickets cost anything?',
                        a: 'No. There is no card payment to process, so no fee is charged on either side.',
                    },
                    {
                        q: 'When is the fee taken?',
                        a: 'At the moment of purchase. The remainder is transferred to your Stripe account, so you are never invoiced afterwards.',
                    },
                    {
                        q: 'What happens if I refund a ticket?',
                        a: 'You issue the refund from your Stripe dashboard. Stripe’s refund handling applies to the payment as a whole.',
                    },
                ]}
            />

            <section className="bg-surface">
                <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6">
                    <div className="grain relative overflow-hidden rounded-[var(--radius-panel)] bg-ink px-8 py-14 text-center sm:px-16">
                        <h2 className="mx-auto max-w-xl font-display text-[34px] leading-[1.12] text-paper sm:text-[42px]">
                            Nothing to pay until you sell
                        </h2>
                        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-paper/65">
                            Set up an account, build your event, and see the whole dashboard before
                            a single ticket goes on sale.
                        </p>
                        <div className="mt-9 flex flex-wrap justify-center gap-3">
                            <Link
                                href="/auth/register"
                                className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-control)] bg-accent px-6 text-[15px] font-medium text-white transition-colors hover:bg-accent-hover"
                            >
                                Get started free <RiArrowRightLine className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/host"
                                className="inline-flex h-12 items-center rounded-[var(--radius-control)] border border-paper/25 px-6 text-[15px] font-medium text-paper transition-colors hover:bg-paper/10"
                            >
                                How hosting works
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
