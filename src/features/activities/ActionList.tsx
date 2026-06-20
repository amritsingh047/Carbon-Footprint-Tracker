// src/features/activities/ActionList.tsx

import { useCarbonStore } from '../../store/useCarbonStore';

const SUGGESTED_ACTIONS = [
    { id: 'act_1', title: 'Replaced beef with plant-based meal', co2Saved: 1.8 },
    { id: 'act_2', title: 'Air-dried laundry instead of machine', co2Saved: 2.1 },
    { id: 'act_3', title: 'Took the bus instead of driving (20km)', co2Saved: 1.92 },
];

export const ActionList: React.FC = () => {
    const logAction = useCarbonStore((state) => state.logAction);
    const currentStreak = useCarbonStore((state) => state.currentStreak);

    const handleActionClick = (action: typeof SUGGESTED_ACTIONS[0]) => {
        logAction({
            id: crypto.randomUUID(),
            title: action.title,
            co2Saved: action.co2Saved,
            date: new Date().toISOString(),
        });
    };

    return (
        <section aria-labelledby="actions-heading" className="p-4 bg-white rounded-lg shadow-md">
            <header className="flex justify-between items-center mb-6">
                <h2 id="actions-heading" className="text-xl font-bold text-gray-800">Daily Sustainable Actions</h2>
                <div className="flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-bold" aria-live="polite">
                    <span>{currentStreak} Day Streak</span>
                </div>
            </header>
            
            <div role="list" className="grid gap-4">
                {SUGGESTED_ACTIONS.map((action) => (
                    <article key={action.id} role="listitem" className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-green-300">
                        <div>
                            <h3 className="font-semibold text-lg text-gray-800">{action.title}</h3>
                            <p className="text-sm text-gray-600 font-medium">Saves {action.co2Saved} kg CO2e</p>
                        </div>
                        <button
                            onClick={() => handleActionClick(action)}
                            aria-label={`Log action: ${action.title}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors whitespace-nowrap w-full sm:w-auto"
                        >
                            Log Action
                        </button>
                    </article>
                ))}
            </div>
        </section>
    );
};
