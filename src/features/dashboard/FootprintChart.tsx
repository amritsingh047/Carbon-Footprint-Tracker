// src/features/dashboard/FootprintChart.tsx
import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCarbonStore } from '../../store/useCarbonStore';
import { announce } from '../../utils/ariaAnnouncer';

interface FootprintChartProps {
    isDarkMode?: boolean;
}

export const FootprintChart: React.FC<FootprintChartProps> = React.memo(({ isDarkMode = false }) => {
    const logs = useCarbonStore((state) => state.logs);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    // Transform raw logs into daily aggregated savings
    const chartData = useMemo(() => {
        const dailyTotals: Record<string, number> = {};
        logs.forEach((log) => {
            dailyTotals[log.date] = (dailyTotals[log.date] || 0) + log.co2Saved;
        });
        
        return Object.keys(dailyTotals).sort().map((date) => ({
            date,
            saved: Number(dailyTotals[date].toFixed(2)),
        }));
    }, [logs]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (chartData.length === 0) return;

        let nextIndex = focusedIndex;
        if (e.key === 'ArrowRight') {
            nextIndex = Math.min(focusedIndex + 1, chartData.length - 1);
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            nextIndex = Math.max(focusedIndex - 1, 0);
            e.preventDefault();
        }

        if (nextIndex !== focusedIndex && nextIndex >= 0) {
            setFocusedIndex(nextIndex);
            const point = chartData[nextIndex];
            announce(`On ${point.date}, you saved ${point.saved} kilograms of CO2 equivalent.`);
        }
    };

    if (chartData.length === 0) {
        return (
            <div className="p-8 text-center bg-white/40 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-white/50 dark:border-slate-700 shadow-lg transition-colors">
                <p role="status" className="text-teal-900 dark:text-teal-400 font-bold">Log an action to begin tracking your impact trend.</p>
            </div>
        );
    }

    const gridColor = isDarkMode ? '#334155' : '#ccfbf1';
    const axisColor = isDarkMode ? '#94a3b8' : '#0f766e';
    const tooltipBg = isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    const tooltipText = isDarkMode ? '#2dd4bf' : '#0f766e';

    return (
        <section aria-labelledby="chart-heading" className="p-6 bg-white/40 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-xl mt-6 border border-white/50 dark:border-slate-700 transition-colors">
            <h2 id="chart-heading" className="sr-only">Carbon Savings Trend Chart</h2>
            
            {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
            <div 
                style={{ width: '100%', height: 300 }}
                role="application"
                aria-label="A line chart illustrating the total kilograms of CO2 saved per day over the tracking period. Use left and right arrow keys to explore data points."
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className="focus:outline-none focus:ring-4 focus:ring-teal-500 rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-4 border border-white/60 dark:border-slate-600 transition-colors"
            >
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke={axisColor} fontSize={12} tickMargin={10} />
                        <YAxis 
                            label={{ value: 'CO₂ Saved (kg)', angle: -90, position: 'insideLeft', fill: axisColor, style: { textAnchor: 'middle', fontWeight: 'bold' } }} 
                            stroke={axisColor} 
                            fontSize={12} 
                        />
                        <Tooltip 
                            wrapperStyle={{ outline: 'none' }}
                            contentStyle={{ backgroundColor: tooltipBg, backdropFilter: 'blur(8px)', borderRadius: '12px', border: `1px solid ${gridColor}`, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: tooltipText, fontWeight: 'bold' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="saved" 
                            stroke="#0d9488" 
                            strokeWidth={4}
                            dot={{ fill: '#0d9488', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 8, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2, 'aria-label': 'active data point' }} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
            
            {/* Visual indicator for keyboard users showing which point is focused */}
            {focusedIndex >= 0 && (
                <div className="mt-4 text-center text-sm font-bold text-teal-800 dark:text-teal-200 bg-white/50 dark:bg-slate-700/50 py-2 rounded-lg border border-white/40 dark:border-slate-600 transition-colors">
                    Keyboard Focus: {chartData[focusedIndex].date} - {chartData[focusedIndex].saved} kg CO₂e
                </div>
            )}
            
            {/* Screen Reader Only Table */}
            <table className="sr-only" aria-label="Raw carbon footprint data">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">CO₂ Saved (kg)</th>
                    </tr>
                </thead>
                <tbody>
                    {chartData.map((data, idx) => (
                        <tr key={idx}>
                            <td>{data.date}</td>
                            <td>{data.saved}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
});
