import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.css';
import './MapComponent.scss';
import { LatLon } from '../types/coord.interface';
import { appendGPSClick } from '../store/gpsClicksSlice';
import DronePath from './DronePath';
import { Sites } from '../types/site.interface';
import { Drones } from '../types/drone.interface';
import SiteMarker from './SiteMarker';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store/store';
import { clearSite } from '../store/selectedSiteSlice';
import { setMapProperties } from '../store/mapPropertiesSlice';

const startingZoom = 11;
const center: LatLon = [34.623572, -117.600236];

const MapComponent = () => {
  const dispatch = useDispatch();
  const [latLongZoom, setLatLong] = useState({ lat: 0, long: 0, zoom: 0 });
  const { lat, long, zoom } = latLongZoom;

  const sites: Sites = useSelector((state: RootState) => state.sites);
  const drones: Drones = useSelector((state: RootState) => state.drones);

  useEffect(() => {
    dispatch(setMapProperties([...center, startingZoom]));
  }, [dispatch]);

  const mapClickCB = (e: any) => {
    dispatch(clearSite());
    let { lat, lng } = e.latlng;
    lat = lat.toFixed(5);
    lng = lng.toFixed(5);
    const zoom = e.target.getZoom();
    dispatch(appendGPSClick([lat, lng]));
    setLatLong({ lat, long: lng, zoom });
  };

  const MapEventsHandler = () => {
    useMapEvents({
      click: (e) => mapClickCB(e),
      moveend: (event) => {
        const newCenter = event.target.getCenter();
        const zoom = event.target.getZoom();
        dispatch(setMapProperties([newCenter.lat, newCenter.lng, zoom]));
      },
      zoomend: (event) => {
        const newCenter = event.target.getCenter();
        const zoom = event.target.getZoom();
        dispatch(setMapProperties([newCenter.lat, newCenter.lng, zoom]));
      },
    });
    return null;
  };

  return (
    <div className='MapComponent'>
      <MapContainer center={center} zoom={startingZoom} className='the-map'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <MapEventsHandler />

        {Object.entries(drones).map(([id, drone]) => (
          <DronePath key={id} drone={drone}></DronePath>
        ))}

        {Object.entries(sites).map(([id, site]) => (
          <SiteMarker key={id} site={site} />
        ))}
      </MapContainer>

      {/* Render lat, long, zoom on bottom of map */}
      <div className='click-pos'>
        Lat, Lon, Zoom: {lat}, {long}, {zoom?.toFixed(1)}
      </div>
    </div>
  );
};

export default MapComponent;
