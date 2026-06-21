// src/store/useCarbonStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';

const idbStorage: StateStorage = {
  getItem: async (name): Promise<string | null> => (await get(name)) || null,
  setItem: async (name, value): Promise<void> => set(name, value),
  removeItem: async (name): Promise<void> => del(name),
};

export interface ActionLog {
    id: string;
    title: string;
    co2Saved: number; // quantified in kg CO2e
    date: string; // ISO 8601 string format
}

interface CarbonState {
    baselineCo2: number;
    isBoarded: boolean;
    logs: ActionLog[];
    currentStreak: number;
    lastLogDate: string | null;
    geminiApiKey: string | null;
    setBaseline: (co2: number) => void;
    logAction: (action: ActionLog) => void;
    setApiKey: (key: string) => void;
    clearApiKey: () => void;
    resetData: () => void;
    exportData: () => string;
    importData: (jsonData: string) => boolean;
}

export const useCarbonStore = create<CarbonState>()(
    persist(
        (set, get) => ({
            baselineCo2: 0,
            isBoarded: false,
            logs: [],
            currentStreak: 0,
            lastLogDate: null,
            geminiApiKey: null,
            
            setBaseline: (co2) => set({ baselineCo2: co2, isBoarded: true }),
            
            logAction: (action) => {
                const state = get();
                // Normalize date to YYYY-MM-DD to avoid timezone hour shifts
                const today = new Date().toISOString().split('T')[0];
                let newStreak = state.currentStreak;
                
                if (state.lastLogDate) {
                    const lastDate = new Date(state.lastLogDate);
                    const currentDate = new Date(today);
                    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === 1) {
                        newStreak += 1; // Consecutive day logged
                    } else if (diffDays > 1) {
                        newStreak = 1; // Streak broken, restart count
                    }
                } else {
                    newStreak = 1; // Initial logged action
                }
                
                const newLogs = [...state.logs, { ...action, date: today }];
                if (newLogs.length > 500) {
                    newLogs.shift();
                }

                set({
                    logs: newLogs,
                    currentStreak: newStreak,
                    lastLogDate: today,
                });
            },
            
            setApiKey: (key: string) => set({ geminiApiKey: key }),
            clearApiKey: () => set({ geminiApiKey: null }),
            
            resetData: () => set({ baselineCo2: 0, isBoarded: false, logs: [], currentStreak: 0, lastLogDate: null, geminiApiKey: null }),

            exportData: () => {
                const state = get();
                const payload = {
                    baselineCo2: state.baselineCo2,
                    isBoarded: state.isBoarded,
                    logs: state.logs,
                    currentStreak: state.currentStreak,
                    lastLogDate: state.lastLogDate
                };
                return JSON.stringify(payload, null, 2);
            },

            importData: (jsonData) => {
                try {
                    const parsed = JSON.parse(jsonData);
                    if (typeof parsed.baselineCo2 !== 'number' || !Array.isArray(parsed.logs)) {
                        return false; // Basic validation failed
                    }
                    set({
                        baselineCo2: parsed.baselineCo2,
                        isBoarded: !!parsed.isBoarded,
                        logs: parsed.logs,
                        currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
                        lastLogDate: parsed.lastLogDate || null
                    });
                    return true;
                } catch {
                    return false;
                }
            }
        }),
        {
            name: 'carbon-tracker-storage',
            storage: createJSONStorage(() => idbStorage),
        }
    )
);
