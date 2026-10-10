"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { glassSurface } from "@/components/home/glass";

type TimeRange = "weekly" | "monthly" | "yearly";

type ChartPoint = {
    name: string;
    sales: number;
};

type SalesChartData = Record<TimeRange, ChartPoint[]>;

const chartConfig: ChartConfig = {
    sales: { label: "فروش", color: "#38bdf8" },
};

const ranges: { key: TimeRange; label: string; sub: string }[] = [
    { key: "weekly", label: "هفتگی", sub: "هفته" },
    { key: "monthly", label: "ماهانه", sub: "ماه" },
    { key: "yearly", label: "سالانه", sub: "سال" },
];

const CHART_DEFS = (
    <defs>
        <linearGradient id="salesGradFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="salesStrokeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
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
    title: "text-white",
    sub: "text-slate-300",
    toggleWrap: "border-white/10 bg-white/5",
    indicator: "bg-white/15",
    active: "text-white",
    inactive: "text-slate-300",
    chartWrap: "relative min-h-0 flex-1",
    tipPos: "absolute left-1 top-1 z-10 min-w-[110px]",
    tipPad: "px-2 py-1.5",
    tipNameSize: "text-[10px]",
    tipTextSize: "text-[9px]",
    tooltip: "border-white/15 bg-slate-950/85",
    tipName: "text-white",
    tipText: "text-slate-300",
    axis: "[&_text]:fill-slate-300",
    grid: "[&_line]:stroke-white/10",
    tick: 9,
    margin: { top: 6, right: 6, left: -28, bottom: 0 },
    empty: "text-slate-400",
};

const DEFAULT_STYLES = {
    root: "overflow-hidden border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-slate-950",
    pad: "p-4",
    header: "mb-3 flex items-center justify-between",
    titleSize: "text-[14px]",
    subSize: "text-[13px]",
    btn: "px-2.5 py-1 text-[11px]",
    toggleSize: "gap-1 p-1",
    title: "text-gray-900 dark:text-white",
    sub: "text-gray-500 dark:text-gray-400",
    toggleWrap:
        "border-gray-100 bg-gray-50/80 dark:border-white/5 dark:bg-slate-900/50",
    indicator: "bg-white shadow-sm dark:bg-slate-800",
    active: "text-gray-900 dark:text-white",
    inactive: "text-gray-500 dark:text-gray-400",
    chartWrap: "relative h-[180px]",
    tipPos: "absolute left-2 top-2 z-10 min-w-[150px]",
    tipPad: "px-3 py-2",
    tipNameSize: "text-[12px]",
    tipTextSize: "text-[11px]",
    tooltip:
        "border-gray-200/60 bg-white/95 dark:border-white/10 dark:bg-slate-900/95",
    tipName: "text-gray-800 dark:text-gray-100",
    tipText: "text-gray-500 dark:text-gray-400",
    axis: "[&_text]:fill-gray-500 dark:[&_text]:fill-gray-400",
    grid: "[&_line]:stroke-gray-100 dark:[&_line]:stroke-white/[0.04]",
    tick: 11,
    margin: { top: 4, right: 4, left: -24, bottom: 0 },
    empty: "text-gray-400 dark:text-gray-500",
};

type ActivePoint = {
    name: string;
    sales: number;
};

