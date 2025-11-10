import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import React from 'react';

export default function CustomMap() {
    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
                style={{ height: '400px', width: '100%' }}
                defaultCenter={{ lat: 47.751852, lng: -122.210013 }}
                defaultZoom={12}
            >
                <Marker position={{ lat: 47.751852, lng: -122.210013 }} />
            </Map>
        </APIProvider>
    );
}
