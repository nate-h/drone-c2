import React from 'react';
import './DroneViewer.scss';
import { Drone } from '../types/drone.interface';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const DroneViewer = () => {
  const selectedDrone: Drone | null = useSelector((state: RootState) => state.selectedDrone.value);
  if (!selectedDrone) {
    return <div className='DroneViewer'>No drone selected</div>;
  }

  return (
    <div className='DroneViewer'>
      <h2>Drone View</h2>
      <div className='card-body'>
        <div className='metaData'>
          <img
            src={`${process.env.REACT_APP_API_URL}/api/image/${selectedDrone.imagePath}`}
            alt='drone'
          ></img>
          <ul>
            <li>ID: {selectedDrone.tailNumber}</li>
            <li>Model: {selectedDrone.model}</li>
            <li>Fuel: {selectedDrone.waypoints[0].fuel}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DroneViewer;
