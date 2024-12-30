import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { timeStringToSeconds, secondsToTimeString } from '../utils';

import { createSelector } from 'reselect';

type FormattedTimerState = {
  value: string;
  minTime: string;
  maxTime: string;
  isActive: boolean;
  fps: number;
  timeDelta: number;
};

type TimerState = {
  value: number;
  minTime: number;
  maxTime: number;
  isActive: boolean;
  fps: number;
  timeDelta: number;
};

type TimerOptions = {
  initialValue?: string;
  minTime?: string;
  maxTime?: string;
  fps?: number;
  timeDelta?: number;
};

const initialTimerState = (options: TimerOptions = {}): TimerState => {
  const {
    initialValue = '10:00 AM',
    minTime = '10:00 AM',
    maxTime = '12:00 PM',
    fps = 1,
    timeDelta = 60,
  } = options;

  return {
    value: timeStringToSeconds(initialValue),
    minTime: timeStringToSeconds(minTime),
    maxTime: timeStringToSeconds(maxTime),
    isActive: true,
    fps,
    timeDelta,
  };
};

const timerSlice = createSlice({
  name: 'timer',
  initialState: initialTimerState(),
  reducers: {
    pause(state) {
      state.isActive = false;
    },
    resume(state) {
      state.isActive = true;
    },
    reset(state, action: PayloadAction<string | undefined>) {
      state.value = timeStringToSeconds(action.payload || '10:00 AM');
    },
    updateMinTime(state, action: PayloadAction<string>) {
      state.minTime = timeStringToSeconds(action.payload);
    },
    updateMaxTime(state, action: PayloadAction<string>) {
      state.maxTime = timeStringToSeconds(action.payload);
    },
    advanceTime(state) {
      if (!state.isActive) {
        return;
      }
      const newValue = state.value + state.timeDelta;
      state.value = newValue >= state.maxTime ? state.minTime : newValue;
    },
  },
});

export const { pause, resume, reset, updateMinTime, updateMaxTime, advanceTime } =
  timerSlice.actions;

// Base selector to get the raw timer state
const selectRawTimer = (state: { timer: TimerState }) => state.timer;

// Memoized selector for formatted timer data
//export const selectTimer = (state: { timer: TimerState }): FormattedTimerState => ({
export const selectTimer = createSelector([selectRawTimer], (timer) => ({
  value: secondsToTimeString(timer.value),
  minTime: secondsToTimeString(timer.minTime),
  maxTime: secondsToTimeString(timer.maxTime),
  isActive: timer.isActive,
  fps: timer.fps,
  timeDelta: timer.timeDelta,
}));

export const startTimer = (
  dispatch: (action: any) => void,
  getState: () => { timer: FormattedTimerState },
): NodeJS.Timeout => {
  const interval = 1000 / getState().timer.fps;
  const intervalId = setInterval(() => {
    const isActive = getState().timer.isActive;
    if (!isActive) {
      clearInterval(intervalId);
    } else {
      dispatch(advanceTime());
    }
  }, interval);

  return intervalId;
};

export default timerSlice.reducer;
