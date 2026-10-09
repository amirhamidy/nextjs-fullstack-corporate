
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import HomeMobileMenu from "./home-mobile-menu";
import Image from "next/image";

const navigationItems = [
    { label: "مقالات", href: "#" },
    { label: "درباره ما", href: "#" },
    { label: "خدمات", href: "#" },
    { label: "محصولات", href: "#" },
];

export default function HomeHeader() {
    return (
        <header className="w-full px-4 pt-4 sm:px-6 lg:px-8">
            <div
                dir="ltr"
                className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center rounded-[2rem] border border-white/[0.09] bg-[#111019]/80 px-4 py-3 shadow-[0_8px_40px_rgba(109,40,217,0.08)] backdrop-blur-2xl sm:px-6"
            >

                <Link
                    href="/"
                    aria-label="صفحه اصلی رادکو"
                    className="flex w-fit items-center gap-3"
                >
                    <Image
                        src="/logo.png"
                        alt="لوگوی رادکو"
                        width={50}
                        height={50}
                        priority
                        className="size-[50px] shrink-0 object-contain"
                    />
                    <span className="flex flex-col gap-0.5">
                        <span className="text-base font-extrabold tracking-wide text-white sm:text-lg">
                            رادکو
                        </span>
                        <span
                            dir="rtl"
                            className="text-[10px] text-white/45 sm:text-xs"
                        >
                            راهکارهای نرم‌افزاری
                        </span>
                    </span>
                </Link>

                <nav
                    aria-label="منوی اصلی"
                    dir="rtl"
                    className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.025] p-1 md:flex"
                >
                    {navigationItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="rounded-full px-4 py-2 text-sm text-white/65 transition-colors duration-200 hover:bg-white/[0.07] hover:text-white"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center justify-end gap-2">
                    <div dir="rtl" className="hidden items-center gap-2 md:flex">
                        <Link
                            href="#"
                            className="rounded-full px-4 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                            ورود
                        </Link>

                        <Link
                            href="#"
                            className="group inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-600/20"
                        >
                            شروع همکاری
                            <ArrowUpLeft
                                size={16}
                                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </Link>
                    </div>

                    <div className="md:hidden">
                        <HomeMobileMenu items={navigationItems} />
                    </div>
                </div>
            </div>
        </header>
    );
}