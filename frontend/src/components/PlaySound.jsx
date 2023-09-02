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
          <div
            style={{
              backgroundColor: 'transparent',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'inline-block',
            }}
          >
            <img
              src="https://freesvg.org/img/pink_button_sound_on_morgaine1976.png"
              alt="Muted"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
              }}
            />
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'transparent',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'inline-block',
            }}
          >
            <img
              src="https://freesvg.org/img/pink_button_sound_off_morgaine1976.png"
              alt="Unmuted"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
              }}
            />
          </div>
        )}
      </button>
    </div>
  );
};

export default PlaySound;
