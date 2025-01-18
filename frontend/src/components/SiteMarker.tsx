import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import homeURL from '../assets/home.png';
import targetURL from '../assets/target.svg';
import questionURL from '../assets/question.svg';
import { Site } from '../types/site.interface';

const edge = 25;
const homeIcon = new L.Icon({
  iconUrl: homeURL,
  iconSize: new L.Point(edge, edge),
  iconAnchor: [edge / 2, edge / 2],
});

const targetIcon = new L.Icon({
  iconUrl: targetURL,
  iconSize: new L.Point(edge, edge),
  iconAnchor: [edge / 2, edge / 2],
});

const questionIcon = new L.Icon({
  iconUrl: questionURL,
  iconSize: new L.Point(edge, edge),
  iconAnchor: [edge / 2, edge / 2],
});

const SiteMarker = ({ site }: { site: Site }) => {

  let icon = null;
  switch (site.site_type) {
    case "airfield":
      icon = homeIcon
      break
    case "poi":
      icon = targetIcon
      break
    default:
      console.error("Unhandled condition.")
      icon = questionIcon
  }

  return (
    <Marker position={[site.latitude, site.longitude]} icon={icon}>
      <Popup>(Lat, Long): ({JSON.stringify(site, null, 2)})</Popup>
    </Marker>
  );
};

export default SiteMarker;
