import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

// Ensure you have VITE_GOOGLE_MAPS_API_KEY in your .env file
const GOOGLE_MAPS_API_KEY = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '';

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
    private initPromise: Promise<void> | null = null;
    private geocoder: any = null;
    private placesService: any = null;
    private mapsLibrary: any = null;
    private geocodingLibrary: any = null;
    private placesLibrary: any = null;
    public isInitialized = false;

    constructor() {
        if (GOOGLE_MAPS_API_KEY) {
            setOptions({
                key: GOOGLE_MAPS_API_KEY,
                v: 'weekly',
            });
        }
    }

    /**
     * Initialize Google Maps loader
     */
    public async init(): Promise<void> {
        if (!GOOGLE_MAPS_API_KEY) {
            console.error('Google Maps API Key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your .env');
            return;
        }

        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise(async (resolve, reject) => {
            try {
                this.mapsLibrary = await importLibrary('maps');
                this.geocodingLibrary = await importLibrary('geocoding');
                this.placesLibrary = await importLibrary('places');

                this.geocoder = new this.geocodingLibrary.Geocoder();
                // To initialize PlacesService, we need a dummy DOM element since we are not attaching it to a map immediately
                const dummyDiv = document.createElement('div');
                this.placesService = new this.placesLibrary.PlacesService(dummyDiv);
                this.isInitialized = true;
                resolve();
            } catch (error) {
                console.error('Failed to load Google Maps SDK', error);
                reject(error);
            }
        });

        return this.initPromise;
    }

    /**
     * Reverse Geocode coordinates to city/region name
     * @param lat Latitude
     * @param lng Longitude
     */
    public async getCityFromCoordinates(lat: number, lng: number): Promise<string | null> {
        await this.init();
        if (!this.geocoder) return null;

        return new Promise((resolve, reject) => {
            this.geocoder!.geocode({ location: { lat, lng } }, (results: any, status: any) => {
                if (status === 'OK' && results && results.length > 0) {
                    // Try to find the city (locality)
                    for (const result of results) {
                        for (const component of result.address_components) {
                            if (component.types.includes('locality')) {
                                return resolve(component.long_name);
                            }
                        }
                    }
                    // Fallback to Administrative Area Level 2 or 1
                    for (const result of results) {
                        for (const component of result.address_components) {
                            if (component.types.includes('administrative_area_level_2')) {
                                return resolve(component.long_name);
                            }
                        }
                    }
                    if (results[0]) resolve(results[0].formatted_address);
                } else if (status === 'ZERO_RESULTS') {
                    resolve(null);
                } else {
                    reject(new Error(`Geocoding failed: ${status}`));
                }
            });
        });
    }

    /**
     * Search Nearby Places directly via Google Places API (if backend is not handling this)
     * Useful for searching salons accurately if they correspond to Google businesses.
     * Often, backend handles this by taking location + radius instead. Let's keep a utility just in case.
     */
    public async searchNearbyPlaces(lat: number, lng: number, radius = 5000, keyword = 'salon'): Promise<PlaceResult[]> {
        await this.init();
        if (!this.placesService) return [];

        return new Promise((resolve, reject) => {
            const request = {
                location: new this.mapsLibrary.LatLng(lat, lng),
                radius,
                keyword
            };

            this.placesService!.nearbySearch(request, (results: any, status: any) => {
                if (status === this.placesLibrary.PlacesServiceStatus.OK && results) {
                    const mappedResults: PlaceResult[] = results.map((place: any) => ({
                        id: place.place_id!,
                        name: place.name!,
                        location: {
                            lat: place.geometry?.location?.lat() || 0,
                            lng: place.geometry?.location?.lng() || 0
                        },
                        address: place.vicinity,
                        rating: place.rating,
                        reviews: place.user_ratings_total
                    }));
                    resolve(mappedResults);
                } else if (status === this.placesLibrary.PlacesServiceStatus.ZERO_RESULTS) {
                    resolve([]);
                } else {
                    reject(new Error(`Places Search failed: ${status}`));
                }
            });
        });
    }
}

export const mapsService = new MapsService();
