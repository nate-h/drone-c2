import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Site, Sites } from '../types/site.interface';

const initialState: Sites = {};

export const sitesSlice = createSlice({
  name: 'sites',
  initialState: initialState,
  reducers: {
    setSites: (state, action: PayloadAction<Site[]>) => {
      return action.payload.reduce(
        (acc, site) => {
          acc[site.name] = site;
          return acc;
        },
        {} as Record<string, Site>,
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSites } = sitesSlice.actions;

export default sitesSlice.reducer;
