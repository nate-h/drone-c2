import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from '../assets/drone.png';
import { LatLon } from '../types/coord.interface';


const DroneMarker = ({ latLon }: { latLon: LatLon }) => {

    const markerIcon = new L.Icon({
        iconUrl: icon,
        //iconRetinaUrl: icon,
        iconSize: new L.Point(100, 100),
        //className: "leaflet-div-icon",
    })

    return (
        <Marker position={latLon} icon={markerIcon}>
            <Popup>
                Drone at position: 34.04, -118.245
            </Popup>
        </Marker>
    );
};

export default DroneMarker;