import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DroneState, Drone } from '../types/drone.interface';

const initialState: Record<string, DroneState> = {};

export const droneStatesSlice = createSlice({
  name: 'droneStates',
  initialState: initialState,
  reducers: {
    createDroneStates: (state, action: PayloadAction<Drone[]>) => {
      return action.payload.reduce(
        (acc, drone) => {
          acc[drone.tailNumber] = {
            isGrounded: false,
            showPath: false,
          };
          return acc;
        },
        {} as Record<string, DroneState>,
      );
    },
    updateDroneStates: (state, action: PayloadAction<Record<string, Partial<DroneState>>>) => {
      for (let [id, partialDroneState] of Object.entries(action.payload)) {
        if (state[id]) {
          state[id] = { ...state[id], ...partialDroneState };
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { createDroneStates, updateDroneStates } = droneStatesSlice.actions;

export default droneStatesSlice.reducer;
