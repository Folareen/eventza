'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
    RiMenuLine, RiMoonLine, RiSunLine, RiCloseLine,
    RiDashboardLine, RiUserLine, RiLogoutBoxRLine, RiAddLine,
} from 'react-icons/ri';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/cn';
import { useAuth } from '@/lib/auth-context';
import { Button } from '../ui/Button';
import { Logo } from './Logo';

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { resolvedTheme, setTheme } = useTheme();
    const { user, isLoading, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    // Border and shadow appear only once content sits behind the bar.
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close menus on navigation.
    useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [pathname]);

    useEffect(() => {
        if (!userMenuOpen) return;
        const onDown = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
        };
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setUserMenuOpen(false); };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [userMenuOpen]);

    const handleLogout = async () => {
        await logout();
        setUserMenuOpen(false);
        router.push('/');
    };

    const navLink = (href: string, label: string, active: boolean) => (
        <Link
            key={href}
            href={href}
            className={cn(
                'relative px-1 py-1 text-sm transition-colors duration-150',
                active ? 'text-ink font-medium' : 'text-ink-3 hover:text-ink',
            )}
        >
            {label}
            {/* Underline grows from the centre on the active route. */}
            <span
                className={cn(
                    'absolute -bottom-0.5 left-0 right-0 mx-auto h-px bg-accent',
                    'transition-[width] duration-300 ease-[var(--ease-out-quint)]',
                    active ? 'w-full' : 'w-0',
                )}
            />
        </Link>
    );

    const isDark = resolvedTheme === 'dark';

    return (
        <header
            className={cn(
                'sticky top-0 z-40 bg-paper/85 backdrop-blur-xl',
                'transition-[border-color,box-shadow] duration-300',
                scrolled ? 'border-b border-line shadow-sm' : 'border-b border-transparent',
            )}
        >
            <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-6 px-4 sm:px-6">
                <div className="flex items-center gap-8">
                    <Logo />
                    <nav className="hidden md:flex items-center gap-6">
                        {navLink('/', 'Discover', pathname === '/')}
                        {navLink('/host', 'Host', pathname === '/host')}
                        {navLink('/pricing', 'Pricing', pathname === '/pricing')}
                        {user && navLink('/dashboard/events', 'Dashboard', pathname.startsWith('/dashboard'))}
                    </nav>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] text-ink-3 hover:bg-surface-2 hover:text-ink transition-colors cursor-pointer"
                        aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} theme` : 'Toggle theme'}
                    >
                        {mounted && (
                            <span key={resolvedTheme} className="animate-pop flex">
                                {isDark ? <RiSunLine className="h-[18px] w-[18px]" /> : <RiMoonLine className="h-[18px] w-[18px]" />}
                            </span>
                        )}
                    </button>

                    {!isLoading && (user ? (
                        <div className="relative hidden md:block" ref={menuRef}>
                            <button
                                onClick={() => setUserMenuOpen((o) => !o)}
                                aria-expanded={userMenuOpen}
                                aria-haspopup="menu"
                                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-surface-2 transition-colors cursor-pointer"
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white select-none">
                                    {user.firstName[0]}{user.lastName[0]}
                                </span>
                                <span className="text-sm font-medium text-ink-2">{user.firstName}</span>
                            </button>

                            {userMenuOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 top-[calc(100%+8px)] z-20 w-56 origin-top-right animate-scale-in overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-lg"
                                >
                                    <div className="px-3.5 py-3 border-b border-line">
                                        <p className="text-sm font-medium text-ink truncate">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-ink-4 truncate mt-0.5">{user.email}</p>
                                    </div>
                                    <div className="p-1.5">
                                        {[
                                            { href: '/dashboard/events', icon: RiDashboardLine, label: 'Dashboard' },
                                            { href: '/dashboard/events/new', icon: RiAddLine, label: 'Create event' },
                                            { href: '/dashboard/account', icon: RiUserLine, label: 'Account' },
                                        ].map(({ href, icon: Icon, label }) => (
                                            <Link
                                                key={href}
                                                href={href}
                                                role="menuitem"
                                                className="flex items-center gap-2.5 rounded-[var(--radius-control)] px-2.5 py-2 text-sm text-ink-2 hover:bg-surface-2 transition-colors"
                                            >
                                                <Icon className="h-4 w-4 text-ink-4" />
                                                {label}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="p-1.5 border-t border-line">
                                        <button
                                            onClick={handleLogout}
                                            role="menuitem"
                                            className="flex w-full items-center gap-2.5 rounded-[var(--radius-control)] px-2.5 py-2 text-left text-sm text-danger hover:bg-danger-soft transition-colors cursor-pointer"
                                        >
                                            <RiLogoutBoxRLine className="h-4 w-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2 ml-1">
                            <Button variant="ghost" size="sm" onClick={() => router.push('/auth/login')}>Sign in</Button>
                            <Button size="sm" onClick={() => router.push('/auth/register')}>Get started</Button>
                        </div>
                    ))}

                    <button
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label="Menu"
                        aria-expanded={menuOpen}
                        className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] text-ink-2 hover:bg-surface-2 md:hidden transition-colors cursor-pointer"
                    >
                        {menuOpen ? <RiCloseLine className="h-5 w-5" /> : <RiMenuLine className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden border-t border-line bg-paper animate-rise">
                    <nav className="flex flex-col gap-0.5 px-3 py-3">
                        <MobileLink href="/" label="Discover" />
                        <MobileLink href="/host" label="Host" />
                        <MobileLink href="/pricing" label="Pricing" />
                        {user && <MobileLink href="/dashboard/events" label="Dashboard" />}
                        {user && <MobileLink href="/dashboard/events/new" label="Create event" />}
                        {user && <MobileLink href="/dashboard/account" label="Account" />}
                        <div className="my-2 h-px bg-line" />
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="rounded-[var(--radius-control)] px-3 py-2.5 text-left text-sm font-medium text-danger hover:bg-danger-soft transition-colors cursor-pointer"
                            >
                                Sign out
                            </button>
                        ) : (
                            <div className="flex flex-col gap-2 px-1 pt-1">
                                <Button variant="secondary" onClick={() => router.push('/auth/login')}>Sign in</Button>
                                <Button onClick={() => router.push('/auth/register')}>Get started</Button>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

function MobileLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-medium text-ink-2 hover:bg-surface-2 transition-colors"
        >
            {label}
        </Link>
    );
}
