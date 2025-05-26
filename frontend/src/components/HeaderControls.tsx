import React, { useEffect, useRef, useState } from 'react';
import './HeaderControls.scss';
import { ReactComponent as HumidIcon } from '../assets/weather/wi-humidity.svg';
import { ReactComponent as SunIcon } from '../assets/weather/wi-day-sunny.svg';
import { ReactComponent as LogoIcon } from '../assets/logo_2.svg';
import { ReactComponent as UserIcon } from '../assets/user-solid.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface WeatherData {
  temperature: number;
  cloudiness: number;
  humidity: number;
  precipitation: number;
  wind_speed: number;
}

const HeaderControls = () => {
  const mapProperties = useSelector((state: RootState) => state.mapProperties);
  const timer = useSelector((state: RootState) => state.timer);
  const mapPropertiesRef = useRef(mapProperties);
  const timeRef = useRef(timer.time);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    mapPropertiesRef.current = mapProperties;
  }, [mapProperties]);

  useEffect(() => {
    timeRef.current = timer.time;
  }, [timer]);

  const updateWeatherData = async () => {
    let lat = 0;
    let lon = 0;
    if (mapPropertiesRef.current.value) {
      [lat, lon] = mapPropertiesRef.current.value;
    }
    fetch(
      `${process.env.REACT_APP_API_URL}/api/weather?lat=${lat}&lon=${lon}&time=${timeRef.current}`,
    )
      .then((res) => res.json())
      .then((data: WeatherData) => {
        setWeatherData(data);
      });
  };

  useEffect(() => {
    updateWeatherData(); // Initial fetch on component mount.
    setInterval(() => {
      updateWeatherData();
    }, 1000 * 5); // Refresh every 5 seconds.
  }, []);

  return (
    <header className='HeaderControls'>
      <a href='https://github.com/nate-h/drone-c2'>
        <LogoIcon />
        <div>Drone C2</div>
      </a>
      <ul className='weather'>
        <li>{weatherData?.temperature}°F</li>
        <li>
          {' '}
          <SunIcon />
        </li>
        <li>
          {weatherData?.wind_speed}mph&nbsp;<div className='marker'>➤</div>
        </li>
        <li>
          {' '}
          <div>{weatherData?.humidity}</div> <HumidIcon />
        </li>
        <li>
          {' '}
          <UserIcon className='small-svg' />
        </li>
      </ul>
    </header>
  );
};

export default HeaderControls;
