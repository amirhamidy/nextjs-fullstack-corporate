"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { glassSurface } from "./glass";

type TimeRange = "weekly" | "monthly" | "yearly";

interface SourceCount {
    resourceId: number;
    name: string;
    value: number;
    color: string;
    glow: string;
}

type CategoryChartData = Record<TimeRange, SourceCount[]>;

const ranges: { key: TimeRange; label: string; sub: string }[] = [
    { key: "weekly", label: "هفتگی", sub: "۷ روز اخیر" },
    { key: "monthly", label: "ماهانه", sub: "۳۰ روز اخیر" },
    { key: "yearly", label: "سالانه", sub: "۳۶۵ روز اخیر" },
];

type ActiveSlice = {
    id: number;
    label: string;
    value: number;
    color: string;
    glow: string;
    pct: string;
};

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
    tipPos: "absolute left-1 top-1 z-10 min-w-[100px]",
    tipPad: "px-2 py-1.5",
    tipNameSize: "text-[10px]",
    tipTextSize: "text-[9px]",
    tooltip: "border-white/15 bg-slate-950/85",
    tipName: "text-white",
    tipText: "text-slate-300",
    inner: "56%",
    outer: "84%",
    centerPct: "text-[15px]",
    centerLabel: "text-[8px]",
    centerTotal: "text-[13px]",
    centerLabelColor: "text-slate-400",
    centerTotalColor: "text-slate-100",
    legend: "mt-1.5 grid grid-cols-2 gap-0.5",
    legendItem: "gap-1 px-1.5 py-0.5",
    legendName: "text-[9px] text-slate-300",
    legendPct: "text-[9px]",
};

const DEFAULT_STYLES = {
    root: "border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-slate-950",
    pad: "p-4",
    header: "mb-3 flex items-start justify-between gap-3",
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
    tipPos: "absolute left-2 top-2 z-10 min-w-[140px]",
    tipPad: "px-3 py-2",
    tipNameSize: "text-[12px]",
    tipTextSize: "text-[11px]",
    tooltip:
        "border-gray-200/60 bg-white/95 dark:border-white/10 dark:bg-slate-900/95",
    tipName: "text-gray-800 dark:text-gray-100",
    tipText: "text-gray-500 dark:text-gray-400",
    inner: 48,
    outer: 74,
    centerPct: "text-[20px]",
    centerLabel: "text-[10px]",
    centerTotal: "text-[16px]",
    centerLabelColor: "text-gray-400 dark:text-gray-500",
    centerTotalColor: "text-gray-700 dark:text-gray-200",
    legend: "mt-2 grid grid-cols-2 gap-1",
    legendItem: "gap-1.5 px-2 py-1",
    legendName: "text-[12px] text-gray-600 dark:text-gray-300",
    legendPct: "text-[12px]",
};

