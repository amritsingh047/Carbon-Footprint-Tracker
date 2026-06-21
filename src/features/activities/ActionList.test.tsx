/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ActionList } from './ActionList';
import * as carbonStore from '../../store/useCarbonStore';
import * as ariaAnnouncer from '../../utils/ariaAnnouncer';

vi.mock('../../utils/ariaAnnouncer', () => ({
    announce: vi.fn()
}));

describe('ActionList', () => {
    let mockLogAction: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockLogAction = vi.fn();

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

        // Use real store but spy on logAction
        vi.spyOn(carbonStore.useCarbonStore.getState(), 'logAction').mockImplementation(mockLogAction as any);
    });

    it('renders suggested actions correctly', () => {
        render(<ActionList />);
        
        expect(screen.getByRole('heading', { name: /Daily Sustainable Actions/i })).toBeInTheDocument();
        expect(screen.getByText('0 Day Streak')).toBeInTheDocument();
        
        expect(screen.getByText('Replaced beef with plant-based meal')).toBeInTheDocument();
        expect(screen.getByText('Air-dried laundry instead of machine')).toBeInTheDocument();
    });

    it('logs an action and announces it when a button is clicked', () => {
        render(<ActionList />);
        
        const logButtons = screen.getAllByRole('button', { name: /Log action/i });
        
        fireEvent.click(logButtons[0]);
        
        expect(mockLogAction).toHaveBeenCalledTimes(1);
        expect(mockLogAction).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Replaced beef with plant-based meal',
            co2Saved: 1.8,
        }));

        expect(ariaAnnouncer.announce).toHaveBeenCalled();
        expect(vi.mocked(ariaAnnouncer.announce).mock.calls[0][0]).toContain('Successfully logged Replaced beef with plant-based meal. Saved 1.8 kg of CO2e');
    });
});
