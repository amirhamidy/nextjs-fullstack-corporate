"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Users } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { glassSurface } from "@/components/home/glass";

export interface TopBringerItem {
    key: string;
    full_name: string;
    count: number;
    actual: number;
    potential: number;
}

interface Props {
    items: TopBringerItem[];
    loading: boolean;
    variant?: "default" | "glass";
    className?: string;
}

type ActiveSlice = {
    name: string;
    actual: number;
    count: number;
    color: string;
    glow: string;
    index: number;
};

const VIOLET_SCALE = [
    { color: "#818cf8", glow: "rgba(129,140,248,0.5)" },
    { color: "#a78bfa", glow: "rgba(167,139,250,0.5)" },
    { color: "#c084fc", glow: "rgba(192,132,252,0.5)" },
    { color: "#38bdf8", glow: "rgba(56,189,248,0.5)" },
    { color: "#2dd4bf", glow: "rgba(45,212,191,0.5)" },
    { color: "#f472b6", glow: "rgba(244,114,182,0.5)" },
];

const GLASS_STYLES = {
    root: glassSurface,
    pad: "p-3",
    iconBox: "h-6 w-6 rounded-lg",
    iconSize: 12,
    titleSize: "text-[10.5px]",
    subSize: "text-[9px]",
    title: "text-white",
    sub: "text-slate-300",
    headerGap: "gap-2",
    headerMargin: "mb-1",
    tipPos: "absolute left-2 top-11 z-10 min-w-[120px]",
    tipPad: "px-2 py-1.5",
    tipNameSize: "text-[10px]",
    tipTextSize: "text-[9px]",
    tooltip: "border-white/15 bg-slate-950/85",
    tipName: "text-white",
    tipText: "text-slate-300",
    chartWrap: "relative min-h-0 w-full flex-1",
    totalSize: "text-[15px]",
    totalColor: "text-white",
    totalLabelSize: "text-[8px]",
    totalLabelColor: "text-slate-400",
    legend: "mt-1 flex flex-wrap gap-x-2.5 gap-y-0.5 px-0.5",
    legendText: "text-[8.5px] text-slate-300",
    empty: "text-slate-400",
    maxItems: 5,
};

const DEFAULT_STYLES = {
    root: "overflow-hidden shadow-sm",
    pad: "p-4",
    iconBox: "h-8 w-8 rounded-xl",
    iconSize: 15,
    titleSize: "text-[14px]",
    subSize: "text-[12px]",
    title: "text-gray-900 dark:text-white",
    sub: "text-gray-500 dark:text-gray-400",
    headerGap: "gap-2.5",
    headerMargin: "mb-3",
    tipPos: "absolute left-2 top-14 z-10 min-w-[160px]",
    tipPad: "px-3 py-2",
    tipNameSize: "text-[12px]",
    tipTextSize: "text-[11px]",
    tooltip:
        "border-gray-200/60 bg-white/95 dark:border-white/10 dark:bg-slate-900/95",
    tipName: "text-gray-800 dark:text-gray-100",
    tipText: "text-gray-500 dark:text-gray-400",
    chartWrap: "relative h-[220px] w-full",
    totalSize: "text-[18px]",
    totalColor: "text-gray-900 dark:text-white",
    totalLabelSize: "text-[10.5px]",
    totalLabelColor: "text-gray-400 dark:text-gray-500",
    legend: "mt-2 flex flex-wrap gap-x-4 gap-y-1.5 px-1",
    legendText: "text-[10.5px] text-gray-500 dark:text-gray-400",
    empty: "text-gray-400",
    maxItems: 6,
};

function TopBringersChartSkeleton({ glass }: { glass: boolean }) {
    return (
        <div
            className={cn(
                "flex flex-col rounded-2xl border p-4",
                glass
                    ? glassSurface
                    : "border-gray-200 bg-white dark:border-white/8 dark:bg-slate-950",
            )}
        >
            <div className="mb-3 space-y-2" dir="rtl">
                <div
                    className={cn(
                        "h-4 w-36 animate-pulse rounded-full",
                        glass ? "bg-white/10" : "bg-gray-100 dark:bg-slate-900",
                    )}
                />
                <div
                    className={cn(
                        "h-3 w-24 animate-pulse rounded-full",
                        glass
                            ? "bg-white/5"
                            : "bg-gray-100/80 dark:bg-slate-900/60",
                    )}
                />
            </div>
            <div
                className={cn(
                    "flex items-center justify-center",
                    glass ? "min-h-0 flex-1" : "h-[200px]",
                )}
            >
                <div
                    className={cn(
                        "h-28 w-28 animate-pulse rounded-full border-[14px]",
                        glass
                            ? "border-white/10"
                            : "border-gray-100 dark:border-slate-900",
                    )}
                />
            </div>
        </div>
    );
}

