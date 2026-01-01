/**
 * Location Controller - handles country list and geolocation
 */

import type { Country, Coordinates, Location } from '../models/location.model';

/** List of countries with capital coordinates */
export const COUNTRIES: Country[] = [
    { code: 'US', name: 'United States', capital: 'Washington D.C.', coordinates: { latitude: 38.9072, longitude: -77.0369 } },
    { code: 'GB', name: 'United Kingdom', capital: 'London', coordinates: { latitude: 51.5074, longitude: -0.1278 } },
    { code: 'FR', name: 'France', capital: 'Paris', coordinates: { latitude: 48.8566, longitude: 2.3522 } },
    { code: 'DE', name: 'Germany', capital: 'Berlin', coordinates: { latitude: 52.5200, longitude: 13.4050 } },
    { code: 'JP', name: 'Japan', capital: 'Tokyo', coordinates: { latitude: 35.6762, longitude: 139.6503 } },
    { code: 'AU', name: 'Australia', capital: 'Canberra', coordinates: { latitude: -35.2809, longitude: 149.1300 } },
    { code: 'IN', name: 'India', capital: 'New Delhi', coordinates: { latitude: 28.6139, longitude: 77.2090 } },
    { code: 'BR', name: 'Brazil', capital: 'Brasília', coordinates: { latitude: -15.7975, longitude: -47.8919 } },
    { code: 'CA', name: 'Canada', capital: 'Ottawa', coordinates: { latitude: 45.4215, longitude: -75.6972 } },
    { code: 'CN', name: 'China', capital: 'Beijing', coordinates: { latitude: 39.9042, longitude: 116.4074 } },
    { code: 'RU', name: 'Russia', capital: 'Moscow', coordinates: { latitude: 55.7558, longitude: 37.6173 } },
    { code: 'ZA', name: 'South Africa', capital: 'Pretoria', coordinates: { latitude: -25.7479, longitude: 28.2293 } },
    { code: 'MX', name: 'Mexico', capital: 'Mexico City', coordinates: { latitude: 19.4326, longitude: -99.1332 } },
    { code: 'IT', name: 'Italy', capital: 'Rome', coordinates: { latitude: 41.9028, longitude: 12.4964 } },
    { code: 'ES', name: 'Spain', capital: 'Madrid', coordinates: { latitude: 40.4168, longitude: -3.7038 } },
    { code: 'KR', name: 'South Korea', capital: 'Seoul', coordinates: { latitude: 37.5665, longitude: 126.9780 } },
    { code: 'NL', name: 'Netherlands', capital: 'Amsterdam', coordinates: { latitude: 52.3676, longitude: 4.9041 } },
    { code: 'SE', name: 'Sweden', capital: 'Stockholm', coordinates: { latitude: 59.3293, longitude: 18.0686 } },
    { code: 'CH', name: 'Switzerland', capital: 'Bern', coordinates: { latitude: 46.9480, longitude: 7.4474 } },
    { code: 'SG', name: 'Singapore', capital: 'Singapore', coordinates: { latitude: 1.3521, longitude: 103.8198 } },
    { code: 'AE', name: 'UAE', capital: 'Abu Dhabi', coordinates: { latitude: 24.4539, longitude: 54.3773 } },
    { code: 'EG', name: 'Egypt', capital: 'Cairo', coordinates: { latitude: 30.0444, longitude: 31.2357 } },
    { code: 'TH', name: 'Thailand', capital: 'Bangkok', coordinates: { latitude: 13.7563, longitude: 100.5018 } },
    { code: 'NZ', name: 'New Zealand', capital: 'Wellington', coordinates: { latitude: -41.2865, longitude: 174.7762 } },
    { code: 'AR', name: 'Argentina', capital: 'Buenos Aires', coordinates: { latitude: -34.6037, longitude: -58.3816 } },
];

/** Get all countries sorted by name */
export function getCountries(): Country[] {
    return [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
}

/** Find country by code */
export function getCountryByCode(code: string): Country | undefined {
    return COUNTRIES.find(c => c.code === code);
}

/** Get location name for coordinates (reverse geocoding approximation) */
export function getLocationName(coords: Coordinates): string {
    const closest = getClosestCountry(coords);
    return closest ? `${closest.capital}, ${closest.name}` : 'Unknown Location';
}

/** Get closest country to given coordinates */
export function getClosestCountry(coords: Coordinates): Country | null {
    let closest: Country | null = null;
    let minDistance = Infinity;

    for (const country of COUNTRIES) {
        const distance = Math.sqrt(
            Math.pow(coords.latitude - country.coordinates.latitude, 2) +
            Math.pow(coords.longitude - country.coordinates.longitude, 2)
        );
        if (distance < minDistance) {
            minDistance = distance;
            closest = country;
        }
    }

    return closest;
}

/** Get user's current location via browser geolocation API */
export function getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords: Coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                resolve({
                    ...coords,
                    name: getLocationName(coords),
                });
            },
            (error) => {
                reject(new Error(`Geolocation error: ${error.message}`));
            },
            { timeout: 10000, maximumAge: 300000 }
        );
    });
}

/** Default location (London) for fallback */
export const DEFAULT_LOCATION: Location = {
    latitude: 51.5074,
    longitude: -0.1278,
    name: 'London, United Kingdom',
};
