import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLonZoom } from '../types/coord.interface';

const initialState: { value: LatLonZoom | null } = { value: null };

export const mapPropertiesSlice = createSlice({
  name: 'mapProperties',
  initialState,
  reducers: {
    clearMapProperties: (state) => {
      state.value = null;
    },
    setMapProperties: (state, action: PayloadAction<LatLonZoom>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { clearMapProperties, setMapProperties } = mapPropertiesSlice.actions;

export default mapPropertiesSlice.reducer;
