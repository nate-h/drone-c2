import { configureStore } from '@reduxjs/toolkit';
import selectedDroneReducer from './selectedDrone';
import gpsClicksReducer from './gpsClicks';
import timerReducer from './timer';

const store = configureStore({
  reducer: {
    selectedDrone: selectedDroneReducer,
    gpsClicks: gpsClicksReducer,
    timer: timerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
