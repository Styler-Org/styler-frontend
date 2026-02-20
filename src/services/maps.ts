export interface PlaceResult {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
    };
    address?: string;
    rating?: number;
    reviews?: number;
}

class MapsService {
    public isInitialized = true;

    constructor() { }

    /**
     * Initialize Google Maps loader - No longer needed for Leaflet, kept for backwards compatibility
     */
    public async init(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Reverse Geocode coordinates to city/region name using OpenStreetMap Nominatim API (Free)
     * @param lat Latitude
     * @param lng Longitude
     */
    public async getCityFromCoordinates(lat: number, lng: number): Promise<string | null> {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'en',
                        // Nominatim requires a User-Agent, so we provide a generic one
                        'User-Agent': 'StylerApp/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Geocoding request failed');
            }

            const data = await response.json();

            if (data && data.address) {
                // Try to get the city, town, village, or state district
                const city = data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    data.address.state_district ||
                    data.address.county;

                return city || null;
            }

            return null;
        } catch (error) {
            console.error('Failed to reverse geocode with Nominatim:', error);
            return null;
        }
    }

    /**
     * Search Nearby Places - Stubbed out since we moved away from Google Places API
     * The backend should handle salon searching.
     */
    public async searchNearbyPlaces(lat: number, lng: number, radius = 5000, keyword = 'salon'): Promise<PlaceResult[]> {
        console.warn('searchNearbyPlaces is not supported without Google Places API. Rely on backend search.');
        return [];
    }
}

export const mapsService = new MapsService();
