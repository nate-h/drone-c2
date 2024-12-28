import React from 'react';
import './DroneViewer.scss';
import { Drone } from '../types/drone.interface';

import { useSelector, useDispatch } from 'react-redux';
import { clearDrone } from '../store/selectedDrone';

const DroneViewer = () => {
  const dispatch = useDispatch();
  const selectedDrone: Drone = useSelector((state: any) => state.selectedDrone.value);

  // TODO: Use when add close button.
  if (false) {
    dispatch(clearDrone());
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
