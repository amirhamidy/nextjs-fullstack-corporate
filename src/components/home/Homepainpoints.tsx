"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const HEADER_OFFSET = 86;

const LABELS = { s1: 0, s2: 4.6, s3: 9.2 } as const;
const TOTAL = 10.6;

const imageSizes = "(min-width: 1024px) 40vw, 90vw";

const frameSize =
    "relative mx-auto aspect-[4/5] w-full max-w-sm lg:h-[min(540px,calc(100svh-210px))] lg:w-auto lg:max-w-none";

const panel = "rounded-2xl border border-white/10 bg-[#0d0c18]/95 p-3 shadow-[0_12px_32px_rgba(0,0,0,0.4)]";

function Chip({ children, className, tone }: { children: ReactNode; className?: string; tone: string }) {
    return (
        <div data-float className={cn("absolute z-20", className)}>
            <div data-in className={cn("flex items-center gap-2 rounded-full border bg-[#0d0c18]/95 px-3 py-1.5 text-[11px] font-medium shadow-[0_8px_20px_rgba(0,0,0,0.35)]", tone)} dir="rtl">
                {children}
            </div>
        </div>
    );
}

function Frame({ border, outer, inner, children }: { border: string; outer: string; inner: string; children: ReactNode }) {
    return (
        <div data-in className={cn("relative h-full w-full p-px", outer, border)}>
            <div className={cn("relative h-full w-full overflow-hidden bg-[#0b0a14]", inner)}>{children}</div>
        </div>
    );
}

function FrameImage({ src }: { src: string }) {
    return (
        <div className="absolute inset-4">
            <Image src={src} alt="" fill sizes={imageSizes} quality={80} className="object-contain" />
        </div>
    );
}

