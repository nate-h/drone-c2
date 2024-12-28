import React, { useState } from 'react';
import './HeaderControls.scss';
import Modal from './Modal';
import { ReactComponent as HumidIcon } from '../assets/weather/wi-humidity.svg';
import { ReactComponent as SunIcon } from '../assets/weather/wi-day-sunny.svg';
import { ReactComponent as LogoIcon } from '../assets/logo_2.svg';
import { ReactComponent as UserIcon } from '../assets/user-solid.svg';
import { ReactComponent as GPSIcon } from '../assets/gps.svg';

import { clearGPSClicks } from '../store/gpsClicks';

import { RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { LatLonArray } from '../types/coord.interface';

const HeaderControls = () => {
  const dispatch = useDispatch();
  const gpsPoints: LatLonArray = useSelector((state: RootState) => state.gpsClicks.value);

  const csvContent = [
    'lat,lon', // Header
    ...gpsPoints.map((point) => `${point[0]},${point[1]}`),
  ].join('\n');

  const [showGPSModal, setShowGPSModal] = useState(false);
  return (
    <div className='HeaderControls'>
      <a href='https://github.com/nate-h/drone-c2'>
        <LogoIcon />
        <div>Drone C2</div>
      </a>
      <ul className='weather'>
        <li>72°F</li>
        <li>
          {' '}
          <SunIcon />
        </li>
        <li>
          3 mph&nbsp;<div className='marker'>➤</div>
        </li>
        <li>
          {' '}
          <div>43</div> <HumidIcon />
        </li>
        <li>
          {' '}
          <UserIcon className='small-svg' />
        </li>
        <li>
          {' '}
          <GPSIcon onClick={() => setShowGPSModal(true)} />
        </li>
      </ul>
      <Modal isOpen={showGPSModal} onClose={() => setShowGPSModal(false)} title='GPS Clicks'>
        <pre>{csvContent}</pre>
        <button onClick={() => dispatch(clearGPSClicks())}>Clear</button>
      </Modal>
    </div>
  );
};

export default HeaderControls;
