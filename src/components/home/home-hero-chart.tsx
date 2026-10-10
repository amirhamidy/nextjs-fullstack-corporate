"use client";

import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import { cn } from "@/lib/utils";
import SalesIssuesChart from "@/components/home/sales-issues-chart";
import SalesChart from "@/components/home/sales-chart";
import CategoryChart from "@/components/home/category-chart";
import TopBringersChart, {
    type TopBringerItem,
} from "@/components/home/top-bringers-chart";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const HEADER_OFFSET = 86;

const issuesData = {
    weekly: [
        { stage: "فروش", issues: 12 },
        { stage: "مالی", issues: 8 },
        { stage: "منابع انسانی", issues: 5 },
        { stage: "فنی", issues: 16 },
        { stage: "پشتیبانی", issues: 9 },
        { stage: "بازرگانی", issues: 6 },
        { stage: "مدیریت", issues: 3 },
    ],
    monthly: [
        { stage: "فروش", issues: 42 },
        { stage: "مالی", issues: 27 },
        { stage: "منابع انسانی", issues: 18 },
        { stage: "فنی", issues: 56 },
        { stage: "پشتیبانی", issues: 34 },
        { stage: "بازرگانی", issues: 21 },
        { stage: "مدیریت", issues: 11 },
    ],
    yearly: [
        { stage: "فروش", issues: 380 },
        { stage: "مالی", issues: 245 },
        { stage: "منابع انسانی", issues: 196 },
        { stage: "فنی", issues: 510 },
        { stage: "پشتیبانی", issues: 325 },
        { stage: "بازرگانی", issues: 218 },
        { stage: "مدیریت", issues: 124 },
    ],
};

const salesData = {
    weekly: [
        { name: "ش", sales: 14 },
        { name: "ی", sales: 22 },
        { name: "د", sales: 18 },
        { name: "س", sales: 31 },
        { name: "چ", sales: 27 },
        { name: "پ", sales: 38 },
        { name: "ج", sales: 24 },
    ],
    monthly: [
        { name: "هفته ۱", sales: 96 },
        { name: "هفته ۲", sales: 134 },
        { name: "هفته ۳", sales: 118 },
        { name: "هفته ۴", sales: 176 },
    ],
    yearly: [
        { name: "بهار", sales: 420 },
        { name: "تابستان", sales: 560 },
        { name: "پاییز", sales: 510 },
        { name: "زمستان", sales: 690 },
    ],
};

const sources = [
    { resourceId: 1, name: "اینستاگرام", color: "#f472b6", glow: "rgba(244,114,182,0.55)" },
    { resourceId: 2, name: "معرفی مشتری", color: "#38bdf8", glow: "rgba(56,189,248,0.55)" },
    { resourceId: 3, name: "وب‌سایت", color: "#818cf8", glow: "rgba(129,140,248,0.55)" },
    { resourceId: 4, name: "تماس تلفنی", color: "#2dd4bf", glow: "rgba(45,212,191,0.55)" },
    { resourceId: 5, name: "نمایشگاه", color: "#fbbf24", glow: "rgba(251,191,36,0.55)" },
];

const withValues = (values: number[]) =>
    sources.map((source, i) => ({ ...source, value: values[i] }));

const categoryData = {
    weekly: withValues([18, 12, 9, 6, 3]),
    monthly: withValues([74, 52, 41, 27, 14]),
    yearly: withValues([820, 610, 480, 330, 190]),
};

const bringers: TopBringerItem[] = [
    { key: "1", full_name: "علی رضایی", count: 48, actual: 31, potential: 17 },
    { key: "2", full_name: "سارا محمدی", count: 41, actual: 27, potential: 14 },
    { key: "3", full_name: "امیر کریمی", count: 36, actual: 22, potential: 14 },
    { key: "4", full_name: "نیلوفر احمدی", count: 29, actual: 18, potential: 11 },
    { key: "5", full_name: "حسین نوری", count: 22, actual: 12, potential: 10 },
];

type HeroCard = {
    key: string;
    offset: boolean;
    tilt: { rx: number; ry: number; rz: number };
    node: ReactNode;
};

