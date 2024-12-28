import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLon, LatLonArray } from '../types/coord.interface';

interface LatLonArrayState {
    value: LatLonArray;
}

const initialState: LatLonArrayState = {
    value: [],
};

export const clickedPointsSlice = createSlice({
    name: 'gpsClicks',
    initialState,
    reducers: {
        clearGPSClicks: (state) => {
            state.value = [];
        },
        appendGPSClick: (state, action: PayloadAction<LatLon>) => {
            state.value = [...state.value, action.payload]
        },
    },
});

// Action creators are generated for each case reducer function
export const { clearGPSClicks, appendGPSClick } = clickedPointsSlice.actions;

export default clickedPointsSlice.reducer;
