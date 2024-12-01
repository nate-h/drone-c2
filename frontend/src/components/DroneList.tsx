import React, { useEffect, useState } from 'react';
import './DroneList.scss';
import battery from '../assets/battery.png';
import { Drone } from '../types/drone.interface';

import { useSelector, useDispatch } from 'react-redux';
import { selectDrone, clearDrone } from '../store/selectedDrone';

const DroneList = () => {
  const dispatch = useDispatch();
  const selectedDrone: Drone = useSelector((state: any) => state.selectedDrone.value);
  const [drones, setDrones] = useState<Drone[]>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/drones`)
      .then((res) => res.json())
      .then((data) => setDrones(data));

  }, []);

  const toggleSelectedDrone = (drone: Drone) => {
    if (selectedDrone === drone) {
      dispatch(clearDrone());
    } else {
      dispatch(selectDrone(drone));
    }
  };

  return (
    <div className='DroneList'>
      <h2>Drones</h2>
      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              <th>Tail #</th>
              <th>Model</th>
              <th>
                <img src={battery} alt='battery pic'></img>
              </th>
              <th>Speed</th>
              <th>Heading</th>
              <th>Altitude</th>
            </tr>
          </thead>
          <tbody>
            {drones.map((drone, index) => (
              <tr
                key={index}
                onClick={() => toggleSelectedDrone(drone)}
                className={drone === selectedDrone ? 'selected' : ''}
              >
                <td>{drone.tailNumber}</td>
                <td>{drone.model}</td>
                <td>{drone.waypoints[0].fuel}</td>
                <td>{drone.waypoints[0].speed}</td>
                <td>{drone.waypoints[0].heading}</td>
                <td>{drone.waypoints[0].altitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DroneList;
