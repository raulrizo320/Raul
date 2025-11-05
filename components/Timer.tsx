import React, { useState, useEffect } from 'react';

interface TimerProps {
  startTime: Date;
}

const Timer: React.FC<TimerProps> = ({ startTime }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const calculateElapsedTime = () => {
      const now = new Date();
      const differenceInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedSeconds(differenceInSeconds);
    };

    calculateElapsedTime(); // Initial calculation
    
    const interval = setInterval(calculateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  
  // Change color if timer goes over 10 minutes (600 seconds)
  const timerColor = elapsedSeconds > 600 ? 'text-red-500' : 'text-brand-gray';

  return (
    <div className={`text-xl font-mono font-bold tracking-wider p-2 rounded-md bg-brand-dark ${timerColor}`}>
      <span>{String(minutes).padStart(2, '0')}</span>
      <span className="animate-pulse">:</span>
      <span>{String(seconds).padStart(2, '0')}</span>
    </div>
  );
};

export default Timer;
