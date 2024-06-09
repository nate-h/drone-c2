import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from '../assets/home.png';
import { Location } from '../types/coord.interface';


const HomeMarker = ({ location }: { location: Location }) => {

    const edge = 25
    const markerIcon = new L.Icon({
        iconUrl: icon,
        iconSize: new L.Point(edge, edge),
        iconAnchor: [edge / 2, edge / 2]
    })

    return (
        <Marker position={[location.lat, location.lon]} icon={markerIcon}>
            <Popup>
                (Lat, Long): ({JSON.stringify(location, null, 2)})
            </Popup>
        </Marker>
    );
};

export default HomeMarker;