import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import DroneMarker from "./DroneMarker"
import propeller from "../assets/propeller.png"
import "./MapComponent.scss"


L.Marker.prototype.options.icon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });

const MapComponent = () => {
    const [latLong, setLatLong] = useState({ lat: 0, long: 0 })
    const { lat, long } = latLong

    const mapClickCB = (e: any) => {
        const { lat, lng } = e.latlng;
        setLatLong({ lat, long: lng })
    };

    const MapEventsHandler = () => {
        useMapEvents({
            click: (e) => mapClickCB(e),
        });
        return null;
    };


    return (
        <div className='MapComponent'>
            <MapContainer center={[34.04, -118.245]} zoom={13} style={{ height: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DroneMarker></DroneMarker>
                <MapEventsHandler />
            </MapContainer>
            <div>
                Last clicked (Lat, Long): ({lat?.toFixed(4)}, {long?.toFixed(4)})
            </div>
        </div>
    );
};

export default MapComponent;