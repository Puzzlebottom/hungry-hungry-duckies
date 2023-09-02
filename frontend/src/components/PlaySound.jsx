import React, { useState, useEffect } from 'react';
import { Howl, Howler } from 'howler';

const PlaySound = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [audio, setAudio] = useState(null);


  useEffect(() => {
    const sound = new Howl({
      src: ['/audio/quacknoises.mp3'],
      volume: isMuted ? 0 : 1.0,
      loop: true,
      autoplay: true,
      mute: isMuted,
    });

    setAudio(sound);


    return () => {
      sound.stop();
      sound.unload();
    };
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div>
      <button onClick={toggleMute}>
        {isMuted ? (
          <span role="img" aria-label="Muted">
            🔇
          </span>
        ) : (
          <span role="img" aria-label="Unmuted">
            🔊
          </span>
        )}
      </button>
    </div>
  );
};

export default PlaySound;
