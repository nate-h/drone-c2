import React, { useEffect, useState } from 'react';
import './App.scss';

import MapComponent from './components/MapComponent';
import FooterControls from './components/FooterControls';
import DroneList from './components/DroneList';
import { Drone } from './types/drone.interface';
import { useSelector } from 'react-redux';
import DroneViewer from './components/DroneViewer';

import propeller from './assets/propeller.png';

function App() {
  const selectedDrone: Drone = useSelector((state: any) => state.selectedDrone.value);

  const [message, setMessage] = useState('');
  const [count, setCount] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/ping`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message));

    fetch(`${process.env.REACT_APP_API_URL}/api/count_items`)
      .then((res) => res.json())
      .then((data) => setCount(data.count));
  }, []);

  return (
    <div className='App'>
      <MapComponent />
      <h1>
        <a href='https://github.com/nate-h/drone-c2'>
          Drone C<img src={propeller} alt='Propeller Logo' />
          |{message}| {count} |
        </a>
      </h1>
      <DroneList />
      {selectedDrone ? <DroneViewer /> : null}
      <FooterControls />
    </div>
  );
}

export default App;