export default function TopBringersChart({
    items,
    loading,
    variant = "default",
    className,
}: Props) {
    const { resolvedTheme } = useTheme();
    const glass = variant === "glass";
    const isDark = glass || resolvedTheme === "dark";
    const s = glass ? GLASS_STYLES : DEFAULT_STYLES;

    const [activeSlice, setActiveSlice] = useState<ActiveSlice | null>(null);

    const data = useMemo(
        () =>
            items.slice(0, s.maxItems).map((item, i) => ({
                name: item.full_name,
                actual: item.actual,
                count: item.count,
                fill: VIOLET_SCALE[i % VIOLET_SCALE.length].color,
            })),
        [items, s.maxItems],
    );

    const totalActual = useMemo(
        () => data.reduce((sum, item) => sum + item.actual, 0),
        [data],
    );

    const handleMouseEnter = useCallback(
        (_: unknown, index: number) => {
            const item = data[index];
            if (!item) return;
            const meta = VIOLET_SCALE[index % VIOLET_SCALE.length];
            setActiveSlice({
                name: item.name,
                actual: item.actual,
                count: item.count,
                color: meta.color,
                glow: meta.glow,
                index,
            });
        },
        [data],
    );

    const handleMouseLeave = useCallback(() => setActiveSlice(null), []);

    if (loading) return <TopBringersChartSkeleton glass={glass} />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn(
                "relative flex flex-col rounded-2xl border",
                s.pad,
                s.root,
                className,
            )}
            style={
                glass
                    ? undefined
                    : {
                        borderColor: isDark
                            ? "rgba(129,140,248,0.1)"
                            : "rgba(129,140,248,0.12)",
                        background: isDark
                            ? "linear-gradient(160deg, rgba(129,140,248,0.05), rgba(15,23,42,0))"
                            : "linear-gradient(160deg, rgba(129,140,248,0.05), #ffffff)",
                    }
            }
        >
            <div
                className={cn("flex items-start justify-between gap-3", s.headerMargin)}
                dir="rtl"
            >
                <div className={cn("flex items-center", s.headerGap)}>
                    <div
                        className={cn("flex items-center justify-center", s.iconBox)}
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(129,140,248,0.18), rgba(56,189,248,0.18))",
                        }}
                    >
                        <Users size={s.iconSize} className="text-indigo-400" />
                    </div>
                    <div>
                        <h3 className={cn("font-semibold", s.titleSize, s.title)}>
                            آورنده‌های برتر مشتری
                        </h3>
                        <p className={cn("mt-0.5", s.subSize, s.sub)}>
                            بیشترین مشتری بالفعل جذب‌شده
                        </p>
                    </div>
                </div>
            </div>

            <div className={s.tipPos}>
                <AnimatePresence mode="wait">
                    {activeSlice && (
                        <motion.div
                            key={activeSlice.index}
                            initial={{ opacity: 0, y: 4, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.96 }}
                            transition={{
                                duration: 0.15,
                                ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                            className={cn(
                                "pointer-events-none rounded-xl border shadow-lg backdrop-blur-sm",
                                s.tipPad,
                                s.tooltip,
                            )}
                            style={{ boxShadow: `0 4px 20px ${activeSlice.glow}` }}
                        >
                            <div className="mb-1 flex items-center gap-1.5">
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                        backgroundColor: activeSlice.color,
                                        boxShadow: `0 0 6px ${activeSlice.glow}`,
                                    }}
                                />
                                <span
                                    className={cn(
                                        "font-semibold",
                                        s.tipNameSize,
                                        s.tipName,
                                    )}
                                >
                                    {activeSlice.name}
                                </span>
                            </div>
                            <p className={cn(s.tipTextSize, s.tipText)}>
                                بالفعل:{" "}
                                <span
                                    className="font-bold tabular-nums"
                                    style={{ color: activeSlice.color }}
                                >
                                    {activeSlice.actual.toLocaleString("fa-IR")}
                                </span>{" "}
                                از {activeSlice.count.toLocaleString("fa-IR")} ورودی
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className={s.chartWrap}>
                {data.length === 0 ? (
                    <div
                        className={cn(
                            "flex h-full items-center justify-center text-xs",
                            s.empty,
                        )}
                    >
                        داده‌ای در این بازه وجود ندارد
                    </div>
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart onMouseLeave={handleMouseLeave}>
                                <Pie
                                    data={data}
                                    dataKey="actual"
                                    nameKey="name"
                                    innerRadius="58%"
                                    outerRadius="88%"
                                    paddingAngle={3}
                                    cornerRadius={6}
                                    stroke="none"
                                    onMouseEnter={handleMouseEnter}
                                >
                                    {data.map((item, i) => (
                                        <Cell
                                            key={item.name}
                                            fill={item.fill}
                                            opacity={
                                                activeSlice && activeSlice.index !== i
                                                    ? 0.35
                                                    : 1
                                            }
                                            style={{ transition: "opacity 0.2s ease" }}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <span
                                className={cn("font-extrabold", s.totalSize, s.totalColor)}
                            >
                                {totalActual.toLocaleString("fa-IR")}
                            </span>
                            <span className={cn(s.totalLabelSize, s.totalLabelColor)}>
                                مشتری بالفعل
                            </span>
                        </div>
                    </>
                )}
            </div>

            {data.length > 0 && (
                <div className={s.legend} dir="rtl">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center gap-1.5">
                            <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: item.fill }}
                            />
                            <span className={s.legendText}>{item.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}