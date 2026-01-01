/**
 * ThemeSwitcher - Theme selection controls
 * Stateless component - receives theme state via props
 */

import type { ThemeName, ThemeOption } from '../models/theme.model';

interface ThemeSwitcherProps {
    themes: ThemeOption[];
    currentTheme: ThemeName;
    onThemeChange: (theme: ThemeName) => void;
}

export function ThemeSwitcher({ themes, currentTheme, onThemeChange }: ThemeSwitcherProps) {
    return (
        <div className="theme-switcher" role="radiogroup" aria-label="Select theme">
            {themes.map((theme) => (
                <button
                    key={theme.name}
                    className={`theme-switcher__btn ${currentTheme === theme.name ? 'theme-switcher__btn--active' : ''}`}
                    onClick={() => onThemeChange(theme.name)}
                    aria-label={theme.label}
                    aria-checked={currentTheme === theme.name}
                    role="radio"
                    title={theme.label}
                >
                    {theme.icon}
                </button>
            ))}
        </div>
    );
}
