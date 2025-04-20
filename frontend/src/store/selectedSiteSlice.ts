import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Site } from '../types/site.interface';

const initialState: { value: Site | null } = { value: null };

export const selectedSiteSlice = createSlice({
  name: 'selectedSite',
  initialState,
  reducers: {
    clearSite: (state) => {
      state.value = null;
    },
    selectSite: (state, action: PayloadAction<Site>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { clearSite, selectSite } = selectedSiteSlice.actions;

export default selectedSiteSlice.reducer;
