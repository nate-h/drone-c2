import React from 'react';
import { FeatureGroup, Polyline } from 'react-leaflet';
import { Drone, DroneState } from '../types/drone.interface';
import DroneMarker from './DroneMarker';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TimerState } from '../store/timer';
import { findClosestPoints } from '../utils';


const DronePath = ({ drone }: { drone: Drone }) => {
  const timer: TimerState = useSelector((state: RootState) => state.timer);
  const selectedDrone: Drone = useSelector((state: any) => state.selectedDrone.value);
  const latLons: Array<[number, number]> = drone.waypoints.map((pnt, i) => [
    pnt.latitude,
    pnt.longitude,
  ]);
  const isSelected = drone.tailNumber === selectedDrone?.tailNumber;
  const lineColor = isSelected ? '#F0E68C66' : '#0096FF66';

  const droneState: DroneState = useSelector((state: RootState) => state.droneStates[drone.tailNumber]);

  const points = findClosestPoints(drone.waypoints, timer.time);
  const heading = points.length > 0 ? points[points.length - 1].heading : 0;
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
    const frac = Math.abs(t2 - timer.time) / timeLength;
    latLong = [lat1 * frac + lat2 * (1 - frac), long1 * frac + long2 * (1 - frac)];
  } else {
    console.error('Unable to find drone position');
  }

  return (
    <FeatureGroup>
      <Polyline positions={latLons} color={lineColor} key={lineColor} />
      {(isSelected || !droneState.isGrounded) && (
        <DroneMarker latLon={latLong} heading={heading}></DroneMarker>
      )}
    </FeatureGroup>
  );
};

export default DronePath;
