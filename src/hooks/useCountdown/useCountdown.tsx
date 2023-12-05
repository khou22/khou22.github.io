import { useState, useEffect, useRef, useCallback } from "react";

interface UseCountdownProps {
  time: number;
  decrementFrequency: number;
  repeat: boolean;
  onFinish: () => void;
}

export const useCountdown = ({
  time,
  decrementFrequency,
  repeat,
  onFinish,
}: UseCountdownProps) => {
  const [currentValue, setCurrentValue] = useState(time);
  const [isPaused, setIsPaused] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (!intervalRef.current) {
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setCurrentValue((prevValue) => prevValue - decrementFrequency);
      }, decrementFrequency);
    }
  }, [decrementFrequency]);

  const pause = useCallback(() => {
    clearTimer();
    setIsPaused(true);
  }, [clearTimer]);

  const reset = useCallback(
    (newTime: number = time) => {
      clearTimer();
      setCurrentValue(newTime);
      setIsPaused(true);
    },
    [clearTimer, time],
  );

  useEffect(() => {
    if (currentValue <= 0) {
      clearTimer();
      onFinish();
      if (repeat) {
        setCurrentValue(time);
        play();
      } else {
        setIsPaused(true);
      }
    }
  }, [currentValue, clearTimer, onFinish, play, repeat, time]);

  useEffect(() => {
    play();
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return { currentValue, play, pause, reset, isPaused };
};
