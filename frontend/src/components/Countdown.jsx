import React, { useState, useEffect } from 'react';

const Countdown = ({ seconds, onComplete }) => {
  const [timer, setTimer] = useState(seconds);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (timer > 1) {
        setTimer(timer - 1);
      } else if (timer === 1) {
        setTimer('MUNCH!');
        setTimeout(() => {
          setTimer('');
          clearInterval(countdownInterval);
          onComplete(); //
        }, 1000); // should only show munch for 1 second before clearing it from screen
      } else {
        clearInterval(countdownInterval);
        onComplete(); // makes sure to call the oncomplete after the contdown is done
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [timer, onComplete]);

  return (
    <div className="countdown">
      <p style={{ fontSize: timer === 'MUNCH!' ? '33%' : '100%' }}>{timer}</p>
    </div>
  );
};

export default Countdown;
