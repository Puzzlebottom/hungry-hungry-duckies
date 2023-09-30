import { useState, useEffect } from 'react';

function GameTimer({ initialMinutes, initialSeconds, onComplete }) {
  const [time, setTime] = useState({ minutes: initialMinutes, seconds: initialSeconds });

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (time.minutes === 0 && time.seconds === 0) {
        clearInterval(countdownInterval);
        onComplete();
      } else {
        setTime((prevTime) => {
          if (prevTime.seconds === 0) {
            return { minutes: prevTime.minutes - 1, seconds: 59 };
          } else {
            return { minutes: prevTime.minutes, seconds: prevTime.seconds - 1 };
          }
        });
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [time, onComplete]);

  return (
    <div className='timer'>
      {`${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`}
    </div>
  );
}

export default GameTimer;
