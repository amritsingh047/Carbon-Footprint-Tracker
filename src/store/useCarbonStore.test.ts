/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCarbonStore } from './useCarbonStore';

// Mock zustand persist to avoid localstorage issues during tests
vi.mock('zustand/middleware', () => {
    return {
        persist: (config: unknown) => config,
        createJSONStorage: () => ({}),
    };
});

describe('useCarbonStore', () => {
    beforeEach(() => {
        useCarbonStore.setState({
            baselineCo2: 0,
            isBoarded: false,
            logs: [],
            currentStreak: 0,
            lastLogDate: null
        });
    });

    it('sets baseline correctly', () => {
        useCarbonStore.getState().setBaseline(1500);
        expect(useCarbonStore.getState().baselineCo2).toBe(1500);
        expect(useCarbonStore.getState().isBoarded).toBe(true);
    });

    it('logs an action and increments streak', () => {
        const today = new Date().toISOString().split('T')[0];
        useCarbonStore.getState().logAction({
            id: '1',
            title: 'Test Action',
            co2Saved: 1.5,
            date: today
        });
        
        const state = useCarbonStore.getState();
        expect(state.logs).toHaveLength(1);
        expect(state.logs[0].co2Saved).toBe(1.5);
        expect(state.currentStreak).toBe(1);
    });

    it('resets data correctly', () => {
        useCarbonStore.setState({ baselineCo2: 500, isBoarded: true });
        useCarbonStore.getState().resetData();
        
        const state = useCarbonStore.getState();
        expect(state.baselineCo2).toBe(0);
        expect(state.isBoarded).toBe(false);
        expect(state.logs).toHaveLength(0);
    });
});
