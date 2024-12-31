import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TimerState = {
  time: number;
  minTime: number;
  maxTime: number;
  isActive: boolean;
  fps: number;
  timeDelta: number;
};

type TimerOptions = {
  initialTime?: Date;
  minTime?: Date;
  maxTime?: Date;
  fps?: number;
  timeDelta?: number;
};

const initialTimerState = (options: TimerOptions = {}): TimerState => {
  const {
    initialTime = new Date('2025-01-01T10:00:00'),
    minTime = new Date('2025-01-01T10:00:00'),
    maxTime = new Date('2025-01-01T12:00:00'),
    fps = 5,
    timeDelta = 60 * 1000, // For every second, increase sim time by 60 seconds.
  } = options;

  return {
    time: initialTime.getTime(),
    minTime: minTime.getTime(),
    maxTime: maxTime.getTime(),
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
    reset(state: TimerState) {
      state.time = state.minTime;
    },
    updateMinTime(state: TimerState, action: PayloadAction<number>) {
      state.minTime = action.payload;
    },
    updateMaxTime(state: TimerState, action: PayloadAction<number>) {
      state.maxTime = action.payload;
    },
    updateTime(state: TimerState, action: PayloadAction<number>) {
      state.time = action.payload;
    },
    advanceTime(state: TimerState) {
      if (!state.isActive) {
        return;
      }
      const newTime = state.time + state.timeDelta / state.fps;
      state.time = newTime >= state.maxTime ? state.minTime : newTime;
    },
  },
});

export const { pause, resume, reset, updateMinTime, updateMaxTime, updateTime, advanceTime } =
  timerSlice.actions;

export default timerSlice.reducer;
