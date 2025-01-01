import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet-rotatedmarker';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from '../assets/arrow.svg';
import { LatLon } from '../types/coord.interface';

const MarkerIcon = ({ latLon, heading }: { latLon: LatLon; heading: number }) => {
  const markerIcon = new L.Icon({
    iconUrl: icon,
    iconSize: new L.Point(40, 40),
  });

  return (
    <Marker position={latLon} icon={markerIcon} rotationAngle={heading} rotationOrigin='center'>
      <Popup>
        (Lat, Long): ({latLon[0]}, {latLon[1]})
      </Popup>
    </Marker>
  );
};

export default MarkerIcon;
