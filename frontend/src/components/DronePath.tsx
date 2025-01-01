import React from 'react';
import { FeatureGroup, Polyline } from 'react-leaflet';
import { Drone, Waypoint } from '../types/drone.interface';
import L from 'leaflet';
import DroneMarker from './DroneMarker';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TimerState } from '../store/timer';

const isDroneGrounded = (drone: Drone, time: number) => {
  return (
    time < new Date(drone.waypoints[0].timestamp).getTime() ||
    time > new Date(drone.waypoints[drone.waypoints.length - 1].timestamp).getTime()
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const findMarkerIcon = (index: number, latLons: Array<[number, number]>): L.DivIcon => {
  switch (index) {
    case 0:
      return greenMarker;
    case latLons.length - 1:
      return redMarker;
    default:
      return greyMarker;
  }
};

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

function findClosestPoints(locations: Waypoint[], t1: number): Waypoint[] {
  if (locations.length === 0) {
    return [];
  }

  const first = locations[0];
  const last = locations[locations.length - 1];

  if (t1 <= new Date(first.timestamp).getTime()) {
    return [first];
  }
  if (t1 >= new Date(last.timestamp).getTime()) {
    return [last];
  }

  let low = 0,
    high = locations.length - 1;

  // Binary search to find the closest time to t1.
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (new Date(locations[mid].timestamp).getTime() < t1) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  const prev = locations[low - 1] || null;
  const curr = locations[low] || null;
  return prev && curr ? [prev, curr] : [prev || curr].filter(Boolean);
}

const greenMarker = createCircleIcon('#008000', 14);
const greyMarker = createCircleIcon('#CCCCCC', 8);
const redMarker = createCircleIcon('#ff4c30', 14);

const DronePath = ({ drone }: { drone: Drone }) => {
  const timer: TimerState = useSelector((state: RootState) => state.timer);
  const selectedDrone: Drone = useSelector((state: any) => state.selectedDrone.value);
  const latLons: Array<[number, number]> = drone.waypoints.map((pnt, i) => [
    pnt.latitude,
    pnt.longitude,
  ]);
  const isSelected = drone.tailNumber === selectedDrone?.tailNumber;
  const lineColor = isSelected ? '#F0E68C' : '#0096FF';
  const isGrounded = isDroneGrounded(drone, timer.time);

  const points = findClosestPoints(drone.waypoints, timer.time);
  const heading = points.length > 0 ? points[0].heading : 0;
  let latLong: [number, number] = [0, 0];

  if (points.length === 1) {
    latLong = [points[0].latitude, points[0].longitude];
  } else if (points.length === 2) {
    const [lat1, long1, t1] = [
      points[0].latitude,
      points[0].longitude,
      new Date(points[0].timestamp).getTime(),
    ];
    const [lat2, long2, t2] = [
      points[1].latitude,
      points[1].longitude,
      new Date(points[1].timestamp).getTime(),
    ];

    const timeLength = Math.abs(t2 - t1);
    const ratio1 = Math.abs(t1 - timer.time) / timeLength;
    const ratio2 = Math.abs(t2 - timer.time) / timeLength;
    latLong = [lat1 * ratio1 + lat2 * ratio2, long1 * ratio1 + long2 * ratio2];
  } else {
    console.error('Unable to find drone position');
  }

  return (
    <FeatureGroup>
      {/* These path markers are ugly but may be useful in some context. */}
      {/* {isSelected &&
        latLons?.map((mark, i) => (
          <Fragment key={i}>
            <Marker position={mark} icon={findMarkerIcon(i)} />
          </Fragment>
        ))} */}
      <Polyline positions={latLons} color={lineColor} key={lineColor} />
      {(isSelected || !isGrounded) && (
        <DroneMarker latLon={latLong} heading={heading}></DroneMarker>
      )}
    </FeatureGroup>
  );
};

export default DronePath;
