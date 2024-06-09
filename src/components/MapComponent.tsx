import React, { useEffect, useState } from 'react';
import { FeatureGroup, MapContainer, Marker, Polyline, TileLayer, useMapEvents } from 'react-leaflet';
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

    const pos: Array<[number, number]> = [
        [34.04, -118.245],
        [34.05, -118.3],
        [34.1, -118.4],
    ];


    const mapClickCB = (e: any) => {
        const { lat, lng } = e.latlng;
        console.log({ lat: lat.toFixed(5), lon: lng.toFixed(5), alt: 500 })
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

                <FeatureGroup>
                    {pos?.map((mark, i) => (
                        <Marker key={i} position={mark} />
                    ))}
                    <Polyline positions={pos} color="#819bb1" />
                </FeatureGroup>
            </MapContainer>
            <div className='map-metadata'>
                <div className='click-pos'>
                    Clicked (Lat, Lon, Zoom): ({lat?.toFixed(4)}, {long?.toFixed(4)}, {zoom?.toFixed(2)})
                </div>
            </div>
        </div>
    );
};

export default MapComponent;