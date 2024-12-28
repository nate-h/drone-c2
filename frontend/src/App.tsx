import React from 'react';
import './App.scss';

import MapComponent from './components/MapComponent';
import FooterControls from './components/FooterControls';
import DroneList from './components/DroneList';
import { Drone } from './types/drone.interface';
import { useSelector } from 'react-redux';
import DroneViewer from './components/DroneViewer';

import HeaderControls from './components/HeaderControls';

function App() {
  const selectedDrone: Drone = useSelector((state: any) => state.selectedDrone.value);

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
