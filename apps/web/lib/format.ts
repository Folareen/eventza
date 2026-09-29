/** Shared date/time/money formatting. Previously each component
 *  redeclared these, which let them drift apart. */

const pad = (t: string) => {
    const [h, m] = t.split(':');
    const d = new Date();
    d.setHours(Number(h), Number(m), 0, 0);
    return d;
};

export function formatDate(
    dateStr: string,
    style: 'short' | 'medium' | 'long' = 'medium',
): string {
    const d = new Date(`${dateStr.slice(0, 10)}T00:00:00`);
    if (Number.isNaN(d.getTime())) return dateStr;
    const opts: Intl.DateTimeFormatOptions =
        style === 'short'  ? { month: 'short', day: 'numeric' }
      : style === 'long'   ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
      :                      { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return d.toLocaleDateString('en-US', opts);
}

export function formatTime(timeStr: string): string {
    if (!timeStr) return '';
    return pad(timeStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatDateTime(str: string): string {
    const d = new Date(str);
    if (Number.isNaN(d.getTime())) return str;
    return d.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
    });
}

/** Month/day parts for the calendar-block motif on cards. */
export function dateParts(dateStr: string): { month: string; day: string } {
    const d = new Date(`${dateStr.slice(0, 10)}T00:00:00`);
    if (Number.isNaN(d.getTime())) return { month: '', day: '' };
    return {
        month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        day: String(d.getDate()),
    };
}

export function formatMoney(value: number | string): string {
    const n = Number(value);
    if (!Number.isFinite(n)) return '$0';
    return n === 0 ? 'Free' : `$${n.toFixed(2)}`;
}

/** Compact currency for stat tiles, e.g. $12.4k */
export function formatMoneyCompact(value: number): string {
    if (!Number.isFinite(value)) return '$0';
    if (Math.abs(value) >= 1000) {
        return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
    }
    return `$${value.toFixed(2)}`;
}

export function isPast(date: string, time?: string): boolean {
    const d = new Date(`${date.slice(0, 10)}T${(time ?? '00:00').slice(0, 5)}`);
    return d.getTime() <= Date.now();
}

/** "in 3 days" / "2 weeks ago", relative labels for event proximity. */
export function relativeDay(date: string, time?: string): string {
    const target = new Date(`${date.slice(0, 10)}T${(time ?? '00:00').slice(0, 5)}`);
    if (Number.isNaN(target.getTime())) return '';
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const days = Math.round((startOfDay(target) - startOfDay(new Date())) / 86_400_000);
    const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
    if (days === 0) return 'Today';
    if (Math.abs(days) < 7) return rtf.format(days, 'day');
    if (Math.abs(days) < 30) return rtf.format(Math.round(days / 7), 'week');
    return rtf.format(Math.round(days / 30), 'month');
}
