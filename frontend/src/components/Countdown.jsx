import { useRef, useEffect } from 'react';

function Countdown({ bugs, isActive }) {
  const message = useRef(3);
  const size = useRef(45);

  useEffect(() => {
    setTimeout(() => {
      message.current = 2;
      setTimeout(() => {
        message.current = 1;
        setTimeout(() => {
          size.current = 20;
          message.current = 'MUNCH!';
          setTimeout(() => {
            size.current = 15;
            message.current = null;
          }, 750);
        }, 750);
      }, 750);
    }, 750);

  }, [isActive]);

  useEffect(() => {
    if (!bugs.length && !message.current) {
      const messages = ['QUACK-TASTIC!', 'QUACK ON!', 'QUACK-A-LACKIN!', 'QUACK-TACULAR!', 'QUACK-A-ROO!'];
      message.current = messages[Math.floor(Math.random() * messages.length)];
    }
  }, [bugs]);

  return (
    message.current && (<div className="countdown" style={{ fontSize: `min(${size.current}vh, ${size.current}vw)` }}> {message.current}</div >)
  );
}

export default Countdown;
