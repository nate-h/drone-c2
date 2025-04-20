import React, { useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import homeURL from '../assets/home.png';
import targetURL from '../assets/target.svg';
import questionURL from '../assets/question.svg';
import { Site } from '../types/site.interface';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import './SiteMarker.scss';
import { clearSite, selectSite } from '../store/selectedSiteSlice';

const edge = 25;

const createIcon = (url: string, isSelected: boolean) => {
  return new L.Icon({
    iconUrl: url,
    className: isSelected ? 'selected' : '',
    iconSize: new L.Point(edge, edge),
    iconAnchor: [edge / 2, edge / 2],
  });
};

const SiteMarker = ({ site }: { site: Site }) => {
  const selectedSite: Site | null = useSelector((state: RootState) => state.selectedSite.value);
  const isSelected = site === selectedSite;
  const markerRef = useRef<L.Marker | null>(null);
  const dispatch = useDispatch();

  if (markerRef.current) {
    if (isSelected) {
      markerRef.current.openPopup();
    } else {
      markerRef.current.closePopup();
    }
  }
  const selectMe = () => {
    if (isSelected) {
      dispatch(clearSite());
    } else {
      dispatch(selectSite(site));
    }
  };

  let url = questionURL;
  switch (site.site_type) {
    case 'airfield':
      url = homeURL;
      break;
    case 'poi':
      url = targetURL;
      break;
    default:
      console.error('Unhandled condition.');
  }

  const icon = createIcon(url, isSelected);

  return (
    <Marker
      position={[site.latitude, site.longitude]}
      icon={icon}
      ref={markerRef}
      eventHandlers={{ click: selectMe }}
    >
      <Popup>
        Site, Type: {site.name}, {site.site_type}
        <br />
        Lat, Long, Alt: {site.latitude}, {site.longitude}, {site.elevation}
      </Popup>
    </Marker>
  );
};

export default SiteMarker;
