import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import DroneMarker from "./DroneMarker"


L.Marker.prototype.options.icon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });


const MapComponent = () => {
    //const[position, setPosition] = useState([51.505, -0.09]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setPosition([position[0] + 0.001, position[1] + 0.001]);
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, [position]);


    return (
        <MapContainer center={[34.04, -118.245]} zoom={13} style={{ height: "90vh" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DroneMarker></DroneMarker>
        </MapContainer>
    );
};

export default MapComponent;