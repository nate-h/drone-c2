import { createSlice } from '@reduxjs/toolkit';

export const selectedDroneSlice = createSlice({
  name: 'drone',
  initialState: {
    value: null,
  },
  reducers: {
    clearDrone: (state) => {
      state.value = null;
    },
    selectDrone: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { clearDrone, selectDrone } = selectedDroneSlice.actions;

export default selectedDroneSlice.reducer;
