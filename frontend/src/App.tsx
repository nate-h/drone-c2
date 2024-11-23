import React from 'react';
import './App.scss';

import MapComponent from './components/MapComponent';
import FooterControls from './components/FooterControls';
import DroneList from './components/DroneList';
import { OLDDrone } from './types/drone.interface';
import { useSelector } from 'react-redux';
import DroneViewer from './components/DroneViewer';

import propeller from './assets/propeller.png';

function App() {
  const selectedDrone: OLDDrone = useSelector((state: any) => state.selectedDrone.value);

  return (
    <div className='App'>
      <MapComponent />
      <h1>
        <a href='https://github.com/nate-h/drone-c2'>
          Drone C<img src={propeller} alt='Propeller Logo' />

          {/* <pre>{JSON.stringify(sites, null, 2)}</pre> */}

        </a>
      </h1>
      <DroneList />
      {selectedDrone ? <DroneViewer /> : null}
      <FooterControls />
    </div>
  );
}

export default App;
