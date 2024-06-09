import React, { Fragment, useEffect, useState } from 'react';
import { FeatureGroup, Marker, Polyline } from 'react-leaflet';
import { Drone } from '../types/drone.interface';
import L from 'leaflet';
import DroneMarker from './DroneMarker';
import { useSelector } from 'react-redux';

const createCircleIcon = (color: string, edgeSize: number) => {
  const markerHtmlStyles = `
        background-color: ${color};
        width: ${edgeSize}px;
        height: ${edgeSize}px;
        display: block;
        border-radius: 1rem;
        border: 1px solid #AAAAAA`;

  return L.divIcon({
    className: 'my-custom-pin',
    iconAnchor: [edgeSize / 2, edgeSize / 2],
    popupAnchor: [0, -12], // TODO: create useful popup?
    html: `<span style="${markerHtmlStyles}" />`,
  });
};

const greenMarker = createCircleIcon('#008000', 14);
const greyMarker = createCircleIcon('#CCCCCC', 8);
const redMarker = createCircleIcon('#ff4c30', 14);

const DronePath = ({ drone }: { drone: Drone }) => {
  const selectedDrone: Drone = useSelector((state: any) => state.selectedDrone.value);
  const latLons: Array<[number, number]> = drone.vehicleUpdates.map((pnt, i) => [pnt.lat, pnt.lon]);
  const isSelected = drone === selectedDrone;
  const lineColor = isSelected ? '#F0E68C' : '#0096FF';

  const findMarkerIcon = (index: number): L.DivIcon => {
    switch (index) {
      case 0:
        return greenMarker;
      case latLons.length - 1:
        return redMarker;
      default:
        return greyMarker;
    }
  };

  return (
    <FeatureGroup>
      {latLons?.map((mark, i) => (
        <Fragment key={i}>
          <Marker position={mark} icon={findMarkerIcon(i)} />
        </Fragment>
      ))}
      <Polyline positions={latLons} color={lineColor} key={lineColor} />
    </FeatureGroup>
  );
};

//<DroneMarker latLon={center}></DroneMarker>

export default DronePath;
