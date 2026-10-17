"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
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

const panel = "rounded-2xl border border-white/10 bg-[#0d0c18]/95 p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)]";

const spotlight =
    "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(260px_circle_at_var(--mx)_var(--my),rgba(255,255,255,0.12),transparent_65%)]";

function Chip({ children, className, tone }: { children: ReactNode; className?: string; tone: string }) {
    return (
        <div data-float className={cn("absolute z-20", className)}>
            <div data-in className={cn("flex items-center gap-2 rounded-full border bg-[#0d0c18]/95 px-3 py-1.5 text-[11px] font-medium shadow-[0_8px_20px_rgba(0,0,0,0.35)]", tone)} dir="rtl">
                {children}
            </div>
        </div>
    );
}

function Frame({ ring, outer, inner, children }: { ring: string; outer: string; inner: string; children: ReactNode }) {
    return (
        <div data-in data-spot className={cn("group relative h-full w-full p-px [--mx:50%] [--my:50%]", outer, ring)}>
            <div className={cn("relative h-full w-full overflow-hidden bg-[#0b0a14]", inner)}>
                {children}
                <div className={spotlight} />
            </div>
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

const decay = [100, 94, 86, 77, 68, 60, 53, 47, 42, 38, 35, 32, 30, 28];

function InventoryVisual() {
    return (
        <div className={frameSize}>
            <div className="pointer-events-none absolute -inset-14 bg-[radial-gradient(closest-side,rgba(56,189,248,0.2),transparent)]" />

            <Frame ring="bg-gradient-to-br from-sky-300/60 via-white/10 to-violet-400/40" outer="rounded-[2rem]" inner="rounded-[calc(2rem-1px)]">
                <FrameImage src="/1-1.webp" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0a14] via-transparent to-transparent" />
                <div data-scan className="pointer-events-none absolute inset-x-0 top-0 h-[28%] border-b border-sky-300/70 bg-gradient-to-b from-transparent to-sky-400/20" />
                <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-sky-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                    اسکن انبار
                </div>
            </Frame>

            <Chip tone="border-sky-300/30 text-sky-100" className="-left-3 top-14 lg:-left-10">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                شمارش کامل انبار
            </Chip>

            <div className="absolute -bottom-7 -right-3 z-20 w-[86%] lg:-right-12 lg:w-[90%]">
                <div data-in className={panel} dir="rtl">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-white">دقت موجودی بعد از انبارگردانی</span>
                    </div>
                    <div className="flex h-14 items-end gap-1">
                        {decay.map((height, i) => (
                            <span
                                key={i}
                                data-col
                                style={{ height: `${height}%` }}
                                className={cn("block flex-1 origin-bottom rounded-[3px]", i < 4 ? "bg-sky-300" : i < 9 ? "bg-violet-400" : "bg-rose-400")}
                            />
                        ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[9.5px] text-slate-400">
                        <span>روز شمارش</span>
                        <span>یک تا دو هفته بعد</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const tasks = [
    { label: "تأیید خرید قفسه‌ی ۳", tag: "فوری", tone: "bg-amber-400/15 text-amber-200" },
    { label: "پیگیری گزارش انباردار", tag: "امروز", tone: "bg-rose-400/15 text-rose-200" },
    { label: "چک دستی موجودی کالاها", tag: "باز", tone: "bg-sky-400/15 text-sky-200" },
];

function ManagerVisual() {
    return (
        <div className={frameSize}>
            <div className="pointer-events-none absolute -inset-14 bg-[radial-gradient(closest-side,rgba(251,146,60,0.2),transparent)]" />
            <div className="pointer-events-none absolute -inset-4 rounded-t-[999px] rounded-b-[2.5rem] border border-dashed border-amber-300/25" />

            <Frame ring="bg-gradient-to-b from-amber-300/60 via-white/10 to-rose-400/40" outer="rounded-t-[999px] rounded-b-[2rem]" inner="rounded-t-[999px] rounded-b-[calc(2rem-1px)]">
                <FrameImage src="/2-2.webp" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0a14] via-transparent to-transparent" />
            </Frame>

            <Chip tone="border-amber-300/30 text-amber-100" className="-right-2 top-24 lg:-right-10">
                «فقط خودم می‌تونم چک کنم»
            </Chip>

            <div className="absolute -bottom-7 left-1/2 z-20 w-[94%] -translate-x-1/2 lg:w-[98%]">
                <div data-in className={panel} dir="rtl">
                    <p className="mb-2.5 text-[11px] font-semibold text-white">صف کارهای مدیر</p>
                    <div className="space-y-1.5">
                        {tasks.map(task => (
                            <div key={task.label} data-row className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.04] px-2.5 py-2">
                                <div className="flex items-center gap-2">
                                    <span className="h-3.5 w-3.5 rounded-full border border-amber-300/60" />
                                    <span className="text-[10.5px] text-slate-200">{task.label}</span>
                                </div>
                                <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-semibold", task.tone)}>{task.tag}</span>
                            </div>
                        ))}
                        <div data-row className="flex items-center justify-between rounded-xl border border-dashed border-white/15 px-2.5 py-2 opacity-60">
                            <div className="flex items-center gap-2">
                                <Lock size={12} className="text-slate-400" />
                                <span className="text-[10.5px] text-slate-300">طرح توسعه و صادرات</span>
                            </div>
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold text-slate-300">منتظر وقت</span>
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
            <div className="pointer-events-none absolute -inset-14 bg-[radial-gradient(closest-side,rgba(244,63,94,0.2),transparent)]" />

            <Frame ring="bg-gradient-to-b from-violet-300/50 via-white/10 to-rose-400/60" outer="rounded-[2.5rem]" inner="rounded-[calc(2.5rem-1px)]">
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

            <div className="absolute -bottom-7 -right-3 z-20 w-[74%] lg:-right-12 lg:w-[78%]">
                <div data-in className={panel} dir="rtl">
                    <p className="mb-2.5 text-[11px] font-semibold text-white">ردیف‌هایی که توی گزارش مالی نیست</p>
                    <ul className="space-y-1.5">
                        {hiddenCosts.map(label => (
                            <li key={label} data-row className="flex items-center justify-between text-[10.5px] text-slate-300">
                                <span>{label}</span>
                                <span className="select-none font-bold tabular-nums text-rose-300 blur-[4px]">۸۸٬۸۸۸٬۰۰۰</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2.5">
                        <span className="text-[10.5px] font-semibold text-white">مجموع واقعی</span>
                        <span className="text-base font-black text-rose-300">؟</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

type Step = {
    key: string;
    num: string;
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
        num: "۰۱",
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
        num: "۰۲",
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
        num: "۰۳",
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
    const railRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const fillRef = useRef<HTMLSpanElement>(null);
    const goToRef = useRef<((index: number) => void) | null>(null);
    const isAnimatingRef = useRef(false);
    const activeStepRef = useRef(0);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        let frame = 0;
        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse" || frame) return;
            const target = (event.target as HTMLElement).closest<HTMLElement>("[data-spot]");
            if (!target) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                const rect = target.getBoundingClientRect();
                target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
                target.style.setProperty("--my", `${event.clientY - rect.top}px`);
            });
        };
        section.addEventListener("pointermove", onPointerMove, { passive: true });

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
                add("[data-col]", { scaleY: 0 }, { scaleY: 1, duration: 0.7, stagger: 0.04, ease: "power3.out" }, 0.6);
                add("[data-row]", { x: 28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" }, 0.7);
                add("[data-pop]", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(2)" }, 0.9);
            };

            const mm = gsap.matchMedia();

            mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
                const setStep = (index: number) => {
                    activeStepRef.current = index;
                    railRefs.current.forEach((el, i) => {
                        if (!el) return;
                        const active = i === index;
                        const dot = el.querySelector<HTMLElement>("[data-dot]");
                        gsap.to(el, { opacity: active ? 1 : 0.4, duration: 0.4, overwrite: true });
                        if (dot) gsap.to(dot, { scale: active ? 1.35 : 1, backgroundColor: active ? "#7dd3fc" : "#08070d", duration: 0.4, overwrite: true });
                    });
                    sync();
                };
                setStep(0);

                gsap.set([stages[1], stages[2]], { autoAlpha: 0 });
                gsap.set(fillRef.current, { scaleY: 0, transformOrigin: "50% 0%" });
                const setFill = gsap.quickSetter(fillRef.current, "scaleY");

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
                            setFill(self.progress);
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

                const snapTo = (nextStep: number) => {
                    if (!trigger || isAnimatingRef.current || nextStep === activeStepRef.current) return;

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

                goToRef.current = snapTo;

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
                    snapTo(nextStep);
                };

                section.addEventListener("wheel", onWheel, { passive: false });
                return () => {
                    goToRef.current = null;
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
            if (frame) cancelAnimationFrame(frame);
            section.removeEventListener("pointermove", onPointerMove);
            io?.disconnect();
            ctx.revert();
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative px-4 py-20 sm:px-6 lg:px-8 motion-safe:lg:h-[calc(100svh-86px)] motion-safe:lg:py-0">
            <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_50%,black,transparent)]" />

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
                                <div className="relative flex max-w-lg flex-col items-center text-center lg:items-start lg:text-right">
                                    <span className="pointer-events-none absolute -top-16 right-1/2 translate-x-1/2 select-none text-[9rem] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.09)] lg:-top-24 lg:right-0 lg:translate-x-0 lg:text-[12rem]">
                                        {step.num}
                                    </span>

                                    <div data-in className="relative mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-3.5 pr-1 text-xs font-medium text-slate-300">
                                        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold", step.indexTone)}>{step.index}</span>
                                        {step.badge}
                                    </div>
                                    <h2 data-in className={cn("relative bg-gradient-to-l bg-clip-text text-3xl font-black leading-[1.55] text-transparent sm:text-4xl lg:text-[2.5rem]", step.titleGradient)}>
                                        {step.title}
                                    </h2>
                                    <p data-in className="relative mt-5 text-sm leading-8 text-slate-400 sm:text-base">
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

            <div dir="rtl" className="absolute right-4 top-1/2 hidden -translate-y-1/2 motion-safe:lg:block xl:right-8">
                <div className="relative flex flex-col gap-7">
                    <span className="absolute bottom-2 right-[5px] top-2 w-px bg-white/10" />
                    <span ref={fillRef} className="absolute right-[5px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-sky-300 to-violet-400" />
                    {steps.map((step, i) => (
                        <button
                            key={step.key}
                            type="button"
                            aria-label={step.badge}
                            ref={el => {
                                railRefs.current[i] = el;
                            }}
                            onClick={() => goToRef.current?.(i)}
                            className="relative flex items-center gap-3 opacity-40"
                        >
                            <span data-dot className="relative z-10 h-[11px] w-[11px] rounded-full border border-white/40 bg-[#08070d]" />
                            <span className="hidden text-[11px] font-medium text-slate-300 2xl:block">{step.badge}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}