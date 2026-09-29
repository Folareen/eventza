import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Instrument_Serif({
    variable: "--font-display",
    subsets: ["latin"],
    weight: "400",
});

export const metadata: Metadata = {
    title: { default: "eventza — find events worth your time", template: "%s · eventza" },
    description: "Discover events near you, or host your own. Browse, book, and go.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className={`${geist.variable} ${geistMono.variable} ${display.variable} h-full`}
            suppressHydrationWarning
        >
            <body className="min-h-full flex flex-col bg-paper text-ink antialiased">
                <QueryProvider>
                    <ThemeProvider>
                        <AuthProvider>
                            {children}
                            <Toaster
                                position="bottom-right"
                                toastOptions={{
                                    duration: 4000,
                                    className:
                                        "!bg-surface !text-ink !border !border-line !shadow-lg !rounded-[var(--radius-control)] !text-sm !px-4 !py-3 !font-medium",
                                    success: { iconTheme: { primary: "var(--success)", secondary: "var(--surface)" } },
                                    error: { iconTheme: { primary: "var(--danger)", secondary: "var(--surface)" } },
                                }}
                            />
                        </AuthProvider>
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
