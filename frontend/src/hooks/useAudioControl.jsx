import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

const useAudioControl = (initialView = 'home') => {
  const [view, setView] = useState(initialView);
  const [isMuted, setIsMuted] = useState(true);

  const audioSources = {
    loading: '/audio/Loadingmusic.mp3',
    home: '/audio/mainmenumusic.mp3',
    table: '/audio/quacknoises.mp3',
    postgame:'/audio/quacknoises.mp3',
  };

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

  useEffect(() => {
    const audioElement = document.querySelector('.audio-player-container audio');
    if (audioElement) {
      if (view === 'loading' || view === 'home') {
        audioElement.pause();
        audioElement.currentTime = 0;
      } else {
        if (view !== 'postgame') {
          audioElement.src = audioSources[view];
          audioElement.load();
          if (!isMuted) {
            audioElement.play();
          }
        }
      }
    }
  }, [view, isMuted, audioSources]);



  return {
    view,
    setView,
    isMuted,
    toggleMute,
    playSoundContainerRef,
    audioElement: (
      <div className="audio-player-container" ref={playSoundContainerRef}>
        <audio
          src={audioSources[initialView]}
          preload="auto"
          loop
          style={{ display: isMuted ? 'none' : 'block' }}
        />
        <ReactPlayer
          url={audioSources[initialView]}
          playing={!isMuted}
          loop={true}
          volume={isMuted ? 0 : 0.1}
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
    ),
  };
};

export default useAudioControl;
