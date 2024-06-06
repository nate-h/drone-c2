import React from 'react';
import './App.scss';

import MapComponent from './components/MapComponent';
import FooterControls from './components/FooterControls';
import DroneList from './components/DroneList';
import { Drone } from './types/drone.interface';
import { useSelector } from 'react-redux'
import DroneViewer from './components/DroneViewer';

import propeller from "./assets/propeller.png"



function App() {

  const selectedDrone: Drone = useSelector((state: any) => state.selectedDrone.value)

  return (
    <div className="App">
      <MapComponent />
      <h1>Drone C<img src={propeller} alt="Propeller Logo" /></h1>
      <DroneList />
      {selectedDrone ? <DroneViewer /> : null}
      <FooterControls />
    </div>
  );
}

export default App;
