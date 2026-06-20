// src/features/onboarding/OnboardingForm.tsx
import React, { useState } from 'react';
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const annualFootprint = calculateAnnualFootprint(formData);
        setBaseline(annualFootprint);
    };

    return (
        <form onSubmit={handleSubmit} aria-labelledby="onboarding-heading" className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h2 id="onboarding-heading" className="text-2xl font-bold mb-4 text-gray-800">Establish Your Baseline</h2>
            
            <fieldset className="mb-4">
                <legend className="sr-only">Energy Consumption</legend>
                <label htmlFor="electricity" className="block text-sm font-medium text-gray-700">
                    Monthly Electricity (kWh)
                </label>
                <input
                    id="electricity"
                    type="number"
                    min="0"
                    value={formData.monthlyElectricityKWh}
                    onChange={(e) => setFormData({ ...formData, monthlyElectricityKWh: Number(e.target.value) })}
                    aria-required="true"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
                />
            </fieldset>

            <fieldset className="mb-4">
                <legend className="sr-only">Transportation Habits</legend>
                <label htmlFor="driving" className="block text-sm font-medium text-gray-700">
                    Weekly Driving (km)
                </label>
                <input
                    id="driving"
                    type="number"
                    min="0"
                    value={formData.weeklyDrivingKm}
                    onChange={(e) => setFormData({ ...formData, weeklyDrivingKm: Number(e.target.value) })}
                    aria-required="true"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
                />
            </fieldset>

            <fieldset className="mb-6">
                <label htmlFor="diet" className="block text-sm font-medium text-gray-700">
                    Primary Diet
                </label>
                <select
                    id="diet"
                    value={formData.dietType}
                    onChange={(e) => setFormData({ ...formData, dietType: e.target.value as UserContext['dietType'] })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
                >
                    <option value="meat_heavy">Meat Heavy</option>
                    <option value="average">Average</option>
                    <option value="plant_based">Plant Based</option>
                </select>
            </fieldset>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
                Calculate My Footprint
            </button>
        </form>
    );
};
