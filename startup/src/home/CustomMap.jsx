import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import React from 'react';

export default function CustomMap() {
    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
                style={{ height: '400px', width: '100%' }}
                defaultCenter={{ lat: 40.2338, lng: -111.6585 }}
                defaultZoom={12}
            >
                <Marker position={{ lat: 40.2338, lng: -111.6585 }} />
            </Map>
        </APIProvider>
    );
}
