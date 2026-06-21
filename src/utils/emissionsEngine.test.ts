import { describe, it, expect } from 'vitest';
import { calculateAnnualFootprint, EMISSION_FACTORS } from './emissionsEngine';
import type { UserContext } from './emissionsEngine';

describe('Emissions Engine', () => {
    it('calculates the baseline correctly for average context', () => {
        const context: UserContext = {
            monthlyElectricityKWh: 300,
            weeklyDrivingKm: 50,
            weeklyPublicTransitKm: 0,
            dietType: 'average',
            flightsPerYear: 2,
            wasteType: 'trash',
            shoppingHabits: 'average',
        };

        const result = calculateAnnualFootprint(context);
        
        const expectedElectricity = 300 * 12 * EMISSION_FACTORS.electricity_kwh;
        const expectedDriving = 50 * 52 * EMISSION_FACTORS.transport_car_km;
        const expectedDiet = EMISSION_FACTORS.diet_average_daily * 365;
        const expectedFlights = 2 * EMISSION_FACTORS.flight_round_trip;
        const expectedWaste = EMISSION_FACTORS.waste_trash_annual;
        const expectedShopping = EMISSION_FACTORS.shopping_average_annual;
        
        const expectedTotal = expectedElectricity + expectedDriving + expectedDiet + expectedFlights + expectedWaste + expectedShopping;
        
        expect(result).toBeCloseTo(expectedTotal, 2);
    });

    it('calculates correctly for low emission context', () => {
        const context: UserContext = {
            monthlyElectricityKWh: 100,
            weeklyDrivingKm: 0,
            weeklyPublicTransitKm: 50,
            dietType: 'plant_based',
            flightsPerYear: 0,
            wasteType: 'compost_recycle',
            shoppingHabits: 'rare',
        };

        const result = calculateAnnualFootprint(context);
        expect(result).toBeGreaterThan(0);
    });
});
