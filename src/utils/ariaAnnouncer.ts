// src/utils/ariaAnnouncer.ts

/**
 * Creates and updates an ARIA live region for screen reader announcements.
 */
export const announce = (message: string) => {
    let announcer = document.getElementById('aria-announcer');
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'aria-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only'; // Tailwind utility to hide visually
        document.body.appendChild(announcer);
    }
    // Briefly clear and set to re-trigger screen readers for identical consecutive messages
    announcer.textContent = '';
    setTimeout(() => {
        if (announcer) {
            announcer.textContent = message;
        }
    }, 50);
};
