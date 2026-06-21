// src/features/activities/ActionList.tsx

import { useCarbonStore } from '../../store/useCarbonStore';
import { announce } from '../../utils/ariaAnnouncer';

const SUGGESTED_ACTIONS = [
    { id: 'act_1', title: 'Replaced beef with plant-based meal', co2Saved: 1.8 },
    { id: 'act_2', title: 'Air-dried laundry instead of machine', co2Saved: 2.1 },
    { id: 'act_3', title: 'Took the bus instead of driving (20km)', co2Saved: 1.92 },
];

import React from 'react';

export const ActionList: React.FC = React.memo(() => {
    const logAction = useCarbonStore((state) => state.logAction);
    const currentStreak = useCarbonStore((state) => state.currentStreak);

    const handleActionClick = (action: typeof SUGGESTED_ACTIONS[0]) => {
        const previousStreak = currentStreak;
        
        logAction({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            title: action.title,
            co2Saved: action.co2Saved,
            date: new Date().toISOString(),
        });
        
        // Use Zustand's current state immediately after update to check streak
        const newStreak = useCarbonStore.getState().currentStreak;
        let announcement = `Successfully logged ${action.title}. Saved ${action.co2Saved} kg of CO2e.`;
        
        if (newStreak > previousStreak) {
            announcement += ` Congratulations! You have reached a ${newStreak} day streak.`;
        }
        
        announce(announcement);
    };

    return (
        <section aria-labelledby="actions-heading" className="p-6 bg-white/40 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 dark:border-slate-700 transition-colors">
            <header className="flex justify-between items-center mb-6">
                <h2 id="actions-heading" className="text-2xl font-black text-teal-900 dark:text-teal-400 drop-shadow-sm transition-colors">Daily Sustainable Actions</h2>
                <div className="flex items-center gap-2 bg-orange-500/20 dark:bg-orange-500/30 text-orange-900 dark:text-orange-200 px-4 py-1.5 rounded-full font-bold border border-orange-500/30 dark:border-orange-500/50 backdrop-blur-sm shadow-inner transition-colors" aria-live="polite">
                    <span>{currentStreak} Day Streak</span>
                </div>
            </header>
            
            <div role="list" className="grid gap-4">
                {SUGGESTED_ACTIONS.map((action) => (
                    <article key={action.id} role="listitem" className="bg-white/50 dark:bg-slate-700/60 backdrop-blur-sm border border-white/60 dark:border-slate-600 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-white/70 dark:hover:bg-slate-700 hover:shadow-md hover:-translate-y-0.5">
                        <div>
                            <h3 className="font-bold text-lg text-teal-900 dark:text-teal-300 transition-colors">{action.title}</h3>
                            <p className="text-sm text-teal-700 dark:text-teal-400 font-semibold mt-1 transition-colors">Saves {action.co2Saved} kg CO₂e</p>
                        </div>
                        <button
                            onClick={() => handleActionClick(action)}
                            aria-label={`Log action: ${action.title}`}
                            className="bg-teal-600 dark:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-teal-500 dark:hover:bg-teal-600 focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800 focus:outline-none transition-all shadow-md transform hover:scale-105 active:scale-95 whitespace-nowrap w-full sm:w-auto"
                        >
                            Log Action
                        </button>
                    </article>
                ))}
            </div>
        </section>
    );
});
