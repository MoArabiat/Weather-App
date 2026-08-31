/**
 * Weather API service
 * ---------------------
 * All network calls to Open-Meteo (geocoding + forecast) live here.
 * Screens/hooks should never call `fetch` directly — they should
 * import from this file instead, so the API details can change in
 * one place without touching any UI code.
 */

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// Feature codes from the geocoding API that represent an actual
// populated place (city/town), as opposed to a region, airport, etc.
const POPULATED_PLACE_FEATURE_CODES = new Set([
    'PPL',
    'PPLA',
    'PPLA2',
    'PPLA3',
    'PPLA4',
    'PPLC',
]);

export type GeocodedCity = {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
};

/** Base error for anything that goes wrong while talking to the weather API. */
export class WeatherApiError extends Error {}

/** Thrown when the entered city can't be matched to a real, populated place. */
export class CityNotFoundError extends WeatherApiError {}

type GeocodingResult = {
    name?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    feature_code?: string;
    population?: number;
};

/**
 * Looks up a city by name and returns the best-matching populated place.
 * Throws `CityNotFoundError` if nothing matches.
 */
export async function geocodeCity(cityName: string): Promise<GeocodedCity> {
    const trimmedName = cityName.trim();

    const params = new URLSearchParams({
        name: trimmedName,
        count: '10',
        language: 'en',
        format: 'json',
    });

    const response = await fetch(`${GEOCODING_URL}?${params.toString()}`);

    if (!response.ok) {
        throw new WeatherApiError('Could not search for the city.');
    }

    const data = await response.json();
    const results: GeocodingResult[] | undefined = data.results;

    if (!results || results.length === 0) {
        throw new CityNotFoundError(
            'The city you entered does not exist. Please check the city name and try again.'
        );
    }

    const searchedName = trimmedName.toLowerCase();

    const match = results.find((result) => {
        if (!result.name || !result.feature_code) {
            return false;
        }

        const isPopulatedPlace = POPULATED_PLACE_FEATURE_CODES.has(result.feature_code);
        const nameMatches = result.name.trim().toLowerCase() === searchedName;
        const hasPopulation = typeof result.population === 'number' && result.population > 0;

        return isPopulatedPlace && nameMatches && hasPopulation;
    });

    if (!match || match.latitude === undefined || match.longitude === undefined || !match.country) {
        throw new CityNotFoundError(`"${trimmedName}" is not a valid city. Please enter a real city name.`);
    }

    return {
        name: match.name!,
        country: match.country,
        latitude: match.latitude,
        longitude: match.longitude,
    };
}

/**
 * Fetches the current temperature (in Celsius) for a given coordinate.
 */
export async function getCurrentTemperatureCelsius(
    latitude: number,
    longitude: number
): Promise<number> {
    const params = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current: 'temperature_2m',
    });

    const response = await fetch(`${FORECAST_URL}?${params.toString()}`);

    if (!response.ok) {
        throw new WeatherApiError('Could not get the weather.');
    }

    const data = await response.json();
    const temperature = data.current?.temperature_2m;

    if (typeof temperature !== 'number') {
        throw new WeatherApiError('Temperature data is unavailable.');
    }

    return temperature;
}

/**
 * Convenience helper that combines the two calls above: resolves a city
 * name to a location, then fetches its current temperature.
 */
export async function fetchCityWeather(cityName: string) {
    const location = await geocodeCity(cityName);
    const temperatureCelsius = await getCurrentTemperatureCelsius(location.latitude, location.longitude);

    return { location, temperatureCelsius };
}