const cards: HeroCard[] = [
    {
        key: "issues",
        offset: false,
        tilt: { rx: 3, ry: 14, rz: -1.5 },
        node: <SalesIssuesChart data={issuesData} variant="glass" />,
    },
    {
        key: "sales",
        offset: true,
        tilt: { rx: 4, ry: -14, rz: 1.5 },
        node: <SalesChart data={salesData} variant="glass" />,
    },
    {
        key: "category",
        offset: false,
        tilt: { rx: 14, ry: 4, rz: 1 },
        node: <CategoryChart data={categoryData} variant="glass" />,
    },
    {
        key: "bringers",
        offset: true,
        tilt: { rx: -12, ry: -7, rz: -1.5 },
        node: (
            <TopBringersChart
                items={bringers}
                loading={false}
                variant="glass"
            />
        ),
    },
];

export default function HomeHero() {
    const [ready, setReady] = useState(false);

    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const loaderRef = useRef<HTMLDivElement>(null);
    const coreRef = useRef<HTMLSpanElement>(null);
    const ringRef = useRef<HTMLSpanElement>(null);
    const ringTwoRef = useRef<HTMLSpanElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const enterRefs = useRef<(HTMLDivElement | null)[]>([]);
    const breathRefs = useRef<(HTMLDivElement | null)[]>([]);
    const stepRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const hintRef = useRef<HTMLDivElement>(null);
    const hintDotRef = useRef<HTMLSpanElement>(null);
    const textBreathRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const paraRef = useRef<HTMLParagraphElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        AOS.init({
            duration: 1100,
            once: true,
            offset: 10,
            easing: "ease-out-cubic",
        });

        const reduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (reduced) {
            gsap.set([badgeRef.current, titleRef.current], { opacity: 1 });
            setReady(true);
            return;
        }

        let timer: ReturnType<typeof setTimeout> | undefined;

        const ctx = gsap.context(() => {
            gsap.to(coreRef.current, {
                scale: 1.35,
                opacity: 0.75,
                duration: 1.4,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });

            gsap.fromTo(
                ringRef.current,
                { scale: 0.5, opacity: 0.55 },
                {
                    scale: 1.7,
                    opacity: 0,
                    duration: 2.2,
                    ease: "sine.out",
                    repeat: -1,
                },
            );

            gsap.fromTo(
                ringTwoRef.current,
                { scale: 0.5, opacity: 0.35 },
                {
                    scale: 1.7,
                    opacity: 0,
                    duration: 2.2,
                    ease: "sine.out",
                    repeat: -1,
                    delay: 1.1,
                },
            );

            const tl = gsap.timeline({
                defaults: { ease: "expo.out" },
                onComplete: () => {
                    gsap.to(textBreathRef.current, {
                        y: -6,
                        scale: 1.02,
                        duration: 3.4,
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true,
                    });
                },
            });

            tl.fromTo(
                badgeRef.current,
                { opacity: 0, y: -24, filter: "blur(8px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 },
                0,
            ).fromTo(
                titleRef.current,
                {
                    opacity: 0,
                    y: 70,
                    scale: 0.7,
                    rotateX: -50,
                    filter: "blur(20px)",
                    transformPerspective: 800,
                    transformOrigin: "50% 100%",
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    filter: "blur(0px)",
                    duration: 1.5,
                },
                0.15,
            );

            timer = setTimeout(() => {
                gsap.to(loaderRef.current, {
                    opacity: 0,
                    scale: 0.6,
                    duration: 0.4,
                    ease: "power2.in",
                    onComplete: () => setReady(true),
                });
            }, 1700);
        });

        return () => {
            if (timer) clearTimeout(timer);
            ctx.revert();
        };
    }, []);

    useEffect(() => {
        if (!ready) return;

        const mm = gsap.matchMedia();

        const startBreath = () => {
            const tweens: gsap.core.Tween[] = [];

            breathRefs.current.forEach((el, i) => {
                if (!el) return;

                tweens.push(
                    gsap.to(el, {
                        y: i % 2 === 0 ? -7 : 6,
                        scale: 1.012,
                        duration: 3 + i * 0.35,
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true,
                        delay: 1 + i * 0.25,
                        force3D: true,
                    }),
                );
            });

            if (glowRef.current) {
                tweens.push(
                    gsap.to(glowRef.current, {
                        scale: 1.18,
                        opacity: 0.85,
                        duration: 3.8,
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true,
                    }),
                );
            }

            const section = sectionRef.current;

            if (!section) return () => undefined;

            const observer = new IntersectionObserver(([entry]) => {
                tweens.forEach((tween) => {
                    if (entry.isIntersecting) {
                        tween.resume();
                    } else {
                        tween.pause();
                    }
                });
            });

            observer.observe(section);

            return () => observer.disconnect();
        };

        mm.add(
            "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
            () => {
                const section = sectionRef.current;
                const grid = gridRef.current;
                const slotOne = slotRefs.current[0];
                const [c1, c2, c3, c4] = enterRefs.current;

                if (
                    !section ||
                    !grid ||
                    !slotOne ||
                    !c1 ||
                    !c2 ||
                    !c3 ||
                    !c4
                ) {
                    return undefined;
                }

                const stopBreath = startBreath();

                const xC = () =>
                    grid.clientWidth / 2 -
                    (slotOne.offsetLeft + slotOne.offsetWidth / 2);

                const yC = () =>
                    grid.clientHeight / 2 -
                    (slotOne.offsetTop + slotOne.offsetHeight / 2);

                let lastStep = -1;

                const setStep = (index: number) => {
                    if (index === lastStep) return;

                    lastStep = index;

                    stepRefs.current.forEach((el, i) => {
                        if (!el) return;

                        gsap.to(el, {
                            opacity: i === index ? 1 : 0.3,
                            scaleY: i === index ? 1 : 0.45,
                            duration: 0.4,
                            ease: "power2.out",
                            overwrite: true,
                        });
                    });
                };

                setStep(0);

                if (hintDotRef.current) {
                    gsap.to(hintDotRef.current, {
                        y: 10,
                        opacity: 0.2,
                        duration: 1.1,
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true,
                    });
                }

                const tl = gsap.timeline({
                    defaults: { ease: "none" },
                    scrollTrigger: {
                        trigger: section,
                        start: `top top+=${HEADER_OFFSET}`,
                        end: () => `+=${Math.round(window.innerHeight * 3)}`,
                        pin: true,
                        scrub: 0.8,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        onUpdate: (self) =>
                            setStep(
                                self.progress < 0.06
                                    ? 0
                                    : self.progress < 0.5
                                        ? 1
                                        : 2,
                            ),
                    },
                });

                tl.to(
                    hintRef.current,
                    { opacity: 0, y: 12, duration: 0.5 },
                    0,
                )
                    .fromTo(
                        c1,
                        {
                            x: () => xC(),
                            y: () => yC(),
                            scale: 1.14,
                        },
                        {
                            x: 0,
                            y: () => yC(),
                            scale: 1,
                            duration: 3,
                            ease: "power2.inOut",
                        },
                        0.6,
                    )
                    .fromTo(
                        c2,
                        {
                            x: 260,
                            y: () => yC() + 60,
                            opacity: 0,
                            rotationY: -75,
                            scale: 0.75,
                            transformPerspective: 900,
                        },
                        {
                            x: 0,
                            y: () => yC(),
                            opacity: 1,
                            rotationY: 0,
                            scale: 1,
                            duration: 2.4,
                            ease: "power3.out",
                        },
                        1,
                    )
                    .fromTo(
                        subRef.current,
                        { opacity: 0, x: 80, filter: "blur(10px)" },
                        {
                            opacity: 1,
                            x: 0,
                            filter: "blur(0px)",
                            duration: 2,
                            ease: "power3.out",
                        },
                        1.2,
                    )
                    .fromTo(
                        lineRef.current,
                        {
                            opacity: 0,
                            scaleX: 0,
                            transformOrigin: "100% 50%",
                        },
                        {
                            opacity: 1,
                            scaleX: 1,
                            duration: 1.6,
                            ease: "power3.out",
                        },
                        1.8,
                    )
                    .fromTo(
                        c1,
                        { y: () => yC() },
                        {
                            y: 0,
                            duration: 2.6,
                            ease: "power2.inOut",
                            immediateRender: false,
                        },
                        5.2,
                    )
                    .fromTo(
                        c2,
                        { y: () => yC() },
                        {
                            y: 0,
                            duration: 2.6,
                            ease: "power2.inOut",
                            immediateRender: false,
                        },
                        5.2,
                    )
                    .fromTo(
                        c3,
                        {
                            x: -200,
                            y: 260,
                            opacity: 0,
                            rotationX: 70,
                            scale: 0.7,
                            transformPerspective: 900,
                        },
                        {
                            x: 0,
                            y: 0,
                            opacity: 1,
                            rotationX: 0,
                            scale: 1,
                            duration: 2.6,
                            ease: "power3.out",
                        },
                        5.4,
                    )
                    .fromTo(
                        c4,
                        {
                            x: 240,
                            y: 300,
                            opacity: 0,
                            rotation: 14,
                            scale: 0.55,
                        },
                        {
                            x: 0,
                            y: 0,
                            opacity: 1,
                            rotation: 0,
                            scale: 1,
                            duration: 2.6,
                            ease: "power3.out",
                        },
                        6,
                    )
                    .fromTo(
                        paraRef.current,
                        { opacity: 0, y: 30, filter: "blur(8px)" },
                        {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            duration: 1.8,
                            ease: "power3.out",
                        },
                        6.4,
                    )
                    .to({}, { duration: 1.2 });

                return () => {
                    stopBreath();
                };
            },
        );

        mm.add(
            "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
            () => {
                const stopBreath = startBreath();

                enterRefs.current.forEach((el, i) => {
                    if (!el || i === 0) return;

                    gsap.fromTo(
                        el,
                        { opacity: 0, y: 60, scale: 0.9 },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: slotRefs.current[i],
                                start: "top 90%",
                                once: true,
                            },
                        },
                    );
                });

                gsap.timeline({
                    delay: 1,
                    defaults: { ease: "power3.out" },
                })
                    .fromTo(
                        subRef.current,
                        { opacity: 0, x: 40, filter: "blur(8px)" },
                        {
                            opacity: 1,
                            x: 0,
                            filter: "blur(0px)",
                            duration: 1,
                        },
                        0,
                    )
                    .fromTo(
                        paraRef.current,
                        { opacity: 0, y: 20, filter: "blur(6px)" },
                        {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            duration: 1,
                        },
                        0.3,
                    )
                    .fromTo(
                        lineRef.current,
                        {
                            opacity: 0,
                            scaleX: 0,
                            transformOrigin: "100% 50%",
                        },
                        { opacity: 1, scaleX: 1, duration: 1 },
                        0.5,
                    );

                return () => {
                    stopBreath();
                };
            },
        );

        mm.add("(prefers-reduced-motion: reduce)", () => {
            gsap.set(
                [
                    ...enterRefs.current,
                    subRef.current,
                    paraRef.current,
                    lineRef.current,
                ],
                { opacity: 1 },
            );
        });

        let cancelled = false;

        document.fonts?.ready.then(() => {
            if (!cancelled) ScrollTrigger.refresh();
        });

        const frame = requestAnimationFrame(() => {
            AOS.refreshHard();
        });

        return () => {
            cancelled = true;
            cancelAnimationFrame(frame);
            mm.revert();
        };
    }, [ready]);

    return (
        <section
            ref={sectionRef}
            className="relative flex min-h-[calc(100svh-86px)] items-center px-4 py-10 sm:px-6 lg:h-[calc(100svh-86px)] lg:px-8 lg:py-0"
        >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-[85%] -translate-y-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-y-1/2 translate-x-[10%] rounded-full bg-blue-600/15 blur-[90px]" />

            <div
                dir="ltr"
                className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16"
            >
                <div className="flex w-full justify-center lg:justify-start">
                    <div className="relative min-h-[300px] w-full [--card:min(300px,82vw)] lg:h-[calc(var(--card)*2_+_3.25rem)] lg:min-h-0 lg:w-[calc(var(--card)*2_+_1.25rem)] lg:[--card:clamp(170px,min(calc((100svh_-_236px)/2),20vw),260px)]">
                        {!ready && (
                            <div
                                ref={loaderRef}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <span
                                    ref={ringRef}
                                    className="absolute h-16 w-16 rounded-full border border-violet-300/60"
                                />
                                <span
                                    ref={ringTwoRef}
                                    className="absolute h-16 w-16 rounded-full border border-sky-300/50"
                                />
                                <span
                                    ref={coreRef}
                                    className="h-5 w-5 rounded-full bg-gradient-to-br from-sky-300 via-indigo-300 to-violet-400 shadow-[0_0_28px_rgba(139,92,246,0.7)]"
                                />
                            </div>
                        )}

                        {ready && (
                            <>
                                <div
                                    ref={glowRef}
                                    className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-500/30 via-violet-500/25 to-sky-500/25 opacity-60 blur-[80px]"
                                />

                                <div
                                    ref={gridRef}
                                    className="relative grid grid-cols-1 justify-items-center gap-5 lg:grid-cols-[var(--card)_var(--card)] lg:justify-center lg:pb-8"
                                >
                                    {cards.map((card, i) => (
                                        <div
                                            key={card.key}
                                            ref={(el) => {
                                                slotRefs.current[i] = el;
                                            }}
                                            className={cn(
                                                "relative h-[var(--card)] w-[var(--card)] hover:z-30",
                                                card.offset && "lg:translate-y-8",
                                            )}
                                        >
                                            <div
                                                {...(i === 0
                                                    ? {
                                                        "data-aos": "flip-left",
                                                        "data-aos-duration": "1200",
                                                        "data-aos-delay": "150",
                                                    }
                                                    : {})}
                                                className="h-full w-full"
                                            >
                                                <div
                                                    ref={(el) => {
                                                        enterRefs.current[i] = el;
                                                    }}
                                                    className={cn(
                                                        "h-full w-full will-change-transform",
                                                        i > 0 && "opacity-0",
                                                    )}
                                                >
                                                    <div
                                                        ref={(el) => {
                                                            breathRefs.current[i] = el;
                                                        }}
                                                        className="h-full w-full will-change-transform"
                                                    >
                                                        <div className="group/card h-full w-full [perspective:900px]">
                                                            <div
                                                                style={
                                                                    {
                                                                        "--rx": `${card.tilt.rx}deg`,
                                                                        "--ry": `${card.tilt.ry}deg`,
                                                                        "--rz": `${card.tilt.rz}deg`,
                                                                    } as CSSProperties
                                                                }
                                                                className="h-full w-full will-change-transform [backface-visibility:hidden] [transform:rotateX(var(--rx))_rotateY(var(--ry))_rotateZ(var(--rz))] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:[transform:rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)_scale(1.04)]"
                                                            >
                                                                {card.node}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div
                    dir="rtl"
                    data-aos="zoom-in"
                    data-aos-duration="1100"
                    className="order-first flex w-full justify-center lg:order-last lg:justify-start"
                >
                    <div
                        ref={textBreathRef}
                        className="flex flex-col items-center text-center lg:items-start lg:text-right"
                    >
                        <div
                            ref={badgeRef}
                            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300 opacity-0 backdrop-blur-md"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-sky-300 to-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.9)]" />
                            مدیریت ارتباط با مشتری
                        </div>

                        <h1
                            ref={titleRef}
                            className="bg-gradient-to-l from-violet-300 via-indigo-300 to-sky-300 bg-clip-text text-6xl font-black tracking-tight text-transparent opacity-0 sm:text-7xl lg:text-8xl"
                        >
                            رادکو
                        </h1>

                        <p
                            ref={subRef}
                            className="mt-4 text-2xl font-semibold leading-relaxed text-slate-200 opacity-0 sm:text-3xl lg:text-4xl"
                        >
                            سکان کسب‌وکار تو
                        </p>

                        <p
                            ref={paraRef}
                            className="mt-5 max-w-md text-sm leading-8 text-slate-400 opacity-0 sm:text-base"
                        >
                            فروش، مشتری‌ها و تیمت رو توی یک داشبورد زنده ببین
                            و تصمیم‌هات رو با داده بگیر.
                        </p>

                        <div
                            ref={lineRef}
                            className="mt-6 h-[3px] w-24 rounded-full bg-gradient-to-l from-violet-400 via-indigo-400 to-sky-400/20 opacity-0"
                        />
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-2 lg:flex xl:right-8">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        ref={(el) => {
                            stepRefs.current[i] = el;
                        }}
                        className="h-8 w-[3px] rounded-full bg-gradient-to-b from-sky-300 to-violet-400 opacity-30"
                    />
                ))}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-4 hidden justify-center lg:flex">
                <div
                    ref={hintRef}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] tracking-widest text-slate-400">
                        اسکرول کن
                    </span>

                    <span className="relative h-8 w-[18px] rounded-full border border-white/25">
                        <span
                            ref={hintDotRef}
                            className="absolute left-1/2 top-1.5 h-1.5 w-[3px] -translate-x-1/2 rounded-full bg-sky-300"
                        />
                    </span>
                </div>
            </div>
        </section>
    );
}