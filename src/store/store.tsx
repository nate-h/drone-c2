import { configureStore } from '@reduxjs/toolkit'
import selectedDroneReducer from './selectedDrone';


export default configureStore({
    reducer: {
        selectedDrone: selectedDroneReducer,
    },
})