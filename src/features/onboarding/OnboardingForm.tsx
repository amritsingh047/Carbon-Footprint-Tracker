// src/features/onboarding/OnboardingForm.tsx
import { useState } from 'react';
import { useCarbonStore } from '../../store/useCarbonStore';
import { calculateAnnualFootprint } from '../../utils/emissionsEngine';
import type { UserContext } from '../../utils/emissionsEngine';

export const OnboardingForm: React.FC = () => {
    const setBaseline = useCarbonStore((state) => state.setBaseline);
    const [formData, setFormData] = useState<UserContext>({
        monthlyElectricityKWh: 0,
        weeklyDrivingKm: 0,
        weeklyPublicTransitKm: 0,
        dietType: 'average',
        flightsPerYear: 0,
        wasteType: 'trash',
        shoppingHabits: 'average',
    });

    const sanitizeData = (data: UserContext): UserContext => {
        return {
            // Clamp electricity between 0 and 100,000 kWh
            monthlyElectricityKWh: Math.max(0, Math.min(100000, Number(data.monthlyElectricityKWh) || 0)),
            // Clamp driving between 0 and 10,000 km
            weeklyDrivingKm: Math.max(0, Math.min(10000, Number(data.weeklyDrivingKm) || 0)),
            weeklyPublicTransitKm: 0,
            dietType: ['meat_heavy', 'average', 'plant_based'].includes(data.dietType) 
                ? data.dietType 
                : 'average',
            // Clamp flights between 0 and 1000
            flightsPerYear: Math.max(0, Math.min(1000, Number(data.flightsPerYear) || 0)),
            wasteType: ['compost_recycle', 'trash'].includes(data.wasteType) ? data.wasteType : 'trash',
            shoppingHabits: ['frequent', 'average', 'rare'].includes(data.shoppingHabits) ? data.shoppingHabits : 'average',
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const safeData = sanitizeData(formData);
        const annualFootprint = calculateAnnualFootprint(safeData);
        setBaseline(annualFootprint);
    };

    return (
        <form onSubmit={handleSubmit} aria-labelledby="onboarding-heading" className="p-8 max-w-md mx-auto bg-white/40 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700 transition-colors">
            <h2 id="onboarding-heading" className="text-2xl font-black mb-6 text-teal-900 dark:text-teal-400 drop-shadow-sm text-center">Establish Your Baseline</h2>
            
            <fieldset className="mb-5">
                <legend className="sr-only">Energy Consumption</legend>
                <label htmlFor="electricity" className="block text-sm font-bold text-teal-900 dark:text-gray-200 mb-1">
                    Monthly Electricity (kWh)
                </label>
                <input
                    id="electricity"
                    type="number"
                    min="0"
                    max="100000"
                    value={formData.monthlyElectricityKWh || ''}
                    onChange={(e) => setFormData({ ...formData, monthlyElectricityKWh: parseFloat(e.target.value) })}
                    aria-required="true"
                    className="block w-full rounded-xl border border-white/40 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 px-4 py-3 shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder-teal-700/50 dark:placeholder-gray-400 text-teal-900 dark:text-gray-100"
                    placeholder="e.g. 300"
                />
            </fieldset>

            <fieldset className="mb-5">
                <legend className="sr-only">Transportation Habits</legend>
                <label htmlFor="driving" className="block text-sm font-bold text-teal-900 dark:text-gray-200 mb-1">
                    Weekly Driving (km)
                </label>
                <input
                    id="driving"
                    type="number"
                    min="0"
                    max="10000"
                    value={formData.weeklyDrivingKm || ''}
                    onChange={(e) => setFormData({ ...formData, weeklyDrivingKm: parseFloat(e.target.value) })}
                    aria-required="true"
                    className="block w-full rounded-xl border border-white/40 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 px-4 py-3 shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder-teal-700/50 dark:placeholder-gray-400 text-teal-900 dark:text-gray-100"
                    placeholder="e.g. 50"
                />
            </fieldset>

            <fieldset className="mb-5">
                <legend className="sr-only">Flights</legend>
                <label htmlFor="flights" className="block text-sm font-bold text-teal-900 dark:text-gray-200 mb-1">
                    Round-trip Flights (per year)
                </label>
                <input
                    id="flights"
                    type="number"
                    min="0"
                    max="1000"
                    value={formData.flightsPerYear || ''}
                    onChange={(e) => setFormData({ ...formData, flightsPerYear: parseFloat(e.target.value) })}
                    aria-required="true"
                    className="block w-full rounded-xl border border-white/40 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 px-4 py-3 shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder-teal-700/50 dark:placeholder-gray-400 text-teal-900 dark:text-gray-100"
                    placeholder="e.g. 2"
                />
            </fieldset>

            <fieldset className="mb-5">
                <label htmlFor="diet" className="block text-sm font-bold text-teal-900 dark:text-gray-200 mb-1">
                    Primary Diet
                </label>
                <select
                    id="diet"
                    value={formData.dietType}
                    onChange={(e) => setFormData({ ...formData, dietType: e.target.value as UserContext['dietType'] })}
                    className="block w-full rounded-xl border border-white/40 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 px-4 py-3 shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all text-teal-900 dark:text-gray-100"
                >
                    <option value="meat_heavy">Meat Heavy</option>
                    <option value="average">Average</option>
                    <option value="plant_based">Plant Based</option>
                </select>
            </fieldset>

            <fieldset className="mb-5">
                <label htmlFor="waste" className="block text-sm font-bold text-teal-900 dark:text-gray-200 mb-1">
                    Waste Management
                </label>
                <select
                    id="waste"
                    value={formData.wasteType}
                    onChange={(e) => setFormData({ ...formData, wasteType: e.target.value as UserContext['wasteType'] })}
                    className="block w-full rounded-xl border border-white/40 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 px-4 py-3 shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all text-teal-900 dark:text-gray-100"
                >
                    <option value="compost_recycle">I compost and recycle</option>
                    <option value="trash">I throw most things in the trash</option>
                </select>
            </fieldset>

            <fieldset className="mb-8">
                <label htmlFor="shopping" className="block text-sm font-bold text-teal-900 dark:text-gray-200 mb-1">
                    Shopping Habits
                </label>
                <select
                    id="shopping"
                    value={formData.shoppingHabits}
                    onChange={(e) => setFormData({ ...formData, shoppingHabits: e.target.value as UserContext['shoppingHabits'] })}
                    className="block w-full rounded-xl border border-white/40 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 px-4 py-3 shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all text-teal-900 dark:text-gray-100"
                >
                    <option value="frequent">Frequent (Buy new often)</option>
                    <option value="average">Average</option>
                    <option value="rare">Rare (Buy used or rarely)</option>
                </select>
            </fieldset>

            <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-lg font-bold text-white bg-teal-600 dark:bg-teal-700 hover:bg-teal-500 dark:hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all transform hover:scale-[1.02] active:scale-95"
            >
                Calculate My Footprint
            </button>
        </form>
    );
};
