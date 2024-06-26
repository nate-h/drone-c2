import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.css';
import './MapComponent.scss';
import { LatLon } from '../types/coord.interface';
import DronePath from './DronePath';
import locations from '../example_data/locations.json';
import drones from '../example_data/drones.json';
import HomeMarker from './HomeMarker';

const MapComponent = () => {
  const center: LatLon = [34.0501, -118.21512];
  const [latLongZoom, setLatLong] = useState({ lat: 0, long: 0, zoom: 0 });
  const { lat, long, zoom } = latLongZoom;

  const mapClickCB = (e: any) => {
    const { lat, lng } = e.latlng;
    console.log({ lat: lat.toFixed(5), lon: lng.toFixed(5), alt: 500 });
    const zoom = e.target.getZoom();
    setLatLong({ lat, long: lng, zoom });
  };

  const MapEventsHandler = () => {
    useMapEvents({
      click: (e) => mapClickCB(e),
    });
    return null;
  };

  return (
    <div className='MapComponent'>
      <MapContainer center={center} zoom={14} className='the-map'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <MapEventsHandler />

        {drones.map((drone, index) => (
          <DronePath key={index} drone={drone}></DronePath>
        ))}

        {locations.map((location, index) => (
          <HomeMarker key={index} location={location} />
        ))}
      </MapContainer>

      {/* Render lat, long, zoom on bottom of map */}
      <div className='map-metadata'>
        <div className='click-pos'>
          Clicked (Lat, Lon, Zoom): ({lat?.toFixed(4)}, {long?.toFixed(4)}, {zoom?.toFixed(2)})
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
