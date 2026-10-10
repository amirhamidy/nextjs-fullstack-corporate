"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { glassSurface } from "@/components/home/glass";

type TimeRange = "weekly" | "monthly" | "yearly";

type DeptIssues = {
    stage: string;
    issues: number;
};

type SalesIssuesChartData = Record<TimeRange, DeptIssues[]>;

type BarRect = {
    left: number;
    top: number;
    width: number;
    height: number;
};

type ActiveBar = {
    stage: string;
    issues: number;
    color: string;
    glow: string;
    index: number;
    isEmpty: boolean;
    rect: BarRect | null;
};

const ranges: { key: TimeRange; label: string; sub: string }[] = [
    { key: "weekly", label: "هفتگی", sub: "هفته اخیر" },
    { key: "monthly", label: "ماهانه", sub: "ماه اخیر" },
    { key: "yearly", label: "سالانه", sub: "سال اخیر" },
];

const BAR_COLORS = [
    { color: "#ff4f68", glow: "rgba(255,79,104,0.72)" },
    { color: "#29b6f6", glow: "rgba(41,182,246,0.72)" },
    { color: "#2ee6a6", glow: "rgba(46,230,166,0.72)" },
    { color: "#a66cff", glow: "rgba(166,108,255,0.72)" },
    { color: "#aebdce", glow: "rgba(174,189,206,0.68)" },
    { color: "#ffd34d", glow: "rgba(255,211,77,0.72)" },
    { color: "#ff8a3d", glow: "rgba(255,138,61,0.72)" },
];

