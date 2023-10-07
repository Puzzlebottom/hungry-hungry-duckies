import { useEffect } from 'react';
import backgrounds from '../assets/wallpaper';
import '../sass/Background.scss';

const Background = ({ view }) => {
  const [back, middle, fore] = backgrounds[view];

  useEffect(() => {
    const handleResize = () => {
      const ratio = document.body.clientHeight / 324;
      const background = document.querySelector('.background-container');
      background.style.transform = `scale(${ratio})`;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div className={`background-container ${view}`} style={{ transform: `scale(${document.body.clientHeight / 324})` }}>
      <div className="layer back" style={{ backgroundImage: `url(${back})` }}></div>
      <div className="layer middle" style={{ backgroundImage: `url(${middle})` }}></div>
      <div className="layer fore" style={{ backgroundImage: `url(${fore})` }}></div>
    </div>
  );
};

export default Background;
