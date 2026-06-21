/** @vitest-environment jsdom */  
// tests/ActionList.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionList } from '../src/features/activities/ActionList';
import { useCarbonStore } from '../src/store/useCarbonStore';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Reset the Zustand store before each test to prevent state leakage
const initialState = useCarbonStore.getState();

beforeEach(() => {
    // Mock localStorage for Zustand persist
    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: vi.fn(() => null),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        },
        writable: true
    });
    
    useCarbonStore.setState(initialState, true);
});

describe('ActionList Gamification and Logging', () => {
    it('renders suggested actions and increments the daily streak upon interaction', async () => {
        const user = userEvent.setup();
        render(<ActionList />);
        
        // Query by ARIA role to ensure the accessibility contract is maintained
        const logButtons = screen.getAllByRole('button', { name: /Log action/i });
        expect(logButtons.length).toBeGreaterThan(0);
        
        // Simulate authentic user interaction
        await user.click(logButtons[0]);
        
        // Verify the global state has updated correctly without directly coupling to UI internals
        await waitFor(() => {
            const state = useCarbonStore.getState();
            expect(state.logs.length).toBe(1);
            expect(state.currentStreak).toBe(1);
        });
    });
});
