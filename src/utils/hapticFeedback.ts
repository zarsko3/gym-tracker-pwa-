export const vibrate = (pattern: number | number[] = 10): void => {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      // Ignore vibration errors (some browsers don't support it)
      console.debug('Vibration not supported or blocked');
    }
  }
};

export const vibrateSuccess = (): void => {
  vibrate([100, 50, 100]); // Success pattern: vibrate, pause, vibrate
};

export const vibrateError = (): void => {
  vibrate([200, 100, 200, 100, 200]); // Error pattern: long vibrate, pause, long vibrate
};

export const vibrateWarning = (): void => {
  vibrate([150, 100, 150]); // Warning pattern: medium vibrate, pause, medium vibrate
};

export const vibrateTap = (): void => {
  vibrate(10); // Light tap feedback
};

export const vibrateLongPress = (): void => {
  vibrate(50); // Longer feedback for long press actions
};

// Note: HOC functionality can be added later if needed
// For now, we'll use the individual vibrate functions directly in components
