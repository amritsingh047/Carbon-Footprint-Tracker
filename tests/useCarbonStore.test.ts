import { describe, it, expect, beforeEach } from 'vitest';
import { useCarbonStore } from '../src/store/useCarbonStore';

describe('useCarbonStore', () => {
    beforeEach(() => {
        useCarbonStore.getState().resetData();
    });

    it('should set baseline co2', () => {
        useCarbonStore.getState().setBaseline(5000);
        expect(useCarbonStore.getState().baselineCo2).toBe(5000);
        expect(useCarbonStore.getState().isBoarded).toBe(true);
    });

    it('should log an action and calculate streak', () => {
        const action = {
            id: '1',
            title: 'Plant-based meal',
            co2Saved: 2.5,
            date: new Date().toISOString()
        };
        
        useCarbonStore.getState().logAction(action);
        
        const state = useCarbonStore.getState();
        expect(state.logs.length).toBe(1);
        expect(state.logs[0].title).toBe('Plant-based meal');
        expect(state.currentStreak).toBe(1);
    });
});
