
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpLeft } from "lucide-react";

type NavigationItem = {
    label: string;
    href: string;
};

type HomeMobileMenuProps = {
    items: NavigationItem[];
};

export default function HomeMobileMenu({
    items,
}: HomeMobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    return (
        <div className="relative">
            <button
                type="button"
                aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
                aria-expanded={isOpen}
                aria-controls="home-mobile-navigation"
                onClick={() => setIsOpen((current) => !current)}
                className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-colors hover:bg-white/[0.09]"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {isOpen && (
                <div
                    id="home-mobile-navigation"
                    dir="rtl"
                    className="absolute right-0 top-14 z-50 w-[min(18rem,calc(100vw-2rem))] rounded-3xl border border-white/10 bg-[#111019]/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-2xl"
                >
                    <nav
                        aria-label="منوی موبایل"
                        className="flex flex-col gap-1"
                    >
                        {items.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={closeMenu}
                                className="rounded-2xl px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="my-3 h-px bg-white/[0.08]" />

                    <div className="flex flex-col gap-2">
                        <Link
                            href="#"
                            onClick={closeMenu}
                            className="rounded-2xl px-4 py-3 text-center text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                            ورود به حساب
                        </Link>

                        <Link
                            href="#"
                            onClick={closeMenu}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                        >
                            شروع همکاری
                            <ArrowUpLeft size={16} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}