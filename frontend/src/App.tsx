import React from 'react';
import './App.scss';

import MapComponent from './components/MapComponent';
import FooterControls from './components/FooterControls';
import DroneList from './components/DroneList';
import { Drone } from './types/drone.interface';
import { useSelector } from 'react-redux';
import DroneViewer from './components/DroneViewer';

import logo from './assets/logo.png';

function App() {
  const selectedDrone: Drone = useSelector((state: any) => state.selectedDrone.value);

  return (
    <div className='App'>
      <MapComponent />
      <a href='https://github.com/nate-h/drone-c2' className='logo'>
        <img src={logo} alt='Logo' />
      </a>
      <DroneList />
      {selectedDrone ? <DroneViewer /> : null}
      <FooterControls />
    </div>
  );
}

export default App;