export default function CategoryChart({
    data: rangeData,
    variant = "default",
    className,
}: {
    data: CategoryChartData;
    variant?: "default" | "glass";
    className?: string;
}) {
    const [activeRange, setActiveRange] = useState<TimeRange>("weekly");

    const [activeSlice, setActiveSlice] = useState<ActiveSlice | null>(null);

    const glass = variant === "glass";
    const s = glass ? GLASS_STYLES : DEFAULT_STYLES;

    const data = useMemo(
        () => rangeData[activeRange] ?? [],
        [rangeData, activeRange],
    );

    const total = useMemo(
        () => data.reduce((sum, item) => sum + item.value, 0),
        [data],
    );

    const totalFormatted = useMemo(
        () => total.toLocaleString("fa-IR"),
        [total],
    );

    const currentRange = useMemo(
        () => ranges.find((range) => range.key === activeRange),
        [activeRange],
    );

    const handleMouseEnter = useCallback(
        (_: unknown, index: number) => {
            const item = data[index];

            if (!item) return;

            setActiveSlice({
                id: item.resourceId,
                label: item.name,
                value: item.value,
                color: item.color,
                glow: item.glow,
                pct: total ? ((item.value / total) * 100).toFixed(1) : "0.0",
            });
        },
        [data, total],
    );

    const handleMouseLeave = useCallback(() => {
        setActiveSlice(null);
    }, []);

    useEffect(() => {
        setActiveSlice(null);
    }, [activeRange]);

    const pieDefs = (
        <defs>
            {data.map((item) => (
                <radialGradient
                    key={`pieGrad-${item.resourceId}`}
                    id={`pieGrad-${item.resourceId}`}
                    cx="50%"
                    cy="50%"
                    r="50%"
                >
                    <stop offset="0%" stopColor={item.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={item.color} stopOpacity={0.65} />
                </radialGradient>
            ))}

            {data.map((item) => (
                <filter
                    key={`glow-${item.resourceId}`}
                    id={`glow-${item.resourceId}`}
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                >
                    <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="3"
                        floodColor={item.color}
                        floodOpacity="0.6"
                    />
                </filter>
            ))}
        </defs>
    );

    return (
        <div
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
                        بیشترین منابع مشتری
                    </h3>

                    <p className={cn("mt-0.5", s.subSize, s.sub)}>
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
                            onClick={() => setActiveRange(range.key)}
                            className={cn("relative rounded-lg font-medium", s.btn)}
                        >
                            {activeRange === range.key && (
                                <motion.span
                                    layoutId={`categoryChartRangeIndicator-${variant}`}
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
                        {activeSlice && (
                            <motion.div
                                key={`${activeRange}-${activeSlice.id}`}
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
                                    boxShadow: `0 4px 20px ${activeSlice.glow}`,
                                }}
                            >
                                <div className="mb-1 flex items-center gap-1.5">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                            backgroundColor: activeSlice.color,
                                        }}
                                    />

                                    <span
                                        className={cn("font-semibold", s.tipNameSize, s.tipName)}
                                    >
                                        {activeSlice.label}
                                    </span>
                                </div>

                                <p className={cn(s.tipTextSize, s.tipText)}>
                                    سهم منبع:{" "}
                                    <span
                                        className="font-bold tabular-nums"
                                        style={{
                                            color: activeSlice.color,
                                        }}
                                    >
                                        {activeSlice.pct}%
                                    </span>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {pieDefs}

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={s.inner}
                            outerRadius={s.outer}
                            paddingAngle={data.length > 1 ? 4 : 0}
                            strokeWidth={0}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            isAnimationActive={false}
                        >
                            {data.map((entry) => {
                                const isActive = activeSlice?.id === entry.resourceId;

                                return (
                                    <Cell
                                        key={`${activeRange}-${entry.resourceId}`}
                                        fill={`url(#pieGrad-${entry.resourceId})`}
                                        stroke="none"
                                        filter={
                                            isActive ? `url(#glow-${entry.resourceId})` : undefined
                                        }
                                    />
                                );
                            })}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {activeSlice ? (
                            <motion.div
                                key={activeSlice.id}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={{ duration: 0.12 }}
                                className="text-center"
                            >
                                <p
                                    className={cn("font-bold tabular-nums", s.centerPct)}
                                    style={{
                                        color: activeSlice.color,
                                    }}
                                >
                                    {activeSlice.pct}%
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="total"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.12 }}
                                className="text-center"
                            >
                                <p className={cn(s.centerLabel, s.centerLabelColor)}>کل</p>

                                <p
                                    className={cn(
                                        "font-bold tabular-nums",
                                        s.centerTotal,
                                        s.centerTotalColor,
                                    )}
                                >
                                    {totalFormatted}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className={s.legend} dir="rtl">
                {data.map((entry: SourceCount) => {
                    const pct = total ? ((entry.value / total) * 100).toFixed(1) : "0.0";

                    const isActive = activeSlice?.id === entry.resourceId;

                    return (
                        <div
                            key={`${activeRange}-${entry.resourceId}`}
                            className={cn(
                                "flex cursor-default items-center rounded-lg transition-colors duration-150",
                                s.legendItem,
                            )}
                            style={{
                                backgroundColor: isActive ? entry.glow : "transparent",
                            }}
                        >
                            <span
                                className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                style={{
                                    backgroundColor: entry.color,
                                }}
                            />

                            <span className={cn("flex-1 truncate", s.legendName)}>
                                {entry.name}
                            </span>

                            <span
                                className={cn("font-bold tabular-nums", s.legendPct)}
                                style={{
                                    color: entry.color,
                                }}
                            >
                                {pct}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}