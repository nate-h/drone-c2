import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from '../assets/drone.png';


const MapComponent = () => {

    const markerIcon = new L.Icon({
        iconUrl: icon,
        //iconRetinaUrl: icon,
        iconSize: new L.Point(100, 100),
        //className: "leaflet-div-icon",
    })

    return (
        <Marker position={[34.04, -118.245]} icon={markerIcon}>
            <Popup>
                Drone at position: 34.04, -118.245
            </Popup>
        </Marker>
    );
};

export default MapComponent;