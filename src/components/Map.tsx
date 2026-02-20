import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon missing issue in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

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

// Helper component to center map when coordinates change
const MapUpdater: React.FC<{ center: { lat: number; lng: number }; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([center.lat, center.lng], zoom);
    }, [center, map, zoom]);
    return null;
};

const Map: React.FC<MapProps> = ({
    center,
    zoom = 13,
    markers = [],
    height = '400px',
    width = '100%',
    fallbackLocation = { lat: 26.8467, lng: 80.9462 } // Lucknow
}) => {
    const mapCenter = center || fallbackLocation;

    return (
        <Box sx={{ position: 'relative', height, width, borderRadius: 2, overflow: 'hidden', zIndex: 0 }}>
            <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={mapCenter} zoom={zoom} />

                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={[marker.lat, marker.lng]}
                        eventHandlers={{
                            click: () => {
                                if (marker.onClick) {
                                    marker.onClick();
                                }
                            }
                        }}
                    >
                        {marker.title && (
                            <Popup>
                                {marker.title}
                            </Popup>
                        )}
                    </Marker>
                ))}
            </MapContainer>
        </Box>
    );
};

export default Map;
