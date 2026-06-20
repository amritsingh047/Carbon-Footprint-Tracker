// src/utils/emissionsEngine.ts

/**
 * Core emission factors based on international and regional averages.
 * Units are defined strictly as kg CO2e per designated activity unit.
 */
export const EMISSION_FACTORS = {
    electricity_kwh: 0.727, // kg CO2e per kWh [cite: 3]
    transport_car_km: 0.111, // kg CO2e per km
    transport_bus_km: 0.015, // kg CO2e per km
    transport_rail_km: 0.035, // kg CO2e per km [cite: 13]
    diet_meat_heavy_daily: 3.3, // Estimated daily kg CO2e
    diet_average_daily: 2.5, // Estimated daily kg CO2e
    diet_plant_based_daily: 1.5, // Estimated daily kg CO2e
    waste_kg: 0.647, // kg CO2e per kg of general waste [cite: 10]
};

export interface UserContext {
    monthlyElectricityKWh: number;
    weeklyDrivingKm: number;
    weeklyPublicTransitKm: number;
    dietType: 'meat_heavy' | 'average' | 'plant_based';
}

/**
 * Calculates the total annual carbon footprint based on user onboarding context.
 * @param context UserContext object containing lifestyle metrics
 * @returns Total annual footprint in kg CO2e
 */
export const calculateAnnualFootprint = (context: UserContext): number => {
    const annualElectricity = context.monthlyElectricityKWh * 12 * EMISSION_FACTORS.electricity_kwh;
    const annualDriving = context.weeklyDrivingKm * 52 * EMISSION_FACTORS.transport_car_km;
    const annualTransit = context.weeklyPublicTransitKm * 52 * EMISSION_FACTORS.transport_bus_km;
    
    let dailyDietFactor = EMISSION_FACTORS.diet_average_daily;
    if (context.dietType === 'meat_heavy') dailyDietFactor = EMISSION_FACTORS.diet_meat_heavy_daily;
    if (context.dietType === 'plant_based') dailyDietFactor = EMISSION_FACTORS.diet_plant_based_daily;
    
    const annualDiet = dailyDietFactor * 365;
    return annualElectricity + annualDriving + annualTransit + annualDiet;
};
