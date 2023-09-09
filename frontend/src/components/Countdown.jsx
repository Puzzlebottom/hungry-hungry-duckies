import { useRef, useEffect } from 'react';

function Countdown({ bugs, isActive }) {
  const message = useRef(3);

  useEffect(() => {
    setTimeout(() => {
      message.current = 2;
      setTimeout(() => {
        message.current = 1;
        setTimeout(() => {
          message.current = 'MUNCH!';
          setTimeout(() => {
            message.current = null;
          }, 750);
        }, 750);
      }, 750);
    }, 750);

  }, [isActive]);

  useEffect(() => {
    if (!bugs.length && !message.current) {
      const messages = ['QUACK-TASTIC!', 'QUACK ON!', 'QUACK-A-LACKIN!', 'QUACK-A-DOODLE-DOO!', 'QUACK-A-DOODLE-DONE!', 'QUACK-TACULAR!', 'QUACK-A-ROO!'];
      message.current = messages[Math.floor(Math.random() * messages.length)];
    }
  }, [bugs]);

  const numeric = [3, 2, 1].includes(message.current);

  return (
    <div className="countdown">
      {message.current && <p style={{ fontSize: numeric ? '1em' : '0.5em' }}>{message.current}</p>}
    </div>
  );
}

export default Countdown;
