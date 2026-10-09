
import Link from "next/link";
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
                className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center rounded-[3rem] border border-white/[0.09] bg-[#111019]/80 px-4 py-3  backdrop-blur-2xl sm:px-6"
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
                    <div dir="rtl" className="hidden md:flex">
                        <div className="rounded-full bg-gradient-to-l from-violet-500/35 via-purple-400/25 to-blue-500/30 p-px transition-all duration-300 hover:bg-purple-600">
                            <Link
                                href="#"
                                className="group flex items-center gap-1 rounded-full bg-[#111019] p-1 text-sm transition-colors duration-300 hover:bg-violet-500/20"
                            >
                                <span className="rounded-full px-4 py-2 font-medium text-white/70 transition-colors duration-200 group-hover:text-white">
                                    ورود
                                </span>

                                <span
                                    aria-hidden="true"
                                    className="h-4 w-px bg-white/15 transition-colors duration-300 group-hover:bg-white/30"
                                />

                                <span className="rounded-full px-4 py-2 font-medium text-white/70 transition-colors duration-200 group-hover:text-white">
                                    ثبت‌ نام
                                </span>
                            </Link>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <HomeMobileMenu items={navigationItems} />
                    </div>
                </div>
            </div>
        </header>
    );
}