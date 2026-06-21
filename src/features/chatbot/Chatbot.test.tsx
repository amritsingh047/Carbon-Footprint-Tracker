/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Chatbot } from './Chatbot';
import * as carbonStore from '../../store/useCarbonStore';

describe('Chatbot', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.HTMLElement.prototype.scrollIntoView = vi.fn();

        // Spy on useCarbonStore to mock state returns
        vi.spyOn(carbonStore, 'useCarbonStore').mockImplementation((selector: unknown) => {
            return (selector as (state: unknown) => unknown)({
                logs: [{ co2Saved: 5.0 }, { co2Saved: 2.5 }],
                currentStreak: 10,
            });
        });
    });

    afterEach(() => {
        cleanup();
    });

    it('renders a chatbot toggle button initially', () => {
        render(<Chatbot />);
        const toggleBtn = screen.getByRole('button', { name: /Open chat assistant/i });
        expect(toggleBtn).toBeInTheDocument();
    });

    it('opens chat window and displays welcome message', () => {
        render(<Chatbot />);
        const toggleBtn = screen.getByRole('button', { name: /Open chat assistant/i });
        fireEvent.click(toggleBtn);
        
        expect(screen.getByText('EcoBot')).toBeInTheDocument();
        expect(screen.getByText(/Hi! I am your Carbon Assistant/i)).toBeInTheDocument();
    });

    it('responds correctly to user queries', async () => {
        render(<Chatbot />);
        
        // Open chat
        fireEvent.click(screen.getByRole('button', { name: /Open chat assistant/i }));
        
        // Find input
        const input = screen.getByPlaceholderText('Ask me anything...');
        const sendBtn = screen.getByRole('button', { name: /Send message/i });

        // Type query
        fireEvent.change(input, { target: { value: 'What is my streak?' } });
        fireEvent.click(sendBtn);

        // Verify user message is displayed immediately
        expect(screen.getByText('What is my streak?')).toBeInTheDocument();

        // Wait for bot response
        await waitFor(() => {
            expect(screen.getByText(/Your current streak is 10 days!/i)).toBeInTheDocument();
        });
    });
});
