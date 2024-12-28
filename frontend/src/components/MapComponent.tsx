import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.css';
import './MapComponent.scss';
import { LatLon } from '../types/coord.interface';
import { appendGPSClick } from '../store/gpsClicks';
import DronePath from './DronePath';
import { Site } from '../types/site.interface';
import { Drone } from '../types/drone.interface';
import SiteMarker from './SiteMarker';
import { useDispatch } from 'react-redux';

const MapComponent = () => {
  const dispatch = useDispatch();
  const center: LatLon = [33.9997, -117.998];
  const [latLongZoom, setLatLong] = useState({ lat: 0, long: 0, zoom: 0 });
  const { lat, long, zoom } = latLongZoom;

  const [sites, setSites] = useState<Site[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/sites`)
      .then((res) => res.json())
      .then((data) => setSites(data));

    fetch(`${process.env.REACT_APP_API_URL}/api/drones`)
      .then((res) => res.json())
      .then((data) => setDrones(data));
  }, []);

  const mapClickCB = (e: any) => {
    let { lat, lng } = e.latlng;
    lat = lat.toFixed(5)
    lng = lng.toFixed(5)
    const zoom = e.target.getZoom();
    dispatch(appendGPSClick([lat, lng]))
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
      <MapContainer center={center} zoom={10} className='the-map'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <MapEventsHandler />

        {drones.map((drone, index) => (
          <DronePath key={index} drone={drone}></DronePath>
        ))}

        {sites.map((site, index) => (
          <SiteMarker key={index} site={site} />
        ))}
      </MapContainer>

      {/* Render lat, long, zoom on bottom of map */}
      <div className='map-metadata'>
        <div className='click-pos'>
          (Lat, Lon, Zoom): ({lat}, {long}, {zoom?.toFixed(2)})
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
