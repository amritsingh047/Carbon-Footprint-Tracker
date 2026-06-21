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
                : 'average'
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const safeData = sanitizeData(formData);
        const annualFootprint = calculateAnnualFootprint(safeData);
        setBaseline(annualFootprint);
    };

    return (
        <form onSubmit={handleSubmit} aria-labelledby="onboarding-heading" className="p-8 max-w-md mx-auto bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
            <h2 id="onboarding-heading" className="text-2xl font-black mb-6 text-teal-900 drop-shadow-sm text-center">Establish Your Baseline</h2>
            
            <fieldset className="mb-5">
                <legend className="sr-only">Energy Consumption</legend>
                <label htmlFor="electricity" className="block text-sm font-bold text-teal-900 mb-1">
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
                    className="block w-full rounded-xl border border-white/40 bg-white/60 px-4 py-3 shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder-teal-700/50 text-teal-900"
                    placeholder="e.g. 300"
                />
            </fieldset>

            <fieldset className="mb-5">
                <legend className="sr-only">Transportation Habits</legend>
                <label htmlFor="driving" className="block text-sm font-bold text-teal-900 mb-1">
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
                    className="block w-full rounded-xl border border-white/40 bg-white/60 px-4 py-3 shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder-teal-700/50 text-teal-900"
                    placeholder="e.g. 50"
                />
            </fieldset>

            <fieldset className="mb-8">
                <label htmlFor="diet" className="block text-sm font-bold text-teal-900 mb-1">
                    Primary Diet
                </label>
                <select
                    id="diet"
                    value={formData.dietType}
                    onChange={(e) => setFormData({ ...formData, dietType: e.target.value as UserContext['dietType'] })}
                    className="block w-full rounded-xl border border-white/40 bg-white/60 px-4 py-3 shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all text-teal-900"
                >
                    <option value="meat_heavy">Meat Heavy</option>
                    <option value="average">Average</option>
                    <option value="plant_based">Plant Based</option>
                </select>
            </fieldset>

            <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-lg font-bold text-white bg-teal-600 hover:bg-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all transform hover:scale-[1.02] active:scale-95"
            >
                Calculate My Footprint
            </button>
        </form>
    );
};
