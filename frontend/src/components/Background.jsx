import { useEffect } from 'react';
import backgrounds from '../assets/wallpaper';
import '../sass/Background.scss';

const Background = ({ view }) => {
  const PIXEL_HEIGHT = 324;
  const classNames = { '0': 'one', '1': 'two', '2': 'three', '3': 'four', '4': 'five' };

  const getRatio = (rotationInRadians) => {
    const viewHeightPixels = document.body.clientHeight;
    const viewWidthPixels = document.body.clientWidth;

    if (rotationInRadians >= Math.PI / 2) {
      return viewWidthPixels / 324;
    }

    const rightAngle = Math.PI / 2;
    const theta1 = rotationInRadians;
    const theta2 = Math.PI - rightAngle - theta1;
    const a = Math.sin(theta1) * viewHeightPixels / Math.sin(theta2);
    const b = viewWidthPixels - a;
    const c = Math.sin(rightAngle) * viewHeightPixels / Math.sin(theta2);
    const d = Math.sin(theta1) * b / Math.sin(rightAngle);
    const ratio = (c + d) / PIXEL_HEIGHT;
    return ratio;
  };

  const handleResize = () => {
    const containers = document.getElementsByClassName('background-container');
    for (const container of containers) {
      const ratio = getRatio(container.dataset.rotation);
      container.style.transform = `scale(${ratio})`;
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const layers = backgrounds[view].map(({ layer, rotation }, index) => {
    return (
      <div className={`background-container ${view}`} key={index} data-rotation={rotation} style={{ transform: `scale(${getRatio(rotation)})` }}>
        <div className={`layer ${classNames[index]}`} style={{ backgroundImage: `url(${layer})` }} />
      </div>
    );
  });

  return (layers);
};

export default Background;
