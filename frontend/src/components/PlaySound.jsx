import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

const PlaySound = ({ audioSource }) => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const playSoundContainerRef = useRef(null);

  useEffect(() => {
    const handleClickAnywhere = (event) => {
      if (
        playSoundContainerRef.current &&
        !playSoundContainerRef.current.contains(event.target)
      ) {
        toggleMute();
      }
    };

    document.addEventListener('mousedown', handleClickAnywhere);

    return () => {
      document.removeEventListener('mousedown', handleClickAnywhere);
    };
  }, []);

  return (
    <div className="audio-player-container" ref={playSoundContainerRef}>
      <audio src={audioSource} preload="auto" loop style={{ display: isMuted ? 'none' : 'block' }}></audio>
      <ReactPlayer
        url={audioSource}
        playing={!isMuted}
        loop={true}
        volume={isMuted ? 0 : 0.75}
        style={{ display: 'none' }}
      />
      <button
        onClick={toggleMute}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: 'none',
        }}
      >
        {isMuted ? (
          <img
            src="https://freesvg.org/img/pink_button_sound_off_morgaine1976.png"
            alt="Muted"
            style={{ width: '30px', height: '30px' }}
          />
        ) : (
          <img
            src="https://freesvg.org/img/pink_button_sound_on_morgaine1976.png"
            alt="Unmuted"
            style={{ width: '30px', height: '30px' }}
          />
        )}
      </button>
    </div>
  );
};

export default PlaySound;
