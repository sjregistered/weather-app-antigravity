/**
 * Location model - country and coordinates data
 */

/** Geographic coordinates */
export interface Coordinates {
    latitude: number;
    longitude: number;
}

/** Country data for dropdown */
export interface Country {
    code: string;
    name: string;
    capital: string;
    coordinates: Coordinates;
}

/** Location with display name */
export interface Location extends Coordinates {
    name: string;
    country?: string;
}
