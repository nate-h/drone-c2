import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { timeStringToSeconds } from '../utils';

export type TimerState = {
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
    pause(state: TimerState) {
      state.isActive = false;
    },
    resume(state: TimerState) {
      state.isActive = true;
    },
    reset(state: TimerState, action: PayloadAction<string | undefined>) {
      state.value = timeStringToSeconds(action.payload || '10:00 AM');
    },
    updateMinTime(state: TimerState, action: PayloadAction<string>) {
      state.minTime = timeStringToSeconds(action.payload);
    },
    updateMaxTime(state: TimerState, action: PayloadAction<string>) {
      state.maxTime = timeStringToSeconds(action.payload);
    },
    updateTime(state: TimerState, action: PayloadAction<number>) {
      state.value = action.payload;
    },
    advanceTime(state: TimerState) {
      if (!state.isActive) {
        return;
      }
      const newValue = state.value + state.timeDelta;
      state.value = newValue >= state.maxTime ? state.minTime : newValue;
    },
  },
});

export const { pause, resume, reset, updateMinTime, updateMaxTime, updateTime, advanceTime } =
  timerSlice.actions;

export default timerSlice.reducer;
