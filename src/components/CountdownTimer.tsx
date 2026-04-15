import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const [time, setTime] = useState({ hours: 12, minutes: 45, seconds: 22 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-1 text-muted-foreground text-sm">
      <span>Next dare in:</span>
      <span className="font-mono font-semibold text-foreground">
        {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
      </span>
    </div>
  );
};

export default CountdownTimer;