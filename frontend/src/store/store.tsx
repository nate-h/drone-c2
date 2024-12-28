import { configureStore } from '@reduxjs/toolkit';
import selectedDroneReducer from './selectedDrone';
import gpsClicksReducer from './gpsClicks';

const store = configureStore({
  reducer: {
    selectedDrone: selectedDroneReducer,
    gpsClicks: gpsClicksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export default store;