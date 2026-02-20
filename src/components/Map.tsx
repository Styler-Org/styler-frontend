import React, { useEffect, useRef, useState } from 'react';
import { importLibrary } from '@googlemaps/js-api-loader';
import { Box, CircularProgress, Typography } from '@mui/material';
import { mapsService } from '../services/maps';

export interface MarkerData {
    id: string;
    lat: number;
    lng: number;
    title?: string;
    onClick?: () => void;
}

interface MapProps {
    center?: { lat: number; lng: number };
    zoom?: number;
    markers?: MarkerData[];
    height?: string | number;
    width?: string | number;
    fallbackLocation?: { lat: number; lng: number };
}

const Map: React.FC<MapProps> = ({
    center,
    zoom = 13,
    markers = [],
    height = '400px',
    width = '100%',
    fallbackLocation = { lat: 26.8467, lng: 80.9462 } // Lucknow
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const markersRef = useRef<any[]>([]);
    const mapLibRef = useRef<any>(null);
    const markerLibRef = useRef<any>(null);

    useEffect(() => {
        let isMounted = true;

        const initMap = async () => {
            try {
                await mapsService.init();
                if (isMounted && mapRef.current && !map) {
                    const mapsLibrary = await importLibrary('maps');
                    mapLibRef.current = mapsLibrary;
                    markerLibRef.current = await importLibrary('marker');

                    const newMap = new mapsLibrary.Map(mapRef.current, {
                        center: center || fallbackLocation,
                        zoom,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                        mapId: 'DEMO_MAP_ID' // Required for advanced markers if we switch to them, good practice
                    });
                    setMap(newMap);
                }
            } catch (err: any) {
                console.error('Failed to initialize map:', err);
                if (isMounted) {
                    setError('Failed to load Google Maps. Please check your API key and billing status.');
                }
            }
        };

        initMap();

        return () => {
            isMounted = false;
        };
    }, [mapRef, map]);

    useEffect(() => {
        if (map && center) {
            map.setCenter(center);
            map.setZoom(zoom);
        } else if (map && !center) {
            map.setCenter(fallbackLocation);
            map.setZoom(zoom);
        }
    }, [map, center, zoom, fallbackLocation]);

    useEffect(() => {
        if (map) {
            // Clear existing markers
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];

            // Add new markers
            markers.forEach((markerData) => {
                const marker = new markerLibRef.current.Marker({
                    position: { lat: markerData.lat, lng: markerData.lng },
                    map,
                    title: markerData.title,
                });

                if (markerData.onClick) {
                    marker.addListener('click', markerData.onClick);
                }

                markersRef.current.push(marker);
            });
        }
    }, [map, markers]);

    if (error) {
        return (
            <Box sx={{ height, width, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
                <Typography color="error" variant="body2">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative', height, width, borderRadius: 2, overflow: 'hidden' }}>
            {!map && (
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', zIndex: 1 }}>
                    <CircularProgress size={30} />
                </Box>
            )}
            <Box ref={mapRef} sx={{ height: '100%', width: '100%' }} />
        </Box>
    );
};

export default Map;
