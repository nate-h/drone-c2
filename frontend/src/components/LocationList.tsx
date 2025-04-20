import React, { useEffect, useState } from 'react';
import './LocationList.scss';
import { Drones, DroneState, DroneStates } from '../types/drone.interface';

import DroneListRow from './DroneListRow';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';

import { ReactComponent as PathIcon } from '../assets/path.svg';
import { updateDroneStates } from '../store/droneStatesSlice';

const LocationList = () => {
  const drones: Drones = useSelector((state: RootState) => state.drones);
  const droneStates: DroneStates = useSelector((state: RootState) => state.droneStates);
  const [selectAll, setSelectAll] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const latestAllSelected = Object.values(droneStates).every((drone) => drone.showPath);
    if (latestAllSelected !== selectAll) {
      setSelectAll(latestAllSelected);
    }
  }, [droneStates, selectAll]);

  const toggleSelectAll = () => {
    const newDroneState: Record<string, Partial<DroneState>> = {};
    for (let droneId of Object.keys(droneStates)) {
      newDroneState[droneId] = { showPath: !selectAll };
    }
    dispatch(updateDroneStates(newDroneState));
  };

  return (
    <div className='LocationList'>
      <h2>Locations</h2>
      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              <th>Tail #</th>
              <th>Model</th>
              <th>Status</th>
              <th>
                <div className='centered'>
                  <input type='checkbox' checked={selectAll} onChange={toggleSelectAll}></input>
                  <PathIcon></PathIcon>
                </div>
              </th>
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

export default LocationList;
