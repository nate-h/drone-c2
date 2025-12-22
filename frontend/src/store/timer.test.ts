import timerReducer, {
  TimerState,
  pause,
  resume,
  reset,
  updateMinTime,
  updateMaxTime,
  updateTime,
  advanceTime,
} from './timer';

describe('Timer Slice', () => {
  const mockInitialState: TimerState = {
    time: new Date('2025-01-01T10:00:00').getTime(),
    minTime: new Date('2025-01-01T10:00:00').getTime(),
    maxTime: new Date('2025-01-01T12:00:00').getTime(),
    isActive: true,
    fps: 5,
    timeDelta: 60 * 1000, // 60 seconds per frame
  };

  it('should return the initial state', () => {
    const state = timerReducer(undefined, { type: 'unknown' });
    expect(state).toBeDefined();
    expect(state.isActive).toBe(true);
    expect(state.fps).toBe(5);
    expect(state.timeDelta).toBe(60 * 1000);
  });

  describe('pause', () => {
    it('should set isActive to false', () => {
      const state = timerReducer(mockInitialState, pause());
      expect(state.isActive).toBe(false);
    });

    it('should not affect other properties', () => {
      const state = timerReducer(mockInitialState, pause());
      expect(state.time).toBe(mockInitialState.time);
      expect(state.fps).toBe(mockInitialState.fps);
      expect(state.timeDelta).toBe(mockInitialState.timeDelta);
    });
  });

  describe('resume', () => {
    it('should set isActive to true', () => {
      const pausedState = { ...mockInitialState, isActive: false };
      const state = timerReducer(pausedState, resume());
      expect(state.isActive).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset time to minTime', () => {
      const advancedState = {
        ...mockInitialState,
        time: new Date('2025-01-01T11:30:00').getTime(),
      };
      const state = timerReducer(advancedState, reset());
      expect(state.time).toBe(mockInitialState.minTime);
    });

    it('should not affect other properties', () => {
      const advancedState = {
        ...mockInitialState,
        time: new Date('2025-01-01T11:30:00').getTime(),
      };
      const state = timerReducer(advancedState, reset());
      expect(state.isActive).toBe(mockInitialState.isActive);
      expect(state.maxTime).toBe(mockInitialState.maxTime);
      expect(state.minTime).toBe(mockInitialState.minTime);
    });
  });

  describe('updateMinTime', () => {
    it('should update minTime with the provided value', () => {
      const newMinTime = new Date('2025-01-01T09:00:00').getTime();
      const state = timerReducer(mockInitialState, updateMinTime(newMinTime));
      expect(state.minTime).toBe(newMinTime);
    });
  });

  describe('updateMaxTime', () => {
    it('should update maxTime with the provided value', () => {
      const newMaxTime = new Date('2025-01-01T14:00:00').getTime();
      const state = timerReducer(mockInitialState, updateMaxTime(newMaxTime));
      expect(state.maxTime).toBe(newMaxTime);
    });
  });

  describe('updateTime', () => {
    it('should update time with the provided value', () => {
      const newTime = new Date('2025-01-01T11:00:00').getTime();
      const state = timerReducer(mockInitialState, updateTime(newTime));
      expect(state.time).toBe(newTime);
    });
  });

  describe('advanceTime', () => {
    it('should advance time by timeDelta/fps when active', () => {
      const state = timerReducer(mockInitialState, advanceTime());
      const expectedAdvance = mockInitialState.timeDelta / mockInitialState.fps;
      expect(state.time).toBe(mockInitialState.time + expectedAdvance);
    });

    it('should not advance time when paused', () => {
      const pausedState = { ...mockInitialState, isActive: false };
      const state = timerReducer(pausedState, advanceTime());
      expect(state.time).toBe(pausedState.time);
    });

    it('should loop back to minTime when reaching maxTime', () => {
      const nearMaxState = {
        ...mockInitialState,
        time: mockInitialState.maxTime - 1000, // 1 second before max
      };
      const state = timerReducer(nearMaxState, advanceTime());
      expect(state.time).toBe(mockInitialState.minTime);
    });

    it('should loop back to minTime when time equals maxTime', () => {
      const atMaxState = {
        ...mockInitialState,
        time: mockInitialState.maxTime,
      };
      const state = timerReducer(atMaxState, advanceTime());
      expect(state.time).toBe(mockInitialState.minTime);
    });

    it('should handle multiple advances correctly', () => {
      let state = mockInitialState;
      const expectedAdvance = mockInitialState.timeDelta / mockInitialState.fps;

      // Advance 3 times
      state = timerReducer(state, advanceTime());
      state = timerReducer(state, advanceTime());
      state = timerReducer(state, advanceTime());

      expect(state.time).toBe(mockInitialState.time + expectedAdvance * 3);
    });

    it('should correctly calculate time advance with different fps values', () => {
      const customState = {
        ...mockInitialState,
        fps: 10, // Different FPS
      };
      const state = timerReducer(customState, advanceTime());
      const expectedAdvance = customState.timeDelta / customState.fps;
      expect(state.time).toBe(customState.time + expectedAdvance);
    });
  });

  describe('Simulation playback scenarios', () => {
    it('should handle a complete playback cycle', () => {
      let state = mockInitialState;

      // Advance through the entire timeline
      const totalDuration = state.maxTime - state.minTime;
      const advancePerFrame = state.timeDelta / state.fps;
      const framesToMax = Math.ceil(totalDuration / advancePerFrame);

      // Advance enough times to loop back
      for (let i = 0; i <= framesToMax; i++) {
        state = timerReducer(state, advanceTime());
      }

      // Should have looped back to or near minTime
      expect(state.time).toBeLessThanOrEqual(state.minTime + advancePerFrame);
    });

    it('should handle pause and resume during playback', () => {
      let state = mockInitialState;

      // Advance
      state = timerReducer(state, advanceTime());
      const timeAfterAdvance = state.time;

      // Pause
      state = timerReducer(state, pause());
      expect(state.isActive).toBe(false);

      // Try to advance while paused (should not move)
      state = timerReducer(state, advanceTime());
      expect(state.time).toBe(timeAfterAdvance);

      // Resume and advance
      state = timerReducer(state, resume());
      state = timerReducer(state, advanceTime());
      expect(state.time).toBeGreaterThan(timeAfterAdvance);
    });
  });
});
