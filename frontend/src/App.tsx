import React, { useEffect } from 'react';
import './App.scss';

import MapComponent from './components/MapComponent';
import FooterControls from './components/FooterControls';
import DroneList from './components/DroneList';
import { Drone, Drones, DroneState } from './types/drone.interface';
import { useDispatch, useSelector } from 'react-redux';
import DroneViewer from './components/DroneViewer';
import { setDrones } from './store/dronesSlice'

import HeaderControls from './components/HeaderControls';
import { RootState } from './store/store';
import { createDroneStates, updateDroneStates } from './store/droneStatesSlice';
import { findClosestPoints, isDroneGrounded } from './utils';
import { TimerState } from './store/timer';

function App() {
  const selectedDrone: Drone | null = useSelector((state: RootState) => state.selectedDrone.value);
  const dispatch = useDispatch();
  const drones: Drones = useSelector((state: RootState) => state.drones)
  const timer: TimerState = useSelector((state: RootState) => state.timer)

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/drones`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(setDrones(data))
        dispatch(createDroneStates(data))
      });
  }, [dispatch]);

  const updateDroneStatesHelper = () => {
    // Recompute some basic drone properties here.
    const newDroneState: Record<string, Partial<DroneState>> = {}
    for (let [droneId, drone] of Object.entries(drones)) {
      const points = findClosestPoints(drone.waypoints, timer.time);
      const isGrounded = isDroneGrounded(drone, timer.time, points[0].speed);
      newDroneState[droneId] = { isGrounded }
    }
    dispatch(updateDroneStates(newDroneState))
  }

  return (
    <div className='App'>
      <HeaderControls />
      <MapComponent />
      <DroneList />
      {selectedDrone ? <DroneViewer /> : null}
      <FooterControls />
      <div id='modal-root'></div>
    </div>
  );
}

export default App;
