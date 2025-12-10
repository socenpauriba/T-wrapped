import React, { useMemo, useState } from "react";
import type { TransportData } from "../types/transport";

const weekdays = ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte", "Diumenge"];

interface Props {
    data: TransportData[];
}

const formatMonth = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export const AnalysisTab: React.FC<Props> = ({ data }) => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [barViewMode, setBarViewMode] = useState<'week' | 'month'>('week');
    const [timeseriesMode, setTimeseriesMode] = useState<'day' | 'weekday' | 'month'>('day');

    const getISOWeekStr = (d: Date) => {
        const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNr = (target.getUTCDay() + 6) % 7;
        target.setUTCDate(target.getUTCDate() - dayNr + 3);
        const firstThursday = target.valueOf();
        const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
        const weekNumber = Math.floor((firstThursday - yearStart.valueOf()) / (7 * 24 * 60 * 60 * 1000)) + 1;
        return `${target.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
    };

    const filtered = useMemo(() => {
        if (!startDate && !endDate) return data;
        let start: Date | null = null;
        let end: Date | null = null;

        if (startDate) {
            const parts = startDate.split('/');
            if (parts.length === 3) {
                start = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
        }
        if (endDate) {
            const parts = endDate.split('/');
            if (parts.length === 3) {
                end = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                end.setHours(23, 59, 59, 999);
            }
        }

        return data.filter((d) => {
            const dt = new Date(d.date);
            if (start && dt < start) return false;
            if (end && dt > end) return false;
            return true;
        });
    }, [data, startDate, endDate]);

    // Heatmap matrix dayOfWeek x hour
    const heatmap = useMemo(() => {
        const mat: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
        filtered.forEach((entry) => {
            const dt = new Date(entry.date);
            const rawDay = dt.getDay();
            const day = (rawDay + 6) % 7;
            const hour = dt.getHours();
            mat[day][hour] += 1;
        });
        return mat;
    }, [filtered]);

    const tripsPerWeekday = useMemo(() => {
        const arr = Array(7).fill(0);
        filtered.forEach((entry) => {
            const raw = new Date(entry.date).getDay();
            const idx = (raw + 6) % 7;
            arr[idx]++;
        });
        return arr;
    }, [filtered]);

    const tripsPerMonth = useMemo(() => {
        const map = new Map<string, number>();
        filtered.forEach((entry) => {
            const m = formatMonth(new Date(entry.date));
            map.set(m, (map.get(m) || 0) + 1);
        });
        const sorted = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
        return sorted;
    }, [filtered]);

    const validationsByDay = useMemo(() => {
        const map = new Map<string, number>();
        filtered.forEach((entry) => {
            const key = new Date(entry.date).toISOString().split("T")[0];
            map.set(key, (map.get(key) || 0) + 1);
        });
        return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    }, [filtered]);

    const topDays = useMemo(() => {
        return [...validationsByDay].sort((a, b) => b[1] - a[1]).slice(0, 5);
    }, [validationsByDay]);

    // Aggregated data for bar chart based on barViewMode
    const aggregatedBars = useMemo(() => {
        if (barViewMode === 'month') return tripsPerMonth.map(([m, c]) => [m, c]);
        if (barViewMode === 'day') return validationsByDay.map(([d, c]) => [d, c]);
        // week mode
        const weekMap = new Map<string, number>();
        filtered.forEach((entry) => {
            const dt = new Date(entry.date);
            const iso = getISOWeekStr(dt);
            weekMap.set(iso, (weekMap.get(iso) || 0) + 1);
        });
        return Array.from(weekMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    }, [barViewMode, tripsPerMonth, validationsByDay, filtered]);

    const maxAggregatedBars = aggregatedBars.length ? Math.max(...aggregatedBars.map((c) => Number(c[1]) || 0)) : 1;

    // Timeseries data for temporal chart
    const timeseriesData = useMemo(() => {
        if (timeseriesMode === 'weekday') {
            return tripsPerWeekday.map((v, i) => ({ label: weekdays[i].slice(0, 3), value: v }));
        }
        if (timeseriesMode === 'month') {
            return tripsPerMonth.map(([m, c]) => ({ label: m, value: c }));
        }
        // day mode
        return validationsByDay.map(([d, c]) => ({ label: d, value: c }));
    }, [timeseriesMode, tripsPerWeekday, tripsPerMonth, validationsByDay]);

    const maxTimeseries = timeseriesData.length ? Math.max(...timeseriesData.map(d => d.value)) : 1;

    const totals = filtered.length;
    const daysSpan = useMemo(() => {
        if (filtered.length === 0) return 0;
        const dates = filtered.map((d) => new Date(d.date).getTime()).sort((a, b) => a - b);
        const spanDays = Math.max(1, Math.round((dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24)));
        return spanDays;
    }, [filtered]);

    const avgDaily = daysSpan ? +(totals / (daysSpan || 1)).toFixed(2) : 0;
    const weeks = Math.max(1, Math.round((daysSpan || 1) / 7));
    const avgWeekly = +(totals / weeks).toFixed(2);
    const months = Math.max(1, Math.round((daysSpan || 30) / 30));
    const avgMonthly = +(totals / months).toFixed(2);

    const maxHeat = Math.max(...heatmap.flat(), 1);

    // Render bar chart
    const renderBarChart = () => {
        if (aggregatedBars.length === 0) return <div className="text-gray-500 py-8">No hi ha dades</div>;

        const chartHeight = 160;
        const barWidth = Math.max(8, Math.min(50, 1200 / aggregatedBars.length));
        const chartWidth = barWidth * aggregatedBars.length + 60;

        return (
            <div className="flex gap-4 items-start">
                {/* Y-axis labels */}
                <div className="flex flex-col justify-between text-sm text-gray-600" style={{ width: 50, height: chartHeight + 20 }}>
                    <div>{Math.round(maxAggregatedBars)}</div>
                    <div>{Math.round(maxAggregatedBars / 2)}</div>
                    <div>0</div>
                </div>
                {/* Chart container */}
                <div className="flex-1 overflow-x-auto">
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: chartHeight, width: chartWidth, paddingRight: 20 }}>
                        {aggregatedBars.map(([label, count], idx) => {
                            const num = Number(count) || 0;
                            const barHeight = Math.max(4, (num / Math.max(maxAggregatedBars, 1)) * chartHeight);
                            return (
                                <div key={`${label}-${idx}`} className="flex flex-col items-center" style={{ width: barWidth }}>
                                    <div className="text-xs text-gray-700 mb-1" style={{ minHeight: 16 }}>{num}</div>
                                    <div
                                        title={`${label}: ${num}`}
                                        style={{
                                            height: barHeight,
                                            width: barWidth - 4,
                                            background: '#009889',
                                            borderRadius: 2,
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    {/* X-axis labels - angled to prevent overlap */}
                    <svg style={{ width: chartWidth, height: 60, marginTop: 8, paddingRight: 20 }}>
                        {aggregatedBars.map(([label], idx) => {
                            const x = (barWidth / 2) + idx * barWidth;
                            const labelText = label.length > 10 ? `${label.slice(0, 9)}...` : label;
                            return (
                                <g key={`label-${idx}`}>
                                    <text
                                        x={x}
                                        y={15}
                                        fontSize="11"
                                        fill="#666"
                                        textAnchor="start"
                                        transform={`rotate(45 ${x} 15)`}
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {labelText}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
        );
    };

    // Render temporal chart with SVG
    const renderTimeseries = () => {
        if (timeseriesData.length === 0) return <div className="text-gray-500 py-8">No hi ha dades</div>;

        const svgWidth = Math.max(400, timeseriesData.length * 8);
        const svgHeight = 240;
        const margin = { top: 10, bottom: 30, left: 50, right: 20 };
        const plotWidth = svgWidth - margin.left - margin.right;
        const plotHeight = svgHeight - margin.top - margin.bottom;

        const stepX = plotWidth / Math.max(timeseriesData.length - 1, 1);
        const path = timeseriesData
            .map((d, i) => {
                const x = margin.left + i * stepX;
                const y = margin.top + plotHeight - (d.value / Math.max(maxTimeseries, 1)) * plotHeight;
                return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(' ');

        return (
            <div className="overflow-x-auto">
                <svg width={svgWidth} height={svgHeight} style={{ border: '1px solid #e5e7eb' }}>
                    {/* Axes */}
                    <line x1={margin.left} y1={margin.top} x2={margin.left} y2={svgHeight - margin.bottom} stroke="#ccc" strokeWidth={1} />
                    <line x1={margin.left} y1={svgHeight - margin.bottom} x2={svgWidth - margin.right} y2={svgHeight - margin.bottom} stroke="#ccc" strokeWidth={1} />

                    {/* Y-axis labels & grid */}
                    {[0, 0.5, 1].map((val, i) => {
                        const y = margin.top + plotHeight * (1 - val);
                        const yVal = Math.round(val * maxTimeseries);
                        return (
                            <g key={`y-${i}`}>
                                <line x1={margin.left - 4} y1={y} x2={margin.left} y2={y} stroke="#999" strokeWidth={1} />
                                <text x={margin.left - 8} y={y + 4} fontSize="11" fill="#666" textAnchor="end">
                                    {yVal}
                                </text>
                                <line x1={margin.left} y1={y} x2={svgWidth - margin.right} y2={y} stroke="#f0f0f0" strokeWidth={1} strokeDasharray="2,2" />
                            </g>
                        );
                    })}

                    {/* Line path */}
                    <path d={path} fill="none" stroke="#009889" strokeWidth={2} />

                    {/* Data points */}
                    {timeseriesData.map((d, i) => {
                        const x = margin.left + i * stepX;
                        const y = margin.top + plotHeight - (d.value / Math.max(maxTimeseries, 1)) * plotHeight;
                        return <circle key={`point-${i}`} cx={x} cy={y} r={3} fill="#009889" />;
                    })}

                    {/* X-axis labels (sparse) */}
                    {timeseriesData.map((d, i) => {
                        if (timeseriesData.length > 30 && i % Math.ceil(timeseriesData.length / 10) !== 0) return null;
                        const x = margin.left + i * stepX;
                        return (
                            <text key={`label-${i}`} x={x} y={svgHeight - margin.bottom + 15} fontSize="11" fill="#666" textAnchor="middle">
                                {d.label.length > 10 ? `${d.label.slice(0, 8)}...` : d.label}
                            </text>
                        );
                    })}
                </svg>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Date filters */}
            <div className="flex gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Data inicial</label>
                    <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        value={startDate}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            let formatted = '';
                            if (val.length > 0) formatted = val.slice(0, 2);
                            if (val.length > 2) formatted += '/' + val.slice(2, 4);
                            if (val.length > 4) formatted += '/' + val.slice(4, 8);
                            if (formatted.length <= 10) setStartDate(formatted);
                        }}
                        className="mt-1 p-2 border rounded w-32"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Data final</label>
                    <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        value={endDate}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            let formatted = '';
                            if (val.length > 0) formatted = val.slice(0, 2);
                            if (val.length > 2) formatted += '/' + val.slice(2, 4);
                            if (val.length > 4) formatted += '/' + val.slice(4, 8);
                            if (formatted.length <= 10) setEndDate(formatted);
                        }}
                        className="mt-1 p-2 border rounded w-32"
                    />
                </div>
                <div className="ml-auto">
                    <button onClick={() => { setStartDate(""); setEndDate(""); }} className="px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300">Restableix</button>
                </div>
            </div>

            {/* Heatmap - full width */}
            <div className="p-4 bg-white rounded shadow">
                <h3 className="font-semibold mb-3">Heatmap (Dia × Hora)</h3>
                <div className="overflow-auto">
                    <div className="text-xs text-gray-600 mb-2">Intensitat segons nombre de validacions</div>
                    <div className="grid gap-1 w-full" style={{ gridTemplateColumns: `140px repeat(24, minmax(0, 1fr))` }}>
                        <div />
                        {Array.from({ length: 24 }).map((_, h) => (
                            <div key={`h-${h}`} className="text-xs text-center text-gray-600">{h}</div>
                        ))}
                        {heatmap.map((row, d) => (
                            <React.Fragment key={`r-${d}`}>
                                <div className="text-sm font-medium flex items-center" style={{ paddingLeft: 8 }}>{weekdays[d]}</div>
                                {row.map((val, h) => {
                                    const intensity = val / maxHeat;
                                    const bg = `rgba(0,152,137,${0.12 + 0.88 * intensity})`;
                                    return (
                                        <div
                                            key={`cell-${d}-${h}`}
                                            title={`${val} validacions`}
                                            className="rounded-sm cursor-pointer hover:shadow-sm transition"
                                            style={{ background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 36 }}
                                        >
                                            {val > 0 ? <span className="text-xs font-medium text-white">{val}</span> : null}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main bar chart - full width */}
            <div className="p-4 bg-white rounded shadow">
                <h3 className="font-semibold mb-3">Viatges per periode (selecciona visualització)</h3>

                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setBarViewMode('week')}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${barViewMode === 'week' ? 'bg-[#009889] text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Per setmana
                    </button>
                    <button
                        onClick={() => setBarViewMode('month')}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${barViewMode === 'month' ? 'bg-[#009889] text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Per mes
                    </button>
                </div>

                {renderBarChart()}
            </div>

            {/* Stats and Weekday sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded shadow">
                    <h4 className="font-semibold mb-4">Mitjanes</h4>
                    <div className="grid grid-cols-3 gap-4 text-center mb-6">
                        <div>
                            <div className="text-3xl font-bold text-[#009889]">{avgDaily}</div>
                            <div className="text-xs text-gray-500 mt-1">Diària</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#009889]">{avgWeekly}</div>
                            <div className="text-xs text-gray-500 mt-1">Setmanal</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#009889]">{avgMonthly}</div>
                            <div className="text-xs text-gray-500 mt-1">Mensual</div>
                        </div>
                    </div>

                    <h4 className="font-semibold mb-3">Viatges per dia de la setmana</h4>
                    <div className="flex gap-2 items-end h-40">
                        {(() => {
                            const maxWeekday = Math.max(...tripsPerWeekday, 1);
                            return tripsPerWeekday.map((v, i) => {
                                const h = Math.round((v / maxWeekday) * 100);
                                return (
                                    <div key={i} className="flex-1 text-center">
                                        <div className="text-sm font-medium text-gray-700 mb-1">{v}</div>
                                        <div
                                            className="mx-auto bg-[#009889] rounded-sm transition hover:opacity-80"
                                            style={{ height: `${Math.max(h, 8)}px`, width: '100%' }}
                                        />
                                        <div className="text-xs text-gray-600 mt-2 font-medium">{weekdays[i].slice(0, 3)}</div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>

                <div className="p-4 bg-white rounded shadow">
                    <h4 className="font-semibold mb-4">Top 5 dies amb més viatges</h4>
                    {topDays.length === 0 ? (
                        <div className="text-gray-500 text-center py-8">No hi ha dades</div>
                    ) : (
                        <ol className="space-y-2">
                            {topDays.map(([date, count], i) => {
                                const d = new Date(date);
                                const label = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                                return (
                                    <li key={date} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition">
                                        <span className="text-sm">
                                            <span className="font-bold text-[#009889] mr-3">#{i + 1}</span>
                                            <span className="text-gray-700">{label}</span>
                                        </span>
                                        <span className="font-semibold bg-[#009889] text-white px-3 py-1 rounded text-sm">{count}</span>
                                    </li>
                                );
                            })}
                        </ol>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalysisTab;
