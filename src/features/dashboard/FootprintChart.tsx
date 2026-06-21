// src/features/dashboard/FootprintChart.tsx
import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCarbonStore } from '../../store/useCarbonStore';
import { announce } from '../../utils/ariaAnnouncer';

export const FootprintChart: React.FC = React.memo(() => {
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
            <div className="p-8 text-center bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg">
                <p role="status" className="text-teal-900 font-bold">Log an action to begin tracking your impact trend.</p>
            </div>
        );
    }

    return (
        <section aria-labelledby="chart-heading" className="p-6 bg-white/40 backdrop-blur-xl rounded-2xl shadow-xl mt-6 border border-white/50">
            <h2 id="chart-heading" className="sr-only">Carbon Savings Trend Chart</h2>
            
            <div 
                style={{ width: '100%', height: 300 }}
                role="application"
                aria-label="A line chart illustrating the total kilograms of CO2 saved per day over the tracking period. Use left and right arrow keys to explore data points."
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className="focus:outline-none focus:ring-4 focus:ring-teal-500 rounded-xl bg-white/60 backdrop-blur-sm p-4 border border-white/60"
            >
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                        <CartesianGrid stroke="#ccfbf1" strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="#0f766e" fontSize={12} tickMargin={10} />
                        <YAxis 
                            label={{ value: 'CO₂ Saved (kg)', angle: -90, position: 'insideLeft', fill: '#0f766e', style: { textAnchor: 'middle', fontWeight: 'bold' } }} 
                            stroke="#0f766e" 
                            fontSize={12} 
                        />
                        <Tooltip 
                            wrapperStyle={{ outline: 'none' }}
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#0f766e', fontWeight: 'bold' }}
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
            
            {/* Visual indicator for keyboard users showing which point is focused */}
            {focusedIndex >= 0 && (
                <div className="mt-4 text-center text-sm font-bold text-teal-800 bg-white/50 py-2 rounded-lg border border-white/40">
                    Keyboard Focus: {chartData[focusedIndex].date} - {chartData[focusedIndex].saved} kg CO₂e
                </div>
            )}
        </section>
    );
});
