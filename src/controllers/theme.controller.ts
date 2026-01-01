/**
 * Theme Controller - handles theme switching and persistence
 */

import { type ThemeName, THEMES, DEFAULT_THEME } from '../models/theme.model';

const STORAGE_KEY = 'weather-app-theme';

/** Get available themes */
export function getThemes() {
    return THEMES;
}

/** Apply theme to document */
export function applyTheme(theme: ThemeName): void {
    if (typeof document === 'undefined') return;

    // Remove all theme classes
    document.body.classList.remove('theme-white', 'theme-dark', 'theme-pink', 'theme-contrasty');

    // Add new theme class
    document.body.classList.add(`theme-${theme}`);

    // Persist to localStorage
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // localStorage may not be available
    }
}

/** Get saved theme from localStorage */
export function getSavedTheme(): ThemeName {
    if (typeof localStorage === 'undefined') return DEFAULT_THEME;

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && THEMES.some(t => t.name === saved)) {
            return saved as ThemeName;
        }
    } catch {
        // localStorage may not be available
    }

    return DEFAULT_THEME;
}

/** Initialize theme on page load */
export function initializeTheme(): ThemeName {
    const theme = getSavedTheme();
    applyTheme(theme);
    return theme;
}
