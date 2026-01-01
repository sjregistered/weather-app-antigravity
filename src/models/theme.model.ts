/**
 * Theme model - defines available themes and color interfaces
 */

/** Available theme options */
export type ThemeName = 'white' | 'dark' | 'pink' | 'contrasty';

/** Theme metadata for UI display */
export interface ThemeOption {
    name: ThemeName;
    label: string;
    icon: string;
    preview: string; // Primary color for preview
}

/** All available themes */
export const THEMES: ThemeOption[] = [
    { name: 'white', label: 'Light', icon: '☀️', preview: '#ffffff' },
    { name: 'dark', label: 'Dark', icon: '🌙', preview: '#1a1a2e' },
    { name: 'pink', label: 'Pink', icon: '🌸', preview: '#ff6b9d' },
    { name: 'contrasty', label: 'High Contrast', icon: '◐', preview: '#000000' },
];

/** Default theme */
export const DEFAULT_THEME: ThemeName = 'white';
