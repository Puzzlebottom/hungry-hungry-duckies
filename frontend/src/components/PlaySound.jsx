import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

const PlaySound = () => {
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

    const handleContextMenu = (event) => {
      event.preventDefault();
      toggleMute();
    };

    document.addEventListener('mousedown', handleClickAnywhere);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('mousedown', handleClickAnywhere);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div className="audio-player-container" ref={playSoundContainerRef}>
      <audio src="/audio/quacknoises.mp3" preload="auto" loop style={{ display: isMuted ? 'none' : 'block' }}></audio>
      <ReactPlayer
        url="/audio/quacknoises.mp3"
        playing={!isMuted}
        loop={true}
        volume={isMuted ? 0 : 1}
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