export default function SalesChart({
    data: chartData,
    variant = "default",
    className,
}: {
    data: SalesChartData;
    variant?: "default" | "glass";
    className?: string;
}) {
    const [activeRange, setActiveRange] = useState<TimeRange>("monthly");
    const [activePoint, setActivePoint] = useState<ActivePoint | null>(null);

    const glass = variant === "glass";
    const s = glass ? GLASS_STYLES : DEFAULT_STYLES;

    const data = useMemo(
        () => chartData[activeRange] ?? [],
        [chartData, activeRange],
    );

    const currentRange = useMemo(
        () => ranges.find((r) => r.key === activeRange),
        [activeRange],
    );

    const hasData = useMemo(
        () => data.some((item) => item.sales > 0),
        [data],
    );

    const handleMouseMove = useCallback(
        (state: any) => {
            if (
                !state ||
                !state.isTooltipActive ||
                state.activeTooltipIndex === undefined ||
                state.activeTooltipIndex === null
            ) {
                return;
            }

            const index = Number(state.activeTooltipIndex);
            const item = data[index];

            if (!item) return;

            setActivePoint((current) => {
                if (
                    current &&
                    current.name === item.name &&
                    current.sales === item.sales
                ) {
                    return current;
                }

                return {
                    name: item.name,
                    sales: item.sales,
                };
            });
        },
        [data],
    );

    const handleMouseLeave = useCallback(() => {
        setActivePoint(null);
    }, []);

    useEffect(() => {
        setActivePoint(null);
    }, [activeRange]);

    const formattedSales = useMemo(
        () => (activePoint ? activePoint.sales.toLocaleString("fa-IR") : null),
        [activePoint],
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={cn(
                "relative flex flex-col rounded-2xl border",
                s.pad,
                s.root,
                className,
            )}
        >
            <div className={s.header} dir="rtl">
                <div>
                    <h3 className={cn("font-semibold", s.titleSize, s.title)}>
                        نمودار فروش
                    </h3>

                    <p className={cn("mt-0.5", s.subSize, s.sub)}>
                        گزارش عملکرد {currentRange?.sub}
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
                            onClick={() => setActiveRange(range.key)}
                            className={cn("relative rounded-lg font-medium", s.btn)}
                        >
                            {activeRange === range.key && (
                                <motion.span
                                    layoutId={`salesChartRangeIndicator-${variant}`}
                                    className={cn("absolute inset-0 rounded-lg", s.indicator)}
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
                                    activeRange === range.key ? s.active : s.inactive,
                                )}
                            >
                                {range.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={s.chartWrap}>
                <div className={s.tipPos}>
                    <AnimatePresence mode="wait">
                        {activePoint && (
                            <motion.div
                                key={`${activeRange}-${activePoint.name}`}
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
                                transition={{ duration: 0.15 }}
                                className={cn(
                                    "pointer-events-none rounded-xl border shadow-lg backdrop-blur-sm",
                                    s.tipPad,
                                    s.tooltip,
                                )}
                                style={{
                                    boxShadow: "0 4px 20px rgba(56,189,248,0.35)",
                                }}
                            >
                                <div className="mb-1 flex items-center gap-1.5">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                            backgroundColor: "#38bdf8",
                                        }}
                                    />

                                    <span
                                        className={cn("font-semibold", s.tipNameSize, s.tipName)}
                                    >
                                        {activePoint.name}
                                    </span>
                                </div>

                                <p className={cn(s.tipTextSize, s.tipText)}>
                                    فروش:{" "}
                                    <span
                                        className="font-bold tabular-nums"
                                        style={{
                                            color: "#38bdf8",
                                        }}
                                    >
                                        {formattedSales}
                                    </span>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={s.margin}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            {CHART_DEFS}

                            <CartesianGrid
                                strokeDasharray="3 3"
                                className={s.grid}
                                vertical={false}
                            />

                            <XAxis
                                dataKey="name"
                                tick={{
                                    fontSize: s.tick,
                                    fontWeight: 500,
                                }}
                                className={s.axis}
                                axisLine={false}
                                tickLine={false}
                                dy={5}
                            />

                            <YAxis
                                tick={{
                                    fontSize: s.tick,
                                    fontWeight: 500,
                                }}
                                className={s.axis}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v: number) => `${v}`}
                            />

                            <Area
                                type="monotone"
                                dataKey="sales"
                                stroke={glass ? "url(#salesStrokeGrad)" : "#38bdf8"}
                                strokeWidth={glass ? 2 : 2.5}
                                fill="url(#salesGradFill)"
                                dot={false}
                                activeDot={{
                                    r: glass ? 4 : 5,
                                    strokeWidth: 0,
                                    fill: "#38bdf8",
                                }}
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {!hasData && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className={cn("text-xs", s.empty)} dir="rtl">
                            تسک فروخته شده‌ای در این بازه ثبت نشده است.
                        </div>
                    </div>
                )}
            </div>

            {hasData && !glass && (
                <div className="mt-2 flex items-center justify-end gap-4" dir="rtl">
                    {Object.entries(chartConfig).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-1.5">
                            <span
                                className="inline-block h-0.5 w-3 rounded-full"
                                style={{
                                    backgroundColor: val.color,
                                }}
                            />

                            <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                {val.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}