const STATIC_DEFS_LIGHT = (
    <defs>
        {BAR_COLORS.map((meta, i) => (
            <linearGradient
                key={i}
                id={`barGrad-${i}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
            >
                <stop offset="0%" stopColor={meta.color} stopOpacity={1} />
                <stop offset="42%" stopColor={meta.color} stopOpacity={0.72} />
                <stop offset="100%" stopColor={meta.color} stopOpacity={0.12} />
            </linearGradient>
        ))}
    </defs>
);

const STATIC_DEFS_DARK = (
    <defs>
        {BAR_COLORS.map((meta, i) => (
            <linearGradient
                key={i}
                id={`barGrad-${i}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
            >
                <stop offset="0%" stopColor={meta.color} stopOpacity={1} />
                <stop offset="42%" stopColor={meta.color} stopOpacity={0.62} />
                <stop offset="100%" stopColor={meta.color} stopOpacity={0.08} />
            </linearGradient>
        ))}
    </defs>
);

const GLASS_STYLES = {
    root: glassSurface,
    pad: "p-3",
    header: "mb-2 flex flex-col items-stretch gap-1.5",
    titleSize: "text-[10.5px]",
    subSize: "text-[9px]",
    btn: "px-1.5 py-0.5 text-[9px]",
    toggleSize: "gap-0.5 p-0.5 self-start",
    tipPos: "absolute left-2 top-[78px] z-20 min-w-[118px]",
    tipPad: "px-2 py-1.5",
    tipNameSize: "text-[10px]",
    tipTextSize: "text-[9px]",
    title: "text-white",
    sub: "text-slate-300",
    toggleWrap: "border-white/10 bg-white/5",
    indicator: "bg-white/15",
    active: "text-white",
    inactive: "text-slate-300",
    tooltip: "border-white/15 bg-slate-950/85",
    tipName: "text-white",
    tipText: "text-slate-300",
    tipBar: "bg-white/10",
    empty: "text-slate-400",
    yTick: "[&_text]:fill-slate-300",
    xTick: "#cbd5e1",
    grid: "rgba(255,255,255,0.08)",
    tickSize: 8,
    yTickSize: 9,
    xHeight: 32,
    margin: { top: 4, right: 2, left: -26, bottom: 2 },
    gap: "14%",
};

const DEFAULT_STYLES = {
    root: "border-gray-200 bg-white shadow-sm dark:border-white/8 dark:bg-slate-950",
    pad: "p-4",
    header: "mb-3 flex items-start justify-between gap-3",
    titleSize: "text-[14px]",
    subSize: "text-[13px]",
    btn: "px-2.5 py-1 text-[11px]",
    toggleSize: "gap-1 p-1",
    tipPos: "absolute left-2 top-14 z-20 min-w-[150px]",
    tipPad: "px-3 py-2",
    tipNameSize: "text-[12px]",
    tipTextSize: "text-[11px]",
    title: "text-gray-900 dark:text-white",
    sub: "text-gray-500 dark:text-gray-400",
    toggleWrap:
        "border-gray-200 bg-gray-50 dark:border-white/5 dark:bg-slate-900/50",
    indicator: "bg-white shadow-sm dark:bg-slate-800",
    active: "text-gray-900 dark:text-white",
    inactive: "text-gray-500 dark:text-gray-400",
    tooltip:
        "border-gray-200/60 bg-white/95 dark:border-white/10 dark:bg-slate-900/95",
    tipName: "text-gray-800 dark:text-gray-100",
    tipText: "text-gray-500 dark:text-gray-400",
    tipBar: "bg-gray-100 dark:bg-slate-800",
    empty: "text-gray-400 dark:text-gray-500",
    yTick: "[&_text]:fill-gray-400 dark:[&_text]:fill-gray-500",
    xTick: "#64748b",
    grid: "#e2e8f0",
    tickSize: 11,
    yTickSize: 11,
    xHeight: 28,
    margin: { top: 8, right: 4, left: -24, bottom: 8 },
    gap: "20%",
};

function CustomBarShape({
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    index = 0,
    activeIndex,
    hoverKey,
    isEmptyMap,
}: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    index?: number;
    activeIndex: number | null;
    hoverKey: number;
    isEmptyMap: boolean[];
}) {
    if (width <= 0 || height <= 0) return null;

    const isActive = activeIndex === index;
    const isEmpty = isEmptyMap[index] ?? false;
    const meta = BAR_COLORS[index % BAR_COLORS.length];
    const radius = Math.min(6, width / 2);

    return (
        <motion.g
            key={`${index}-${hoverKey}`}
            animate={isActive ? { scale: [1, 0.96, 1] } : { scale: 1 }}
            transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{
                transformOrigin: `${x + width / 2}px ${y + height}px`,
            }}
        >
            {isActive && (
                <rect
                    x={x - 3}
                    y={y - 3}
                    width={width + 6}
                    height={height + 3}
                    rx={radius + 2}
                    fill={meta.color}
                    opacity={0.18}
                />
            )}

            <path
                d={`M ${x},${y + height} L ${x},${y + radius} Q ${x},${y} ${x + radius
                    },${y} L ${x + width - radius},${y} Q ${x + width},${y} ${x + width
                    },${y + radius} L ${x + width},${y + height} Z`}
                fill={`url(#barGrad-${index % BAR_COLORS.length})`}
                opacity={isEmpty ? 0.35 : 1}
                style={{
                    filter: isActive
                        ? `drop-shadow(0 0 11px ${meta.glow})`
                        : "none",
                    transition: "filter 0.2s ease, opacity 0.2s ease",
                }}
            />

            <rect
                x={x + 1}
                y={y}
                width={Math.max(width - 2, 0)}
                height={Math.min(height, 10)}
                rx={radius}
                fill="white"
                opacity={isActive ? 0.2 : 0.1}
                style={{ transition: "opacity 0.2s ease" }}
            />
        </motion.g>
    );
}

function CustomXAxisTick({
    x,
    y,
    payload,
    fill,
    size,
    split,
}: {
    x?: number;
    y?: number;
    payload?: { value: string };
    fill: string;
    size: number;
    split: boolean;
}) {
    if (!payload?.value || x === undefined || y === undefined) return null;

    const lines = split ? payload.value.split(" ") : [payload.value];

    return (
        <text
            x={x}
            y={y + size + 3}
            textAnchor="middle"
            fontSize={size}
            fontWeight={500}
            fill={fill}
        >
            {lines.map((line, i) => (
                <tspan
                    key={i}
                    x={x}
                    dy={i === 0 ? 0 : size + 1}
                >
                    {line}
                </tspan>
            ))}
        </text>
    );
}

const MAX_PARTICLES = 22;

