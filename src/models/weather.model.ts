/**
 * Weather data model interfaces for Open-Meteo API
 */

/** Current weather data from Open-Meteo API */
export interface CurrentWeather {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    is_day: number;
}

/** Daily forecast data */
export interface DailyForecast {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
}

/** Complete weather API response */
export interface WeatherData {
    latitude: number;
    longitude: number;
    timezone: string;
    current: CurrentWeather;
    daily: DailyForecast;
}

/** Weather display data (processed for UI) */
export interface WeatherDisplay {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    condition: string;
    conditionIcon: string;
    isDay: boolean;
    forecast: ForecastDay[];
    location: string;
}

/** Single day forecast display */
export interface ForecastDay {
    date: string;
    dayName: string;
    high: number;
    low: number;
    condition: string;
    conditionIcon: string;
    precipChance: number;
}
