# Controllers

This folder contains business logic and API integration for the weather application.

## Files

- `weather.controller.ts` - Open-Meteo weather API calls and data processing
- `location.controller.ts` - Country list and coordinate mapping
- `theme.controller.ts` - Theme management and CSS variable application

## Architecture

Controllers handle all business logic, API calls, and data transformations. Views call controllers to get/set data, keeping the view layer stateless and focused on presentation.
