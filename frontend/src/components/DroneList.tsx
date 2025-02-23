import React from 'react';
import './DroneList.scss';
import { Drones } from '../types/drone.interface';

import DroneListRow from './DroneListRow';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const DroneList = () => {
  const drones: Drones = useSelector((state: RootState) => state.drones);

  return (
    <div className='DroneList'>
      <h2>Drones</h2>
      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              <th>Tail #</th>
              <th>Model</th>
              <th>Status</th>
              <th>Path</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(drones).map(([id, drone]) => (
              <DroneListRow key={id} drone={drone} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DroneList;
