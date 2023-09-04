import React, { useState, useEffect } from 'react';

function Countdown({ onComplete }) {
  const [timer, setTimer] = useState(3);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (timer > 1) {
        setTimer(timer - 1);
      } else if (timer === 1) {
        setTimer('MUNCH!');
        setTimeout(() => {
          setTimer('');
          clearInterval(countdownInterval);
          onComplete();
        }, 750);
      } else {
        clearInterval(countdownInterval);
        onComplete();
      }
    }, 750);

    return () => clearInterval(countdownInterval);
  }, [timer, onComplete]);

  return (
    <div className="countdown">
      <p style={{ fontSize: timer === 'MUNCH!' ? '33%' : '100%' }}>{timer}</p>
    </div>
  );
}

export default Countdown;
