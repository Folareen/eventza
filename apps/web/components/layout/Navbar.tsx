'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { RiCalendarEventLine, RiMenuLine, RiMoonLine, RiSunLine, RiCloseLine, RiUserLine } from 'react-icons/ri';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/auth-context';
import { Button } from '../ui/Button';

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { user, isLoading, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const handleLogout = async () => {
        await logout();
        router.push('/');
        setUserMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/90 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/90">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                        <RiCalendarEventLine className="h-5 w-5 text-indigo-600" />
                        <span>eventza</span>
                    </Link>
                    <nav className="hidden sm:flex items-center gap-4">
                        <Link
                            href="/"
                            className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                        >
                            Browse Events
                        </Link>
                        {user && (
                            <Link
                                href="/dashboard/events"
                                className={`text-sm font-medium transition-colors ${pathname.startsWith('/dashboard') ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                            >
                                Dashboard
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="flex h-9 w-9 items-center justify-center rounded text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {mounted && (theme === 'dark' ? <RiSunLine className="h-4 w-4" /> : <RiMoonLine className="h-4 w-4" />)}
                    </button>

                    {!isLoading && (
                        <>
                            {user ? (
                                <div className="relative hidden sm:block">
                                    <button
                                        onClick={() => setUserMenuOpen((o) => !o)}
                                        className="flex items-center gap-2 rounded-lg px-3 h-9 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        <RiUserLine className="h-4 w-4" />
                                        <span>{user.firstName}</span>
                                    </button>
                                    {userMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                            <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-zinc-200 bg-white py-1.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                                                <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/80 transition-colors">Account</Link>
                                                <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors">Sign out</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => router.push('/auth/login')}>Sign in</Button>
                                    <Button size="sm" onClick={() => router.push('/auth/register')}>Sign up</Button>
                                </div>
                            )}
                        </>
                    )}

                    <button
                        onClick={() => setMenuOpen((o) => !o)}
                        className="flex h-9 w-9 items-center justify-center rounded text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 sm:hidden transition-colors"
                    >
                        {menuOpen ? <RiCloseLine className="h-5 w-5" /> : <RiMenuLine className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 sm:hidden">
                    <nav className="flex flex-col px-4 py-3 gap-1">
                        <Link href="/" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-zinc-700 dark:text-zinc-300">Browse Events</Link>
                        {user && <Link href="/dashboard/events" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-zinc-700 dark:text-zinc-300">Dashboard</Link>}
                        {user && <Link href="/account" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-zinc-700 dark:text-zinc-300">Account</Link>}
                        {user
                            ? <button onClick={handleLogout} className="py-2 text-left text-sm text-zinc-700 dark:text-zinc-300">Sign out</button>
                            : <>
                                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-zinc-700 dark:text-zinc-300">Sign in</Link>
                                <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-zinc-700 dark:text-zinc-300">Sign up</Link>
                            </>
                        }
                    </nav>
                </div>
            )}
        </header>
    );
}