function InventoryVisual() {
    return (
        <div className={frameSize}>
            <div className="pointer-events-none absolute -inset-12 bg-[radial-gradient(closest-side,rgba(56,189,248,0.2),transparent)]" />

            <Frame border="bg-gradient-to-br from-sky-300/50 via-white/10 to-violet-400/40" outer="rounded-3xl" inner="rounded-[calc(1.5rem-1px)]">
                <FrameImage src="/1-1.webp" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0a14] via-transparent to-transparent" />
                <div data-scan className="pointer-events-none absolute inset-x-0 top-0 h-[28%] border-b border-sky-300/70 bg-gradient-to-b from-transparent to-sky-400/20" />
                <span className="absolute left-3 top-3 h-5 w-5 rounded-tl-lg border-l-2 border-t-2 border-sky-300/70" />
                <span className="absolute right-3 top-3 h-5 w-5 rounded-tr-lg border-r-2 border-t-2 border-sky-300/70" />
                <span className="absolute bottom-3 left-3 h-5 w-5 rounded-bl-lg border-b-2 border-l-2 border-sky-300/70" />
                <span className="absolute bottom-3 right-3 h-5 w-5 rounded-br-lg border-b-2 border-r-2 border-sky-300/70" />
            </Frame>

            <Chip tone="border-sky-300/30 text-sky-100" className="-left-3 top-10 lg:-left-10">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                شمارش کامل انبار
            </Chip>

            <div className="absolute -bottom-7 -right-3 z-20 w-[84%] lg:-right-12 lg:w-[88%]">
                <div data-in className={panel} dir="rtl">
                    <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10.5px] font-semibold text-white">دقت موجودی انبار</span>
                        <span className="text-[9px] text-slate-400">در طول سال</span>
                    </div>
                    <svg viewBox="0 0 220 80" className="h-16 w-full" fill="none" aria-hidden>
                        <defs>
                            <linearGradient id="invStroke" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#38bdf8" />
                                <stop offset="100%" stopColor="#a78bfa" />
                            </linearGradient>
                        </defs>
                        <line x1="0" y1="14" x2="220" y2="14" stroke="rgba(255,255,255,0.12)" strokeDasharray="3 4" />
                        <path
                            data-draw
                            pathLength={1}
                            strokeDasharray={1}
                            d="M0 62 L22 62 L26 14 C34 32 40 50 52 58 C80 66 110 68 128 68 L132 14 C140 32 146 50 158 58 C186 66 206 68 220 68"
                            stroke="url(#invStroke)"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="26" cy="14" r="3.5" fill="#38bdf8" />
                        <circle cx="132" cy="14" r="3.5" fill="#38bdf8" />
                    </svg>
                    <div className="mt-1 flex items-center justify-between text-[9px] text-slate-300">
                        <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                            روز انبارگردانی
                        </span>
                        <span>یک تا دو هفته بعد: دوباره آشفته</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ManagerVisual() {
    return (
        <div className={frameSize}>
            <div className="pointer-events-none absolute -inset-12 bg-[radial-gradient(closest-side,rgba(251,146,60,0.2),transparent)]" />
            <div className="pointer-events-none absolute -inset-4 rounded-t-[999px] rounded-b-[2.5rem] border border-dashed border-amber-300/25" />

            <Frame border="bg-gradient-to-b from-amber-300/50 via-white/10 to-rose-400/40" outer="rounded-t-[999px] rounded-b-[2rem]" inner="rounded-t-[999px] rounded-b-[calc(2rem-1px)]">
                <FrameImage src="/2-2.webp" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0a14] via-transparent to-transparent" />
            </Frame>

            <Chip tone="border-amber-300/30 text-amber-100" className="-right-2 top-24 lg:-right-10">
                «فقط خودم می‌تونم چک کنم»
            </Chip>
            <Chip tone="border-rose-300/30 text-rose-100" className="-left-2 top-[46%] lg:-left-10">
                صادرات؟ بعداً…
            </Chip>

            <div className="absolute -bottom-7 left-1/2 z-20 w-[92%] -translate-x-1/2 lg:w-[96%]">
                <div data-in className={panel} dir="rtl">
                    <p className="mb-2 text-[10.5px] font-semibold text-white">وقت و ذهن مدیر کجا خرج می‌شه؟</p>
                    <div className="space-y-2">
                        <div>
                            <div className="mb-1 text-[9px] text-slate-300">درگیر جزئیات و فرایندها</div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                                <div data-bar className="h-full w-[82%] origin-right rounded-full bg-gradient-to-l from-amber-400 to-rose-500" />
                            </div>
                        </div>
                        <div>
                            <div className="mb-1 text-[9px] text-slate-300">رشد، خلاقیت، صادرات</div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                                <div data-bar className="h-full w-[18%] origin-right rounded-full bg-gradient-to-l from-emerald-300 to-teal-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const hiddenCosts = ["کالای راکد", "خرید تکراری", "ساعت‌های هدررفته", "فروش از دست‌رفته"];

function HiddenCostVisual() {
    return (
        <div className={frameSize}>
            <div className="pointer-events-none absolute -inset-12 bg-[radial-gradient(closest-side,rgba(244,63,94,0.2),transparent)]" />

            <Frame border="bg-gradient-to-b from-violet-300/40 via-white/10 to-rose-400/50" outer="rounded-[2.5rem]" inner="rounded-[calc(2.5rem-1px)]">
                <FrameImage src="/3-3.webp" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[54%] bg-gradient-to-t from-[#08070d] via-[#08070d]/85 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 top-[46%] border-t border-dashed border-white/40" />
                <span className="absolute right-5 top-[46%] -translate-y-full pb-1 text-[10px] text-slate-200">آنچه می‌بینی</span>
                <span className="absolute right-5 top-[46%] pt-1 text-[10px] text-rose-200/80">آنچه نمی‌بینی</span>

                <div className="absolute left-[34%] top-[72%] h-0 w-0">
                    <span data-pulse className="absolute -left-4 -top-4 h-8 w-8 rounded-full border border-rose-300/70" />
                    <span data-pulse className="absolute -left-4 -top-4 h-8 w-8 rounded-full border border-rose-300/50" />
                    <span data-pop className="absolute -left-2 -top-2 block h-4 w-4 rounded-full bg-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.9)]" />
                </div>
            </Frame>

            <Chip tone="border-rose-300/30 text-rose-100" className="left-[42%] top-[62%]">
                گلوگاه کجاست؟
            </Chip>

            <div className="absolute -bottom-7 -right-3 z-20 w-[72%] lg:-right-12 lg:w-[76%]">
                <div data-in className={panel} dir="rtl">
                    <p className="mb-2 text-[10.5px] font-semibold text-white">ردیف‌هایی که توی گزارش مالی نیست</p>
                    <ul className="space-y-1.5">
                        {hiddenCosts.map(label => (
                            <li key={label} className="flex items-center justify-between text-[10px] text-slate-300">
                                <span>{label}</span>
                                <span className="select-none font-bold tabular-nums text-rose-300 blur-[4px]">۸۸٬۸۸۸٬۰۰۰</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

type Step = {
    key: string;
    index: string;
    badge: string;
    title: string;
    body: string;
    punch: string;
    flip: boolean;
    indexTone: string;
    titleGradient: string;
    accent: string;
    glow: string;
    visual: ReactNode;
};

const steps: Step[] = [
    {
        key: "inventory",
        index: "پله‌ی اول",
        badge: "انبارگردانی",
        title: "انبار رو می‌شمری، ولی دو هفته بعد دوباره همون آشفتگی",
        body: "اگه صاحب کسب‌وکار باشی، حتماً این صحنه رو دیدی یا خودت درگیرش بودی: سالی دو بار انبارگردانی می‌کنن، همه خسته و راضی‌ان که تموم شد. ولی یک تا دو هفته بعد؟ قفسه‌ها قاطی، انباردارِ آشفته و بی‌خبر، و هیچ‌کس دقیق نمی‌دونه چی کجاست.",
        punch: "مشکل شمردن نبود. مشکل اینه که بعدش هیچ سیستمی موجودی رو زنده نگه نمی‌داره.",
        flip: false,
        indexTone: "bg-sky-400/15 text-sky-200",
        titleGradient: "from-sky-200 via-indigo-200 to-violet-300",
        accent: "from-sky-300 to-indigo-400",
        glow: "bg-[radial-gradient(closest-side,rgba(56,189,248,0.13),transparent)]",
        visual: <InventoryVisual />,
    },
    {
        key: "management",
        index: "پله‌ی دوم",
        badge: "مدیریت",
        title: "تو مدیری، نه نگهبانِ تک‌تک پله‌های کار",
        body: "مسئولیت‌پذیریِ بالات باعث شده حواست به همه‌چیز باشه؛ حتی جاهایی که اصلاً لازم نیست. در حالی که جای تو پای فکر کردن به رشد، خلاقیت و حتی صادراته، نه گیر کردن توی فرایندهایی که کارمندها باید خودشون بچرخونن و نگران موندنشون باشی.",
        punch: "این در حق خودت و کسب‌وکارت ظلمه: وقتِ مدیر باید خرجِ آینده بشه، نه خرجِ دنبال کردن روزمرگی.",
        flip: true,
        indexTone: "bg-amber-400/15 text-amber-200",
        titleGradient: "from-amber-200 via-orange-200 to-rose-300",
        accent: "from-amber-300 to-rose-400",
        glow: "bg-[radial-gradient(closest-side,rgba(251,146,60,0.13),transparent)]",
        visual: <ManagerVisual />,
    },
    {
        key: "hidden-costs",
        index: "پله‌ی سوم",
        badge: "هزینه‌های پنهان",
        title: "تا حالا به هزینه‌های پنهانت فکر کردی؟",
        body: "کالای راکد، خریدِ تکراری، ساعت‌های هدررفته، فروشی که چون جنس پیدا نشد از دست رفت… هیچ‌کدوم توی گزارش مالیت یه ردیف جدا ندارن، ولی هر ماه بی‌صدا از سودت کم می‌کنن.",
        punch: "می‌دونی گلوگاهِ این هزینه‌ها دقیقاً کجاست؟ تا ندیدیش، نمی‌تونی ببندیش.",
        flip: false,
        indexTone: "bg-rose-400/15 text-rose-200",
        titleGradient: "from-rose-200 via-fuchsia-200 to-violet-300",
        accent: "from-rose-300 to-fuchsia-400",
        glow: "bg-[radial-gradient(closest-side,rgba(244,63,94,0.13),transparent)]",
        visual: <HiddenCostVisual />,
    },
];

export default function HomePainPoints() {
    const sectionRef = useRef<HTMLElement>(null);
    const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const stepRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const isAnimatingRef = useRef(false);
    const activeStepRef = useRef(0);

    useEffect(() => {
        let io: IntersectionObserver | undefined;

        const ctx = gsap.context(() => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            const stages = stageRefs.current.filter(Boolean) as HTMLDivElement[];
            if (stages.length !== 3) return;

            const ambient = stages.map(stage => {
                const tweens: gsap.core.Tween[] = [];
                stage.querySelectorAll<HTMLElement>("[data-scan]").forEach(el => {
                    tweens.push(gsap.fromTo(el, { yPercent: -100 }, { yPercent: 360, duration: 2.8, ease: "power1.inOut", repeat: -1, repeatDelay: 0.8, paused: true }));
                });
                const pulses = stage.querySelectorAll<HTMLElement>("[data-pulse]");
                if (pulses.length) {
                    tweens.push(gsap.fromTo(pulses, { scale: 0.6, opacity: 0.8 }, { scale: 2.4, opacity: 0, duration: 1.9, ease: "power2.out", repeat: -1, stagger: 0.6, paused: true }));
                }
                stage.querySelectorAll<HTMLElement>("[data-float]").forEach((el, i) => {
                    tweens.push(gsap.to(el, { y: i % 2 === 0 ? -6 : 6, duration: 2.8 + i * 0.3, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true }));
                });
                return tweens;
            });

            const visible = [false, false, false];

            const sync = () => {
                const desktop = window.matchMedia("(min-width: 1024px)").matches;
                ambient.forEach((tweens, i) => {
                    const run = visible[i] && (!desktop || i === activeStepRef.current);
                    tweens.forEach(tween => {
                        if (run) tween.play();
                        else tween.pause();
                    });
                });
            };

            io = new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        const index = stages.indexOf(entry.target as HTMLDivElement);
                        if (index > -1) visible[index] = entry.isIntersecting;
                    });
                    sync();
                },
                { rootMargin: "80px" },
            );
            stages.forEach(stage => io?.observe(stage));

            const addInner = (tl: gsap.core.Timeline, stage: HTMLElement, at: number) => {
                const add = (selector: string, from: gsap.TweenVars, to: gsap.TweenVars, offset: number) => {
                    const targets = stage.querySelectorAll<HTMLElement>(selector);
                    if (targets.length) tl.fromTo(targets, from, to, at + offset);
                };
                add("[data-in]", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }, 0);
                add("[data-draw]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" }, 0.5);
                add("[data-bar]", { scaleX: 0 }, { scaleX: 1, duration: 1.2, stagger: 0.2, ease: "power3.out" }, 0.6);
                add("[data-pop]", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(2)" }, 0.9);
            };

            const mm = gsap.matchMedia();

            mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
                const section = sectionRef.current;
                if (!section) return;

                const setStep = (index: number) => {
                    activeStepRef.current = index;
                    stepRefs.current.forEach((el, i) => {
                        if (el) gsap.to(el, { opacity: i === index ? 1 : 0.25, scaleY: i === index ? 1.2 : 0.4, scaleX: i === index ? 1.5 : 1, duration: 0.4, ease: "power3.out", overwrite: true });
                    });
                    sync();
                };
                setStep(0);

                gsap.set([stages[1], stages[2]], { autoAlpha: 0 });

                const tl = gsap.timeline({
                    defaults: { ease: "power2.inOut" },
                    scrollTrigger: {
                        trigger: section,
                        start: `top top+=${HEADER_OFFSET}`,
                        end: () => `+=${Math.round(window.innerHeight * 2.6)}`,
                        pin: true,
                        scrub: 0.5,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        onUpdate: self => {
                            const t = self.progress * TOTAL;
                            const index = t < 3.4 ? 0 : t < 7.9 ? 1 : 2;
                            if (index !== activeStepRef.current && !isAnimatingRef.current) setStep(index);
                        },
                    },
                });

                tl.addLabel("s1", LABELS.s1).addLabel("s2", LABELS.s2).addLabel("s3", LABELS.s3);

                const intro = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 78%", once: true } });
                addInner(intro, stages[0], 0.1);

                [2.2, 6.8].forEach((t, i) => {
                    tl.to(stages[i], { autoAlpha: 0, y: -30, duration: 1.6 }, t)
                        .fromTo(stages[i + 1], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.6, immediateRender: false }, t + 0.6);
                    addInner(tl, stages[i + 1], t + 0.8);
                });

                tl.to({}, { duration: TOTAL - LABELS.s3 });

                const trigger = tl.scrollTrigger;
                let debounceTimer: ReturnType<typeof setTimeout> | undefined;

                const onWheel = (event: WheelEvent) => {
                    if (!trigger) return;

                    const y = window.scrollY;
                    if (y < trigger.start - 2 || y > trigger.end + 2) return;

                    if (isAnimatingRef.current) {
                        event.preventDefault();
                        return;
                    }

                    if (Math.abs(event.deltaY) < 14) return;

                    const nextStep = activeStepRef.current + Math.sign(event.deltaY);
                    if (nextStep < 0 || nextStep > 2) return;

                    event.preventDefault();

                    isAnimatingRef.current = true;
                    setStep(nextStep);

                    const label = (["s1", "s2", "s3"] as const)[nextStep];
                    const targetProgress = LABELS[label] / TOTAL;
                    const targetY = trigger.start + targetProgress * (trigger.end - trigger.start);

                    const scrollObj = { y: window.scrollY };
                    gsap.to(scrollObj, {
                        y: targetY,
                        duration: 0.9,
                        ease: "power2.inOut",
                        onUpdate: () => window.scrollTo({ top: scrollObj.y, left: 0, behavior: "instant" as ScrollBehavior }),
                        onComplete: () => {
                            if (debounceTimer) clearTimeout(debounceTimer);
                            debounceTimer = setTimeout(() => {
                                isAnimatingRef.current = false;
                            }, 250);
                        },
                    });
                };

                section.addEventListener("wheel", onWheel, { passive: false });
                return () => {
                    section.removeEventListener("wheel", onWheel);
                    if (debounceTimer) clearTimeout(debounceTimer);
                };
            });

            mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
                stages.forEach(stage => {
                    const tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: "top 82%", once: true } });
                    addInner(tl, stage, 0);
                });
                sync();
            });
        }, sectionRef);

        let cancelled = false;
        document.fonts?.ready.then(() => {
            if (!cancelled) ScrollTrigger.refresh();
        });

        return () => {
            cancelled = true;
            io?.disconnect();
            ctx.revert();
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative px-4 py-20 sm:px-6 lg:px-8 motion-safe:lg:h-[calc(100svh-86px)] motion-safe:lg:py-0">
            <div className="relative mx-auto w-full max-w-6xl space-y-32 pb-10 motion-safe:lg:h-full motion-safe:lg:space-y-0 motion-safe:lg:pb-0">
                {steps.map((step, i) => (
                    <div
                        key={step.key}
                        ref={el => {
                            stageRefs.current[i] = el;
                        }}
                        className="relative motion-safe:lg:absolute motion-safe:lg:inset-0 motion-safe:lg:flex motion-safe:lg:items-center motion-safe:lg:will-change-[transform,opacity]"
                    >
                        <div className={cn("pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-y-1/2", step.glow, step.flip ? "translate-x-[-10%]" : "-translate-x-[90%]")} />

                        <div dir="ltr" className="relative grid w-full items-center gap-16 lg:grid-cols-2 lg:gap-16">
                            <div className={cn("flex w-full justify-center pb-8 lg:pb-6", step.flip ? "lg:order-2 lg:justify-end" : "lg:order-1 lg:justify-start")}>{step.visual}</div>

                            <div dir="rtl" className={cn("order-first flex w-full justify-center lg:justify-start", step.flip ? "lg:order-1" : "lg:order-2")}>
                                <div className="flex max-w-lg flex-col items-center text-center lg:items-start lg:text-right">
                                    <div data-in className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-3.5 pr-1 text-xs font-medium text-slate-300">
                                        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold", step.indexTone)}>{step.index}</span>
                                        {step.badge}
                                    </div>
                                    <h2 data-in className={cn("bg-gradient-to-l bg-clip-text text-3xl font-black leading-[1.55] text-transparent sm:text-4xl lg:text-[2.5rem]", step.titleGradient)}>
                                        {step.title}
                                    </h2>
                                    <p data-in className="mt-5 text-sm leading-8 text-slate-400 sm:text-base">
                                        {step.body}
                                    </p>
                                    <div data-in className="relative mt-6 w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-4 pr-5 text-right">
                                        <span className={cn("absolute bottom-3 right-0 top-3 w-[3px] rounded-full bg-gradient-to-b", step.accent)} />
                                        <p className="text-sm font-semibold leading-8 text-slate-100 sm:text-base">{step.punch}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-2.5 motion-safe:lg:flex xl:right-8">
                {[0, 1, 2].map(i => (
                    <span
                        key={i}
                        ref={el => {
                            stepRefs.current[i] = el;
                        }}
                        className="h-8 w-[3px] rounded-full bg-gradient-to-b from-sky-300 to-violet-400 opacity-25"
                    />
                ))}
            </div>
        </section>
    );
}