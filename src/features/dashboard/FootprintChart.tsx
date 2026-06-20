// src/features/dashboard/FootprintChart.tsx
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCarbonStore } from '../../store/useCarbonStore';

export const FootprintChart: React.FC = () => {
    const logs = useCarbonStore((state) => state.logs);

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

    if (chartData.length === 0) {
        return (
            <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                <p role="status" className="text-gray-600 font-medium">Log an action to begin tracking your impact trend.</p>
            </div>
        );
    }

    return (
        <section aria-labelledby="chart-heading" className="p-4 bg-white rounded-lg shadow-md mt-6">
            <h2 id="chart-heading" className="sr-only">Carbon Savings Trend Chart</h2>
            
            <div 
                style={{ width: '100%', height: 300 }}
                role="img"
                aria-label="A line chart illustrating the total kilograms of CO2 saved per day over the tracking period."
                tabIndex={0}
                className="focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg"
            >
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
                        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickMargin={10} />
                        <YAxis 
                            label={{ value: 'CO2 Saved (kg)', angle: -90, position: 'insideLeft', fill: '#4b5563', style: { textAnchor: 'middle' } }} 
                            stroke="#6b7280" 
                            fontSize={12} 
                        />
                        <Tooltip 
                            wrapperStyle={{ outline: 'none' }}
                            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="saved" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            activeDot={{ r: 8, 'aria-label': 'data point' }} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};
