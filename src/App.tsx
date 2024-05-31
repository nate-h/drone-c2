import React from 'react';
import './App.css';

import MapComponent from './components/MapComponent';
import TimeSlider from './components/TimeSlider';
import DroneList from './components/DroneList';



function App() {
  return (
    <div className="App">
      <MapComponent />
      <DroneList />
      <TimeSlider />
    </div>
  );
}

export default App;
