import React, { useEffect, useState } from 'react';
import { FeatureGroup, Marker, Polyline } from 'react-leaflet';
import { Drone } from '../types/drone.interface';
import icon from '../assets/circle.png';
import L from 'leaflet';
import DroneMarker from "./DroneMarker"

const DronePath = ({ drone }: { drone: Drone }) => {

    const latLons: Array<[number, number]> = drone.vehicleUpdates.map((pnt, i) => [pnt.lat, pnt.lon])
    const edgeSize = 10

    const markerIcon = new L.Icon({
        iconUrl: icon,
        iconSize: new L.Point(edgeSize, edgeSize),
        iconAnchor: [edgeSize / 2, edgeSize / 2],
    })

    return (
        <FeatureGroup>
            {latLons?.map((mark, i) => (
                <Marker key={i} position={mark} icon={markerIcon} />
            ))}
            <Polyline positions={latLons} color="#0096FF" />
        </FeatureGroup>
    )
}

//<DroneMarker latLon={center}></DroneMarker>


export default DronePath;