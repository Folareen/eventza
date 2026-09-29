'use client';

import { use, useMemo } from 'react';
import { useTheme } from 'next-themes';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
    RiTicket2Line, RiMoneyDollarCircleLine, RiQrScanLine,
    RiGroupLine, RiBarChartLine,
} from 'react-icons/ri';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { formatMoney, formatMoneyCompact } from '@/lib/format';
import { useEventAnalytics } from '@/lib/queries/orders';

/** Categorical hues for order status. Chosen to stay distinguishable
 *  in both themes and under the common forms of colour blindness. */
const STATUS_COLORS = {
    confirmed: '#C2410C',
    pending: '#A16207',
    cancelled: '#78716C',
} as const;

function StatCard({
    label, value, sub, icon: Icon,
}: {
    label: string;
    value: string;
    sub?: string;
    icon: React.ElementType;
}) {
    return (
        <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] bg-surface-2 text-ink-3">
                <Icon className="h-[18px] w-[18px]" />
            </span>
            <div>
                <p className="font-display text-[30px] leading-none text-ink tabular-nums">{value}</p>
                <p className="mt-2 text-[12px] font-medium text-ink-3">{label}</p>
                {sub && <p className="mt-0.5 text-[11px] text-ink-4">{sub}</p>}
            </div>
        </div>
    );
}

