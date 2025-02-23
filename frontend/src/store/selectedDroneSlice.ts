import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Drone } from '../types/drone.interface';

const initialState: { value: Drone | null } = { value: null };

export const selectedDroneSlice = createSlice({
  name: 'selectedDrone',
  initialState,
  reducers: {
    clearDrone: (state) => {
      state.value = null;
    },
    selectDrone: (state, action: PayloadAction<Drone>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { clearDrone, selectDrone } = selectedDroneSlice.actions;

export default selectedDroneSlice.reducer;
