// store.test.ts
import store, { RootState } from './store';
import { clearDrone, selectDrone } from './selectedDrone';
import { clearGPSClicks, appendGPSClick } from './gpsClicks';

describe('Redux Store Tests', () => {
    it('should have the correct initial state', () => {
        const state: RootState = store.getState();
        expect(state.selectedDrone.value).toBe(null);
        expect(state.gpsClicks.value).toEqual([]);
        expect(state.timer).toBeDefined(); // Timer slice's initial state should be tested as well if known.
    });

    describe('selectedDrone slice', () => {
        it('should select a drone', () => {
            const droneId = 'drone-123';
            store.dispatch(selectDrone(droneId));
            const state = store.getState();
            expect(state.selectedDrone.value).toBe(droneId);
        });

        it('should clear the selected drone', () => {
            store.dispatch(clearDrone());
            const state = store.getState();
            expect(state.selectedDrone.value).toBe(null);
        });
    });

    describe('gpsClicks slice', () => {
        it('should append GPS coordinates', () => {
            const latLong: [number, number] = [1, 2];
            store.dispatch(appendGPSClick(latLong));
            const state = store.getState();
            expect(state.gpsClicks.value).toContainEqual(latLong);
        });

        it('should clear all GPS clicks', () => {
            store.dispatch(clearGPSClicks());
            const state = store.getState();
            expect(state.gpsClicks.value).toEqual([]);
        });
    });
});