import React, { useEffect, useState } from 'react';
import { FeatureGroup, MapContainer, Marker, Polyline, TileLayer, useMapEvents } from 'react-leaflet';
import { Drone } from '../types/drone.interface';

const DronePath = ({ drone }: { drone: Drone }) => {

    const latLons: Array<[number, number]> = drone.vehicleUpdates.map((pnt, i) => [pnt.lat, pnt.lon])

    return (
        <FeatureGroup>
            {latLons?.map((mark, i) => (
                <Marker key={i} position={mark} />
            ))}
            <Polyline positions={latLons} color="#819bb1" />
        </FeatureGroup>
    )
}


export default DronePath;