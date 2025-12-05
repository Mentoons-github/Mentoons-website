import { useEffect, useState, useRef } from "react";

export function useCountdown(
  seconds: number,
  onEnd: () => void,
  resetKey: number
) {
  const [time, setTime] = useState(seconds);
  const onEndRef = useRef(onEnd);

  // Keep onEnd reference updated
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    setTime(seconds);

    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          onEndRef.current(); 
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, resetKey]);

  return time;
}