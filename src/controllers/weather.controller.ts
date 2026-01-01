/**
 * Weather Controller - handles Open-Meteo API calls and data processing
 */

import type { WeatherData, WeatherDisplay, ForecastDay } from '../models/weather.model';
import type { Coordinates } from '../models/location.model';

const API_BASE = 'https://api.open-meteo.com/v1/forecast';

/** Weather code to description and icon mapping */
const WEATHER_CODES: Record<number, { description: string; icon: string; nightIcon: string }> = {
    0: { description: 'Clear sky', icon: '☀️', nightIcon: '🌙' },
    1: { description: 'Mainly clear', icon: '🌤️', nightIcon: '🌙' },
    2: { description: 'Partly cloudy', icon: '⛅', nightIcon: '☁️' },
    3: { description: 'Overcast', icon: '☁️', nightIcon: '☁️' },
    45: { description: 'Foggy', icon: '🌫️', nightIcon: '🌫️' },
    48: { description: 'Depositing rime fog', icon: '🌫️', nightIcon: '🌫️' },
    51: { description: 'Light drizzle', icon: '🌧️', nightIcon: '🌧️' },
    53: { description: 'Moderate drizzle', icon: '🌧️', nightIcon: '🌧️' },
    55: { description: 'Dense drizzle', icon: '🌧️', nightIcon: '🌧️' },
    61: { description: 'Slight rain', icon: '🌧️', nightIcon: '🌧️' },
    63: { description: 'Moderate rain', icon: '🌧️', nightIcon: '🌧️' },
    65: { description: 'Heavy rain', icon: '🌧️', nightIcon: '🌧️' },
    66: { description: 'Light freezing rain', icon: '🌨️', nightIcon: '🌨️' },
    67: { description: 'Heavy freezing rain', icon: '🌨️', nightIcon: '🌨️' },
    71: { description: 'Slight snow', icon: '🌨️', nightIcon: '🌨️' },
    73: { description: 'Moderate snow', icon: '❄️', nightIcon: '❄️' },
    75: { description: 'Heavy snow', icon: '❄️', nightIcon: '❄️' },
    77: { description: 'Snow grains', icon: '❄️', nightIcon: '❄️' },
    80: { description: 'Slight rain showers', icon: '🌦️', nightIcon: '🌧️' },
    81: { description: 'Moderate rain showers', icon: '🌦️', nightIcon: '🌧️' },
    82: { description: 'Violent rain showers', icon: '⛈️', nightIcon: '⛈️' },
    85: { description: 'Slight snow showers', icon: '🌨️', nightIcon: '🌨️' },
    86: { description: 'Heavy snow showers', icon: '🌨️', nightIcon: '🌨️' },
    95: { description: 'Thunderstorm', icon: '⛈️', nightIcon: '⛈️' },
    96: { description: 'Thunderstorm with hail', icon: '⛈️', nightIcon: '⛈️' },
    99: { description: 'Thunderstorm with heavy hail', icon: '⛈️', nightIcon: '⛈️' },
};

/** Get weather description and icon for a weather code */
export function getWeatherInfo(code: number, isDay: boolean): { description: string; icon: string } {
    const info = WEATHER_CODES[code] || { description: 'Unknown', icon: '❓', nightIcon: '❓' };
    return {
        description: info.description,
        icon: isDay ? info.icon : info.nightIcon,
    };
}

/** Format day name from date string */
function getDayName(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/** Fetch weather data from Open-Meteo API */
export async function fetchWeather(coords: Coordinates): Promise<WeatherData> {
    const params = new URLSearchParams({
        latitude: coords.latitude.toString(),
        longitude: coords.longitude.toString(),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day',
        daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max',
        timezone: 'auto',
        forecast_days: '7',
    });

    const response = await fetch(`${API_BASE}?${params}`);

    if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
    }

    return response.json();
}

/** Process raw API data into display format */
export function processWeatherData(data: WeatherData, locationName: string): WeatherDisplay {
    const { current, daily } = data;
    const isDay = current.is_day === 1;
    const weatherInfo = getWeatherInfo(current.weather_code, isDay);

    const forecast: ForecastDay[] = daily.time.slice(0, 7).map((date, i) => {
        const info = getWeatherInfo(daily.weather_code[i], true);
        return {
            date,
            dayName: getDayName(date),
            high: Math.round(daily.temperature_2m_max[i]),
            low: Math.round(daily.temperature_2m_min[i]),
            condition: info.description,
            conditionIcon: info.icon,
            precipChance: daily.precipitation_probability_max[i],
        };
    });

    return {
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        windDirection: current.wind_direction_10m,
        condition: weatherInfo.description,
        conditionIcon: weatherInfo.icon,
        isDay,
        forecast,
        location: locationName,
    };
}
