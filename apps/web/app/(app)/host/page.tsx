import Link from 'next/link';
import type { Metadata } from 'next';
import {
    RiArrowRightLine, RiCalendarEventLine, RiPriceTag3Line,
    RiBankLine, RiQrScanLine, RiLineChartLine,
} from 'react-icons/ri';
import { Footer } from '@/components/layout/Footer';
import { OrganiserFeatures } from '@/components/marketing/OrganiserFeatures';
import { Faq } from '@/components/marketing/Faq';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
    title: 'Host an event',
    description:
        'Publish an event, sell tickets, and check guests in at the door. eventza takes 5% of each paid ticket and nothing else.',
};

const STEPS = [
    {
        icon: RiCalendarEventLine,
        title: 'Create the event',
        body: 'Title, description, banner, venue, date, and capacity. It goes live on the discover page as soon as you publish.',
    },
    {
        icon: RiPriceTag3Line,
        title: 'Add your ticket tiers',
        body: 'One tier or several. Set a price and a quantity for each, or leave the price at zero for a free RSVP.',
    },
    {
        icon: RiBankLine,
        title: 'Connect Stripe',
        body: 'A one-time onboarding flow that verifies your details. After that, ticket money settles into your own bank account.',
    },
    {
        icon: RiQrScanLine,
        title: 'Scan people in',
        body: 'Open the scanner app on the day, sign in, and point a camera at each QR code. Used codes are rejected automatically.',
    },
    {
        icon: RiLineChartLine,
        title: 'Read the numbers',
        body: 'After the event, check revenue by day, sales per tier, and what share of your ticket holders actually showed up.',
    },
];

const HOST_FAQ = [
    {
        q: 'What do I need before I start?',
        a: 'An email address to register with, and bank details for Stripe when you are ready to take payments. You can build and preview an event before connecting Stripe.',
    },
    {
        q: 'How long does Stripe onboarding take?',
        a: 'Usually a few minutes. Stripe asks for your identity and bank details directly, so eventza never stores them.',
    },
    {
        q: 'Can I sell tickets before Stripe is verified?',
        a: 'Paid tickets need a verified Stripe account, since the money has to have somewhere to land. Free tickets work straight away.',
    },
    {
        q: 'What does the scanner app run on?',
        a: 'Any phone with a camera and a browser. Your door staff sign in with scanner accounts you create, separate from your own login.',
    },
    {
        q: 'Can I cancel or delete an event?',
        a: 'Yes, from the event dashboard. Refunds for any tickets already sold are handled through your Stripe account.',
    },
];

export default function HostPage() {
    return (
        <main className="flex flex-1 flex-col">
            <section className="border-b border-line bg-surface">
                <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-24">
                    <div className="max-w-2xl animate-rise">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-text">
                            For organisers
                        </p>
                        <h1 className="mt-4 font-display text-[42px] leading-[1.06] tracking-tight text-ink sm:text-[56px]">
                            Run the whole event from one dashboard
                        </h1>
                        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-3">
                            Publishing, ticketing, payouts, door scanning, and the numbers
                            afterwards. You pay 5% of each paid ticket and nothing on the months
                            you are not selling.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button size="lg" asChild>
                                <Link href="/auth/register">
                                    Create your first event <RiArrowRightLine className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/pricing">See pricing</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-line bg-paper">
                <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-20">
                    <h2 className="max-w-lg font-display text-[32px] leading-tight text-ink sm:text-[38px]">
                        From an idea to a scanned ticket
                    </h2>

                    <ol className="mt-12 flex flex-col">
                        {STEPS.map(({ icon: Icon, title, body }, i) => (
                            <li
                                key={title}
                                className="grid gap-4 border-t border-line py-8 sm:grid-cols-[auto_1fr_1.4fr] sm:items-start sm:gap-8"
                            >
                                <span className="font-mono text-[12px] text-ink-4 sm:pt-1.5">
                                    0{i + 1}
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-accent-text">
                                        <Icon className="h-[17px] w-[17px]" />
                                    </span>
                                    <h3 className="font-display text-[22px] text-ink">{title}</h3>
                                </div>
                                <p className="text-[15px] leading-relaxed text-ink-3">{body}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <OrganiserFeatures />

            <Faq items={HOST_FAQ} title="Before you start" />

            <section className="bg-surface">
                <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6">
                    <div className="grain relative overflow-hidden rounded-[var(--radius-panel)] bg-ink px-8 py-14 text-center sm:px-16">
                        <h2 className="mx-auto max-w-xl font-display text-[34px] leading-[1.12] text-paper sm:text-[42px]">
                            Your first event takes about ten minutes
                        </h2>
                        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-paper/65">
                            Registering is free, and you can build the whole thing before you
                            decide to publish it.
                        </p>
                        <div className="mt-9 flex flex-wrap justify-center gap-3">
                            <Link
                                href="/auth/register"
                                className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-control)] bg-accent px-6 text-[15px] font-medium text-white transition-colors hover:bg-accent-hover"
                            >
                                Get started free <RiArrowRightLine className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex h-12 items-center rounded-[var(--radius-control)] border border-paper/25 px-6 text-[15px] font-medium text-paper transition-colors hover:bg-paper/10"
                            >
                                Browse events first
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
