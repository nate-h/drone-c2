import { configureStore } from '@reduxjs/toolkit';
import droneStatesReducer from './droneStatesSlice';
import dronesReducer from './dronesSlice';
import siteReducer from './siteSlice';
import selectedDroneReducer from './selectedDroneSlice';
import gpsClicksReducer from './gpsClicksSlice';
import timerReducer from './timer';

const store = configureStore({
  reducer: {
    droneStates: droneStatesReducer,
    drones: dronesReducer,
    sites: siteReducer,
    selectedDrone: selectedDroneReducer,
    gpsClicks: gpsClicksReducer,
    timer: timerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
