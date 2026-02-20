import { useState, useEffect } from 'react';
import { mapsService } from '../services/maps';

export interface GeolocationState {
    coordinates: {
        latitude: number;
        longitude: number;
    } | null;
    city: string | null;
    error: string | null;
    loading: boolean;
    permission: PermissionState | null;
}

export const useGeolocation = () => {
    const [state, setState] = useState<GeolocationState>({
        coordinates: null,
        city: null,
        error: null,
        loading: false,
        permission: null,
    });

    const getCurrentPosition = () => {
        if (!navigator.geolocation) {
            setState(prev => ({ ...prev, error: 'Geolocation is not supported by your browser' }));
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Set coordinates immediately so UI updates and we can calculate distance
                setState(prev => ({
                    ...prev,
                    coordinates: {
                        latitude,
                        longitude,
                    },
                    error: null,
                    loading: false, // Turn off loading immediately once we have coords
                    permission: 'granted',
                }));

                // Fetch city asynchronously without blocking
                mapsService.getCityFromCoordinates(latitude, longitude)
                    .then(city => {
                        setState(prev => ({
                            ...prev,
                            city
                        }));
                    })
                    .catch(err => {
                        console.error('Failed to get city from coordinates', err);
                        // We do not set an error state here because we already have the coordinates,
                        // which is the primary requirement for "Near Me".
                    });
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                setState({
                    coordinates: null,
                    city: null,
                    error: errorMessage,
                    loading: false,
                    permission: 'denied',
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 5000, // Reduced timeout so it fails faster if unreachable
                maximumAge: 60000, // Allow using cached location up to 1 minute old
            }
        );
    };

    useEffect(() => {
        // Check permission status if available
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                setState(prev => ({ ...prev, permission: result.state }));
            });
        }
    }, []);

    return {
        ...state,
        getCurrentPosition,
    };
};

// Haversine formula to calculate distance between two coordinates
export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

const toRad = (degrees: number): number => {
    return (degrees * Math.PI) / 180;
};

export const formatDistance = (km: number): string => {
    if (km < 1) {
        return `${Math.round(km * 1000)}m away`;
    }
    return `${km.toFixed(1)}km away`;
};
