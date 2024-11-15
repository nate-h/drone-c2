import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from '../assets/home.png';
import { Site } from '../types/site.interface';

const SiteMarker = ({ site }: { site: Site }) => {
  const edge = 25;
  const markerIcon = new L.Icon({
    iconUrl: icon,
    iconSize: new L.Point(edge, edge),
    iconAnchor: [edge / 2, edge / 2],
  });

  return (
    <Marker position={[site.latitude, site.longitude]} icon={markerIcon}>
      <Popup>(Lat, Long): ({JSON.stringify(site, null, 2)})</Popup>
    </Marker>
  );
};

export default SiteMarker;
