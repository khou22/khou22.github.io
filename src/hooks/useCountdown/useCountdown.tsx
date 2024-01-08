import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountdownProps {
  time: number;
  decrementFrequency: number;
  repeat: boolean;
  onFinish: () => void;
  autoStart?: boolean;
}

/**
 * Custom hook that implements a countdown timer.
 *
 * @param {UseCountdownProps} props - The countdown timer configuration.
 * @param {number} props.time - The initial time for the countdown.
 * @param {number} props.decrementFrequency - The frequency at which the countdown should decrement.
 * @param {boolean} props.repeat - Whether the countdown should repeat after reaching zero.
 * @param {function} props.onFinish - The callback function to be called when the countdown finishes.
 * @param {boolean} props.autoStart - Whether the countdown should start automatically.
 * @return {object} - An object containing the current countdown value, and functions to control the countdown.
 */
export const useCountdown = ({
  time,
  decrementFrequency,
  repeat,
  onFinish,
  autoStart = true,
}: UseCountdownProps) => {
  const [currentValue, setCurrentValue] = useState(time);
  const [isPaused, setIsPaused] = useState(!autoStart);
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
    if (autoStart) play();
    return () => {
      clearTimer();
    };
  }, [autoStart, clearTimer, play]);

  return { currentValue, play, pause, reset, isPaused };
};
