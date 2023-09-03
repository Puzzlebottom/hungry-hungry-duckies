import React, { useState } from 'react';
import ReactPlayer from 'react-player';

const PlaySound = () => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="audio-player-container">
      <ReactPlayer
        url="/audio/quacknoises.mp3"
        playing={!isMuted}
        loop={true}
        volume={isMuted ? 0 : 1}
      />
      <button
        onClick={toggleMute}
        style={{
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: 'none',
        }}
      >
        {isMuted ? (
          <img
            src="https://freesvg.org/img/pink_button_sound_on_morgaine1976.png"
            alt="Muted"
            style={{ width: '50px', height: '50px' }}
          />
        ) : (
          <img
            src="https://freesvg.org/img/pink_button_sound_off_morgaine1976.png"
            alt="Unmuted"
            style={{ width: '50px', height: '50px' }}
          />
        )}
      </button>
    </div>
  );
};

export default PlaySound;
