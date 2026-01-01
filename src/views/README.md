# Views

This folder contains stateless React components for the weather application.

## Files

- `WeatherCard.tsx` - Displays weather information (temperature, conditions, etc.)
- `CountryDropdown.tsx` - Country selection dropdown with search
- `ThemeSwitcher.tsx` - Theme selection controls
- `Header.tsx` - Application header with branding and theme switcher
- `LoadingSpinner.tsx` - Loading state indicator

## Architecture

Views are pure, stateless components that receive data via props and emit events via callbacks. They contain no business logic or API calls - all data operations are delegated to controllers.