function ParticleField({
    rect,
    color,
    intensity,
    isDark,
}: {
    rect: BarRect;
    color: string;
    intensity: number;
    isDark: boolean;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas || rect.width <= 0 || rect.height <= 0) {
            return;
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        const prefersReduced =
            typeof window !== "undefined" &&
            !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const clampedIntensity = Math.min(
            Math.max(intensity, 0),
            1,
        );

        if (prefersReduced) {
            ctx.clearRect(0, 0, rect.width, rect.height);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.1 + clampedIntensity * 0.08;
            ctx.fillRect(0, rect.height - 10, rect.width, 10);
            return;
        }

        type Particle = {
            x: number;
            y: number;
            vx: number;
            vy: number;
            r: number;
            life: number;
            maxLife: number;
        };

        const particles: Particle[] = [];
        const spawnEveryFrame = Math.max(
            2,
            Math.round(9 - clampedIntensity * 6),
        );
        const speedBase = 22 + clampedIntensity * 55;

        let frame = 0;
        let lastTime = performance.now();
        let rafId = 0;
        let stopped = false;

        const spawn = () => {
            if (particles.length >= MAX_PARTICLES) {
                return;
            }

            particles.push({
                x: Math.random() * rect.width,
                y: rect.height + 2,
                vy: -(speedBase * (0.7 + Math.random() * 0.6)),
                vx: (Math.random() - 0.5) * 12,
                r: 1 + Math.random() * 1.5,
                life: 0,
                maxLife: 0.9 + Math.random() * 0.7,
            });
        };

        const tick = (now: number) => {
            if (stopped) {
                return;
            }

            const dt = Math.min(
                (now - lastTime) / 1000,
                0.05,
            );

            lastTime = now;
            frame += 1;

            if (frame % spawnEveryFrame === 0) {
                spawn();
            }

            ctx.clearRect(
                0,
                0,
                rect.width,
                rect.height,
            );

            for (let i = particles.length - 1; i >= 0; i -= 1) {
                const p = particles[i];

                p.life += dt;
                p.x += p.vx * dt;
                p.y += p.vy * dt;

                const t = p.life / p.maxLife;

                if (t >= 1 || p.y < -4) {
                    particles.splice(i, 1);
                    continue;
                }

                const alpha =
                    t < 0.15
                        ? t / 0.15
                        : 1 - (t - 0.15) / 0.85;

                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.globalAlpha =
                    Math.max(0, alpha) *
                    (isDark ? 1 : 0.85);

                ctx.arc(
                    p.x,
                    p.y,
                    p.r,
                    0,
                    Math.PI * 2,
                );

                ctx.fill();
            }

            rafId = requestAnimationFrame(tick);
        };

        const handleVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(rafId);
            } else {
                lastTime = performance.now();
                rafId = requestAnimationFrame(tick);
            }
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibility,
        );

        rafId = requestAnimationFrame(tick);

        return () => {
            stopped = true;
            document.removeEventListener(
                "visibilitychange",
                handleVisibility,
            );
            cancelAnimationFrame(rafId);
            ctx.clearRect(
                0,
                0,
                rect.width,
                rect.height,
            );
        };
    }, [
        rect.width,
        rect.height,
        color,
        intensity,
        isDark,
    ]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute"
            style={{
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
            }}
        />
    );
}

