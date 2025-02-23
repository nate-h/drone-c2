import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Drone, Drones } from '../types/drone.interface';

const initialState: Drones = {}

export const dronesSlice = createSlice({
    name: 'drones',
    initialState: initialState,
    reducers: {
        setDrones: (state, action: PayloadAction<Drone[]>) => {
            return action.payload.reduce((acc, drone) => {
                acc[drone.tailNumber] = drone;
                return acc;
            }, {} as Record<string, Drone>);
        }
    },
});

// Action creators are generated for each case reducer function
export const { setDrones } = dronesSlice.actions;

export default dronesSlice.reducer;
