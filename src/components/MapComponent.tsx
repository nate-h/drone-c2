import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import DroneMarker from "./DroneMarker"
import "./MapComponent.scss"


L.Marker.prototype.options.icon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });

const MapComponent = () => {
    const [latLongZoom, setLatLong] = useState({ lat: 0, long: 0, zoom: 0 })
    const { lat, long, zoom } = latLongZoom

    const mapClickCB = (e: any) => {
        const { lat, lng } = e.latlng;
        const zoom = e.target.getZoom()
        setLatLong({ lat, long: lng, zoom })
    };

    const MapEventsHandler = () => {
        useMapEvents({
            click: (e) => mapClickCB(e),
        });
        return null;
    };


    return (
        <div className='MapComponent'>
            <MapContainer center={[34.0423, -118.2205]} zoom={14} className='the-map'>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DroneMarker></DroneMarker>
                <MapEventsHandler />
            </MapContainer>
            <div className='map-metadata'>
                <div className='click-pos'>
                    Clicked (Lat, Long, Zoom): ({lat?.toFixed(4)}, {long?.toFixed(4)}, {zoom?.toFixed(2)})
                </div>
            </div>
        </div>
    );
};

export default MapComponent;