'use client';

import { use } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    RiTicketLine,
    RiMoneyDollarCircleLine,
    RiQrCodeLine,
    RiGroupLine,
} from 'react-icons/ri';
import { Spinner } from '@/components/ui/Spinner';
import { useEventAnalytics } from '@/lib/queries/orders';

const PIE_COLORS = {
    confirmed: '#4f46e5',
    pending: '#f59e0b',
    cancelled: '#ef4444',
};

function StatCard({
    label,
    value,
    sub,
    icon: Icon,
    colorClass,
}: {
    label: string;
    value: string;
    sub?: string;
    icon: React.ElementType;
    colorClass: string;
}) {
    return (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 flex items-start gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-none">{value}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{label}</p>
                {sub && <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data, isLoading } = useEventAnalytics(Number(id));

    if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
    if (!data) return <p className="text-zinc-400 text-sm">No data available.</p>;

    const {
        totalTicketsSold,
        totalRevenue,
        totalCheckIns,
        capacityUsed,
        ticketBreakdown,
        revenueByDay,
        ordersByStatus,
    } = data;

    const checkInRate = totalTicketsSold > 0
        ? Math.round((totalCheckIns / totalTicketsSold) * 100)
        : 0;

    const pieData = [
        { name: 'Confirmed', value: ordersByStatus.confirmed, color: PIE_COLORS.confirmed },
        { name: 'Pending', value: ordersByStatus.pending, color: PIE_COLORS.pending },
        { name: 'Cancelled', value: ordersByStatus.cancelled, color: PIE_COLORS.cancelled },
    ].filter((d) => d.value > 0);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Analytics</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Event performance overview</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    label="Tickets sold"
                    value={String(totalTicketsSold)}
                    icon={RiTicketLine}
                    colorClass="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                />
                <StatCard
                    label="Total revenue"
                    value={`$${totalRevenue.toFixed(2)}`}
                    icon={RiMoneyDollarCircleLine}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                />
                <StatCard
                    label="Check-ins"
                    value={String(totalCheckIns)}
                    sub={`${checkInRate}% check-in rate`}
                    icon={RiQrCodeLine}
                    colorClass="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                />
                <StatCard
                    label="Capacity used"
                    value={`${capacityUsed}%`}
                    icon={RiGroupLine}
                    colorClass="bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400"
                />
            </div>

            {revenueByDay.length > 0 && (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                    <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Revenue over time</h2>
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueByDay} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(v) =>
                                        new Date(v + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                    }
                                />
                                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                                <Tooltip
                                    formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Revenue']}
                                    labelFormatter={(l) =>
                                        new Date(l + 'T00:00:00').toLocaleDateString('en-US', {
                                            month: 'long', day: 'numeric', year: 'numeric',
                                        })
                                    }
                                />
                                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                    <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Ticket breakdown</h2>
                    {ticketBreakdown.length === 0 ? (
                        <p className="text-sm text-zinc-400">No tickets created yet.</p>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {ticketBreakdown.map((t) => {
                                const pct = t.available > 0 ? Math.round((t.sold / t.available) * 100) : 0;
                                return (
                                    <div key={t.id} className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-zinc-800 dark:text-zinc-200">{t.name}</span>
                                            <span className="text-zinc-500 dark:text-zinc-400">{t.sold} / {t.available}</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-indigo-500 transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                                            <span>{t.price === 0 ? 'Free' : `$${t.price.toFixed(2)} each`}</span>
                                            <span>${t.revenue.toFixed(2)} revenue</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                    <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Order status</h2>
                    {pieData.length === 0 ? (
                        <p className="text-sm text-zinc-400">No orders yet.</p>
                    ) : (
                        <div className="flex items-center gap-6">
                            <div className="h-40 w-40 shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={42}
                                            outerRadius={62}
                                            dataKey="value"
                                            paddingAngle={2}
                                        >
                                            {pieData.map((entry) => (
                                                <Cell key={entry.name} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v) => [v, 'Orders']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-col gap-3">
                                {pieData.map((entry) => (
                                    <div key={entry.name} className="flex items-center gap-2.5">
                                        <div
                                            className="h-2.5 w-2.5 rounded-full shrink-0"
                                            style={{ background: entry.color }}
                                        />
                                        <span className="text-sm text-zinc-600 dark:text-zinc-400 capitalize">{entry.name}</span>
                                        <span className="ml-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">{entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
