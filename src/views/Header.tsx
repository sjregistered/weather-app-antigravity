/**
 * Header - Application header with logo and controls
 * Stateless component - receives theme controls via props
 */

import type { ThemeName, ThemeOption } from '../models/theme.model';
import { ThemeSwitcher } from './ThemeSwitcher';

interface HeaderProps {
    themes: ThemeOption[];
    currentTheme: ThemeName;
    onThemeChange: (theme: ThemeName) => void;
}

export function Header({ themes, currentTheme, onThemeChange }: HeaderProps) {
    return (
        <header className="header">
            <div className="header__title">
                <span>🌤️</span>
                <span>WeatherNow</span>
            </div>
            <div className="header__controls">
                <ThemeSwitcher
                    themes={themes}
                    currentTheme={currentTheme}
                    onThemeChange={onThemeChange}
                />
            </div>
        </header>
    );
}