export default function SalesIssuesChart({
    data: chartData,
    variant = "default",
    className,
}: {
    data: SalesIssuesChartData;
    variant?: "default" | "glass";
    className?: string;
}) {
    const [activeRange, setActiveRange] =
        useState<TimeRange>("monthly");

    const [activeBar, setActiveBar] =
        useState<ActiveBar | null>(null);

    const [hoverKey, setHoverKey] =
        useState(0);

    const { resolvedTheme } = useTheme();

    const glass = variant === "glass";
    const isDark = glass || resolvedTheme === "dark";
    const s = glass ? GLASS_STYLES : DEFAULT_STYLES;

    const chartWrapperRef =
        useRef<HTMLDivElement | null>(null);

    const allDepartments = useMemo(() => {
        const seen = new Set<string>();

        Object.values(chartData).forEach(
            (rangeData) => {
                rangeData.forEach((item) =>
                    seen.add(item.stage),
                );
            },
        );

        return Array.from(seen);
    }, [chartData]);

    const data = useMemo(() => {
        const current =
            chartData[activeRange];

        const map = new Map(
            current.map((item) => [
                item.stage,
                item.issues,
            ]),
        );

        return allDepartments.map(
            (stage) => ({
                stage,
                issues: map.get(stage) ?? 0,
            }),
        );
    }, [
        chartData,
        activeRange,
        allDepartments,
    ]);

    useEffect(() => {
        setActiveBar(null);
    }, [activeRange]);

    const currentRange = useMemo(
        () =>
            ranges.find(
                (r) => r.key === activeRange,
            ),
        [activeRange],
    );

    const formattedIssues = useMemo(
        () =>
            activeBar
                ? activeBar.issues.toLocaleString(
                    "fa-IR",
                )
                : null,
        [activeBar],
    );

    const maxValue = useMemo(
        () =>
            Math.max(
                ...data.map(
                    (d) => d.issues,
                ),
                1,
            ),
        [data],
    );

    const displayData = useMemo(
        () =>
            data.map((item) => ({
                ...item,
                plotValue: maxValue,
            })),
        [data, maxValue],
    );

    const isEmptyMap = useMemo(
        () =>
            data.map(
                (d) => d.issues === 0,
            ),
        [data],
    );

    const handleMouseEnter =
        useCallback(
            (
                _entry: unknown,
                index: number,
                event?: {
                    currentTarget?:
                    | EventTarget
                    | null;
                    target?:
                    | EventTarget
                    | null;
                },
            ) => {
                const item = data[index];

                if (!item) {
                    return;
                }

                const meta =
                    BAR_COLORS[
                    index % BAR_COLORS.length
                    ];

                const isEmpty =
                    item.issues === 0;

                let rect: BarRect | null =
                    null;

                const rawTarget =
                    (event?.currentTarget ??
                        event?.target) as
                    | Element
                    | null
                    | undefined;

                if (
                    rawTarget &&
                    chartWrapperRef.current &&
                    "getBoundingClientRect" in
                    rawTarget
                ) {
                    const targetRect =
                        rawTarget.getBoundingClientRect();

                    const wrapperRect =
                        chartWrapperRef.current.getBoundingClientRect();

                    const left =
                        targetRect.left -
                        wrapperRect.left;

                    rect = {
                        left,
                        top:
                            targetRect.top -
                            wrapperRect.top,
                        width:
                            targetRect.width,
                        height:
                            targetRect.height,
                    };
                }

                setHoverKey(
                    (value) => value + 1,
                );

                setActiveBar({
                    stage: item.stage,
                    issues: item.issues,
                    color: meta.color,
                    glow: meta.glow,
                    index,
                    isEmpty,
                    rect,
                });
            },
            [data],
        );

    const handleMouseLeave =
        useCallback(
            () => setActiveBar(null),
            [],
        );

    const renderBarShape =
        useCallback(
            (props: unknown) => {
                const p = props as {
                    x?: number;
                    y?: number;
                    width?: number;
                    height?: number;
                    index?: number;
                };

                return (
                    <CustomBarShape
                        {...p}
                        activeIndex={
                            activeBar?.index ?? null
                        }
                        hoverKey={hoverKey}
                        isEmptyMap={
                            isEmptyMap
                        }
                    />
                );
            },
            [
                activeBar?.index,
                hoverKey,
                isEmptyMap,
            ],
        );

    const renderXTick =
        useCallback(
            (props: unknown) => (
                <CustomXAxisTick
                    {...(props as any)}
                    fill={s.xTick}
                    size={s.tickSize}
                    split={glass}
                />
            ),
            [s.xTick, s.tickSize, glass],
        );

    const chartDefs = isDark
        ? STATIC_DEFS_DARK
        : STATIC_DEFS_LIGHT;

    const activeIntensity = activeBar
        ? Math.min(
            activeBar.issues /
            maxValue,
            1,
        )
        : 0;

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 6,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.3,
                ease: [
                    0.25,
                    0.46,
                    0.45,
                    0.94,
                ],
            }}
            className={cn(
                "relative flex flex-col rounded-2xl border",
                s.pad,
                s.root,
                className,
            )}
        >
            <div
                className={s.header}
                dir="rtl"
            >
                <div>
                    <h3
                        className={cn(
                            "font-semibold",
                            s.titleSize,
                            s.title,
                        )}
                    >
                        دپارتمان‌های با بیشترین لغو تسک
                    </h3>

                    <p
                        className={cn(
                            "mt-0.5",
                            s.subSize,
                            s.sub,
                        )}
                    >
                        {currentRange?.sub}
                    </p>
                </div>

                <div
                    className={cn(
                        "flex items-center rounded-xl border",
                        s.toggleSize,
                        s.toggleWrap,
                    )}
                >
                    {ranges.map((range) => (
                        <button
                            key={range.key}
                            type="button"
                            onClick={() =>
                                setActiveRange(
                                    range.key,
                                )
                            }
                            className={cn(
                                "relative rounded-lg font-medium",
                                s.btn,
                            )}
                        >
                            {activeRange ===
                                range.key && (
                                    <motion.span
                                        layoutId={`salesIssuesRangeIndicator-${variant}`}
                                        className={cn(
                                            "absolute inset-0 rounded-lg",
                                            s.indicator,
                                        )}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30,
                                        }}
                                    />
                                )}

                            <span
                                className={cn(
                                    "relative z-10 transition-colors",
                                    activeRange ===
                                        range.key
                                        ? s.active
                                        : s.inactive,
                                )}
                            >
                                {range.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={s.tipPos}>
                <AnimatePresence mode="wait">
                    {activeBar && (
                        <motion.div
                            key={`${activeRange}-${activeBar.stage}`}
                            initial={{
                                opacity: 0,
                                y: 4,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 4,
                                scale: 0.96,
                            }}
                            transition={{
                                duration: 0.15,
                                ease: [
                                    0.25,
                                    0.46,
                                    0.45,
                                    0.94,
                                ],
                            }}
                            className={cn(
                                "pointer-events-none rounded-xl border shadow-lg backdrop-blur-sm",
                                s.tipPad,
                                s.tooltip,
                            )}
                            style={{
                                boxShadow:
                                    activeBar.isEmpty
                                        ? "0 4px 20px rgba(0,0,0,0.08)"
                                        : `0 4px 20px ${activeBar.glow}`,
                            }}
                        >
                            <div className="mb-1 flex items-center gap-1.5">
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                        backgroundColor:
                                            activeBar.isEmpty
                                                ? "#cbd5e1"
                                                : activeBar.color,
                                        boxShadow:
                                            activeBar.isEmpty
                                                ? "none"
                                                : `0 0 7px ${activeBar.glow}`,
                                    }}
                                />

                                <span
                                    className={cn(
                                        "font-semibold",
                                        s.tipNameSize,
                                        s.tipName,
                                    )}
                                >
                                    {activeBar.stage}
                                </span>
                            </div>

                            {activeBar.isEmpty ? (
                                <p
                                    className={cn(
                                        s.tipTextSize,
                                        s.empty,
                                    )}
                                >
                                    هنوز آماری ثبت نشده
                                </p>
                            ) : (
                                <>
                                    <p
                                        className={cn(
                                            s.tipTextSize,
                                            s.tipText,
                                        )}
                                    >
                                        تعداد لغو شده:{" "}
                                        <span
                                            className="font-bold tabular-nums"
                                            style={{
                                                color:
                                                    activeBar.color,
                                            }}
                                        >
                                            {formattedIssues}
                                        </span>
                                    </p>

                                    <div
                                        className={cn(
                                            "mt-1.5 h-1 w-full overflow-hidden rounded-full",
                                            s.tipBar,
                                        )}
                                    >
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${Math.round(
                                                    activeIntensity * 100,
                                                )}%`,
                                                backgroundColor:
                                                    activeBar.color,
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div
                ref={chartWrapperRef}
                className={cn(
                    "relative w-full overflow-hidden",
                    glass
                        ? "min-h-0 flex-1"
                        : "h-[200px]",
                )}
            >
                {data.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        هیچ دپارتمانی ثبت نشده است.
                    </div>
                ) : (
                    <>
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <BarChart
                                data={displayData}
                                margin={s.margin}
                                barCategoryGap={s.gap}
                                barGap={0}
                                onMouseLeave={
                                    handleMouseLeave
                                }
                            >
                                {chartDefs}

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={s.grid}
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="stage"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={renderXTick}
                                    interval={0}
                                    height={s.xHeight}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: s.yTickSize,
                                        fontWeight: 500,
                                    }}
                                    className={s.yTick}
                                />

                                <Bar
                                    dataKey="plotValue"
                                    shape={renderBarShape}
                                    onMouseEnter={
                                        handleMouseEnter
                                    }
                                    isAnimationActive={false}
                                    minPointSize={8}
                                >
                                    {displayData.map(
                                        (_, i) => (
                                            <Cell
                                                key={i}
                                                fill={`url(#barGrad-${i %
                                                    BAR_COLORS.length
                                                    })`}
                                            />
                                        ),
                                    )}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        {activeBar?.rect && (
                            <ParticleField
                                key={`${activeRange}-${activeBar.index}`}
                                rect={activeBar.rect}
                                color={
                                    activeBar.color
                                }
                                intensity={
                                    activeIntensity
                                }
                                isDark={isDark}
                            />
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
}