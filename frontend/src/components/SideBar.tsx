import React, { useState } from 'react';
import './SideBar.scss';

import Modal from './Modal';
import { clearGPSClicks } from '../store/gpsClicksSlice';

import { RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { LatLonArray } from '../types/coord.interface';

import { Building, MapPin, Plane } from 'lucide-react';

const SideBar: React.FC = () => {
  const iconSize = 20;
  const gpsPoints: LatLonArray = useSelector((state: RootState) => state.gpsClicks.value);

  const dispatch = useDispatch();
  const csvContent = [
    'lat,lon', // Header
    ...gpsPoints.map((point) => `${point[0]},${point[1]}`),
  ].join('\n');

  const handleClick = (buttonName: string) => {
    console.log(buttonName);
  };

  const [showGPSModal, setShowGPSModal] = useState(false);

  return (
    <div className='SideBar'>
      <button onClick={() => handleClick('Drones')}>
        <Plane size={iconSize} />
      </button>
      <button onClick={() => handleClick('Locations')}>
        <Building size={iconSize} />
      </button>
      <button onClick={() => setShowGPSModal(true)}>
        <MapPin size={iconSize} />
      </button>
      <Modal isOpen={showGPSModal} onClose={() => setShowGPSModal(false)} title='GPS Clicks'>
        <pre>{csvContent}</pre>
        <button onClick={() => dispatch(clearGPSClicks())}>Clear</button>
      </Modal>
    </div>
  );
};

export default SideBar;
