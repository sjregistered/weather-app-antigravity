/**
 * WeatherCard - Displays current weather and forecast
 * Stateless component - receives all data via props
 */

import type { WeatherDisplay } from '../models/weather.model';

interface WeatherCardProps {
    weather: WeatherDisplay;
}

export function WeatherCard({ weather }: WeatherCardProps) {
    return (
        <div className="weather-card">
            <div className="weather-card__header">
                <div className="weather-card__location">{weather.location}</div>
                <div className="weather-card__main">
                    <span className="weather-card__icon">{weather.conditionIcon}</span>
                    <span className="weather-card__temp">
                        {weather.temperature}<sup>°C</sup>
                    </span>
                </div>
                <div className="weather-card__condition">{weather.condition}</div>
            </div>

            <div className="weather-card__details">
                <div className="weather-card__detail">
                    <div className="weather-card__detail-label">Feels Like</div>
                    <div className="weather-card__detail-value">{weather.feelsLike}°</div>
                </div>
                <div className="weather-card__detail">
                    <div className="weather-card__detail-label">Humidity</div>
                    <div className="weather-card__detail-value">{weather.humidity}%</div>
                </div>
                <div className="weather-card__detail">
                    <div className="weather-card__detail-label">Wind</div>
                    <div className="weather-card__detail-value">{weather.windSpeed} km/h</div>
                </div>
            </div>

            <div className="forecast">
                <h3 className="forecast__title">7-Day Forecast</h3>
                <div className="forecast__grid">
                    {weather.forecast.map((day) => (
                        <div key={day.date} className="forecast__day">
                            <div className="forecast__day-name">{day.dayName}</div>
                            <div className="forecast__day-icon">{day.conditionIcon}</div>
                            <div className="forecast__day-temps">
                                <span>{day.high}°</span>
                                <span>{day.low}°</span>
                            </div>
                            {day.precipChance > 0 && (
                                <div className="forecast__day-precip">💧 {day.precipChance}%</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
