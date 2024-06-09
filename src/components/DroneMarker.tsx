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
        iconSize: new L.Point(75, 75),
    })

    return (
        <Marker position={latLon} icon={markerIcon}>
            <Popup>
                (Lat, Long): ({latLon[0]}, {latLon[1]})
            </Popup>
        </Marker>
    );
};

export default DroneMarker;