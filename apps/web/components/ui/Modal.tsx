'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { RiCloseLine } from 'react-icons/ri';
import { cn } from '@/lib/cn';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthClasses = {
    sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl',
};

const FOCUSABLE =
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Modal({
    open, onClose, title, description, children, maxWidth = 'md',
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    // Keep the node mounted through the closing animation.
    const [present, setPresent] = useState(open);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (open) { setPresent(true); setClosing(false); }
        else if (present) {
            setClosing(true);
            const t = setTimeout(() => { setPresent(false); setClosing(false); }, 180);
            return () => clearTimeout(t);
        }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const trapFocus = useCallback((e: KeyboardEvent) => {
        if (e.key !== 'Tab' || !panelRef.current) return;
        const nodes = Array.from(
            panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
        ).filter((n) => n.offsetParent !== null);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus();
        }
    }, []);

    useEffect(() => {
        if (!open) return;
        const previouslyFocused = document.activeElement as HTMLElement | null;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
            else trapFocus(e);
        };

        document.addEventListener('keydown', handleKey);
        // Compensate for scrollbar removal so the page doesn't shift.
        const gap = window.innerWidth - document.documentElement.clientWidth;
        const { overflow, paddingRight } = document.body.style;
        document.body.style.overflow = 'hidden';
        if (gap > 0) document.body.style.paddingRight = `${gap}px`;

        const raf = requestAnimationFrame(() => {
            panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
        });

        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = overflow;
            document.body.style.paddingRight = paddingRight;
            cancelAnimationFrame(raf);
            previouslyFocused?.focus?.();
        };
    }, [open, onClose, trapFocus]);

    if (!present) return null;

    return createPortal(
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
                'fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4',
                'bg-ink/35 backdrop-blur-[3px]',
                closing ? 'animate-overlay [animation-direction:reverse]' : 'animate-overlay',
            )}
            onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div
                ref={panelRef}
                className={cn(
                    'w-full flex flex-col bg-surface border border-line shadow-xl',
                    'rounded-t-[var(--radius-panel)] sm:rounded-[var(--radius-panel)]',
                    'max-h-[92vh] sm:max-h-[88vh]',
                    maxWidthClasses[maxWidth],
                    closing ? 'animate-scale-in [animation-direction:reverse]' : 'animate-scale-in',
                )}
            >
                {/* Drag affordance on mobile sheets */}
                <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
                    <span className="h-1 w-9 rounded-full bg-line-strong" />
                </div>

                {title && (
                    <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-4 sm:pt-5 pb-4 shrink-0">
                        <div className="min-w-0">
                            <h2 className="font-display text-xl text-ink leading-tight">{title}</h2>
                            {description && (
                                <p className="text-[13px] text-ink-3 mt-1 leading-snug">{description}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="shrink-0 -mr-1.5 -mt-0.5 flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] text-ink-4 hover:bg-surface-2 hover:text-ink transition-colors cursor-pointer"
                        >
                            <RiCloseLine className="h-[18px] w-[18px]" />
                        </button>
                    </div>
                )}

                <div className="px-5 sm:px-6 pb-6 pt-1 overflow-y-auto overscroll-contain">
                    {children}
                </div>
            </div>
        </div>,
        document.body,
    );
}