function Panel({
    title, children, className,
}: { title: string; children: React.ReactNode; className?: string }) {
    return (
        <section className={`rounded-[var(--radius-card)] border border-line bg-surface p-5 ${className ?? ''}`}>
            <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-4">
                {title}
            </h2>
            {children}
        </section>
    );
}

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data, isLoading } = useEventAnalytics(Number(id));
    const { resolvedTheme } = useTheme();
    const dark = resolvedTheme === 'dark';

    // Recharts needs literal colours, so mirror the token values per theme.
    const axis = dark ? '#6F6A61' : '#9A9488';
    const grid = dark ? '#302E2B' : '#E4E0D8';
    const tooltipStyle = {
        background: dark ? '#232220' : '#FFFFFF',
        border: `1px solid ${grid}`,
        borderRadius: 10,
        fontSize: 12,
        color: dark ? '#F7F5F2' : '#171614',
        boxShadow: '0 4px 16px rgba(0,0,0,.12)',
        padding: '8px 12px',
    };

    const pieData = useMemo(() => {
        if (!data) return [];
        return [
            { name: 'Confirmed', value: data.ordersByStatus.confirmed, color: STATUS_COLORS.confirmed },
            { name: 'Pending', value: data.ordersByStatus.pending, color: STATUS_COLORS.pending },
            { name: 'Cancelled', value: data.ordersByStatus.cancelled, color: STATUS_COLORS.cancelled },
        ].filter((d) => d.value > 0);
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-7">
                <Skeleton className="h-9 w-48" />
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {Array.from({ length: 4 }, (_, i) => <StatSkeleton key={i} />)}
                </div>
                <Skeleton className="h-[280px] rounded-[var(--radius-card)]" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col gap-7">
                <PageHeader title="Analytics" description="Event performance overview" />
                <EmptyState
                    icon={RiBarChartLine}
                    title="No data yet"
                    description="Analytics appear once your event starts receiving orders."
                />
            </div>
        );
    }

    const {
        totalTicketsSold, totalRevenue, totalCheckIns,
        capacityUsed, ticketBreakdown, revenueByDay,
    } = data;

    const checkInRate = totalTicketsSold > 0
        ? Math.round((totalCheckIns / totalTicketsSold) * 100)
        : 0;

    const totalOrders = pieData.reduce((s, d) => s + d.value, 0);
    const hasActivity = totalTicketsSold > 0 || totalOrders > 0;

    return (
        <div className="flex flex-col gap-7">
            <PageHeader title="Analytics" description="How this event is performing." />

            {!hasActivity ? (
                <EmptyState
                    icon={RiBarChartLine}
                    title="No activity yet"
                    description="Once tickets start selling, revenue, check-ins and capacity all show up here."
                />
            ) : (
                <>
                    <div className="stagger grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <StatCard label="Tickets sold" value={String(totalTicketsSold)} icon={RiTicket2Line} />
                        <StatCard
                            label="Total revenue"
                            value={formatMoneyCompact(totalRevenue)}
                            sub={totalRevenue >= 1000 ? formatMoney(totalRevenue) : undefined}
                            icon={RiMoneyDollarCircleLine}
                        />
                        <StatCard
                            label="Check-ins"
                            value={String(totalCheckIns)}
                            sub={`${checkInRate}% of tickets sold`}
                            icon={RiQrScanLine}
                        />
                        <StatCard label="Capacity used" value={`${capacityUsed}%`} icon={RiGroupLine} />
                    </div>

                    {revenueByDay.length > 0 && (
                        <Panel title="Revenue over time">
                            <div className="h-56 -ml-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueByDay} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="2 4" stroke={grid} vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 11, fill: axis }}
                                            tickLine={false}
                                            axisLine={{ stroke: grid }}
                                            tickMargin={8}
                                            tickFormatter={(v) =>
                                                new Date(`${v}T00:00:00`).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric',
                                                })
                                            }
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fill: axis }}
                                            tickLine={false}
                                            axisLine={false}
                                            width={48}
                                            tickFormatter={(v) => `$${v}`}
                                        />
                                        <Tooltip
                                            cursor={{ fill: dark ? '#ffffff0a' : '#0000000a' }}
                                            contentStyle={tooltipStyle}
                                            formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Revenue']}
                                            labelFormatter={(l) =>
                                                new Date(`${l}T00:00:00`).toLocaleDateString('en-US', {
                                                    month: 'long', day: 'numeric', year: 'numeric',
                                                })
                                            }
                                        />
                                        <Bar
                                            dataKey="revenue"
                                            fill={STATUS_COLORS.confirmed}
                                            radius={[5, 5, 0, 0]}
                                            maxBarSize={44}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Panel>
                    )}

                    <div className="grid gap-4 lg:grid-cols-2">
                        <Panel title="Ticket breakdown">
                            {ticketBreakdown.length === 0 ? (
                                <p className="py-8 text-center text-sm text-ink-4">No tickets created yet.</p>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {ticketBreakdown.map((t) => {
                                        const pct = t.available > 0
                                            ? Math.round((t.sold / t.available) * 100)
                                            : 0;
                                        return (
                                            <div key={t.id} className="flex flex-col gap-2">
                                                <div className="flex items-baseline justify-between gap-3 text-[13px]">
                                                    <span className="truncate font-medium text-ink">{t.name}</span>
                                                    <span className="shrink-0 tabular-nums text-ink-3">
                                                        {t.sold}<span className="text-ink-4"> / {t.available}</span>
                                                    </span>
                                                </div>
                                                <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                                                    <div
                                                        className="h-full rounded-full bg-accent transition-[width] duration-700 ease-[var(--ease-out-quint)]"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-[11px] text-ink-4">
                                                    <span>{t.price === 0 ? 'Free' : `$${t.price.toFixed(2)} each`}</span>
                                                    <span className="tabular-nums">${t.revenue.toFixed(2)} revenue</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Panel>

                        <Panel title="Order status">
                            {pieData.length === 0 ? (
                                <p className="py-8 text-center text-sm text-ink-4">No orders yet.</p>
                            ) : (
                                <div className="flex items-center gap-7">
                                    <div className="relative h-36 w-36 shrink-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={46}
                                                    outerRadius={66}
                                                    dataKey="value"
                                                    paddingAngle={pieData.length > 1 ? 3 : 0}
                                                    stroke="none"
                                                >
                                                    {pieData.map((entry) => (
                                                        <Cell key={entry.name} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, 'Orders']} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        {/* Total lives in the donut hole. */}
                                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="font-display text-[24px] leading-none text-ink">
                                                {totalOrders}
                                            </span>
                                            <span className="mt-1 text-[10px] uppercase tracking-wide text-ink-4">
                                                orders
                                            </span>
                                        </div>
                                    </div>

                                    <ul className="flex flex-col gap-3">
                                        {pieData.map((entry) => (
                                            <li key={entry.name} className="flex items-center gap-2.5">
                                                <span
                                                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                    style={{ background: entry.color }}
                                                />
                                                <span className="text-[13px] text-ink-3">{entry.name}</span>
                                                <span className="ml-auto text-[13px] font-semibold tabular-nums text-ink">
                                                    {entry.value}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </Panel>
                    </div>
                </>
            )}
        </div>
    );
}
