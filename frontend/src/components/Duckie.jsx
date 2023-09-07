import '../../public/stylesheets/Table.css';
import { useEffect, useRef } from 'react';

export default function Duckie({ images, isMunching, isClient }) {

  const image0 = useRef();
  const image1 = useRef();
  const image2 = useRef();

  const switchImage = (current, next) => {
    next.classList.remove('hidden');
    setTimeout(() => {
      current.classList.add('hidden');
    }, 10);
  };

  useEffect(() => {
    image1.current.classList.add('hidden');
    image2.current.classList.add('hidden');

    if (isMunching) {
      switchImage(image0.current, image1.current);
      setTimeout(() => {
        switchImage(image1.current, image2.current);
        setTimeout(() => {
          switchImage(image2.current, image1.current);
          setTimeout(() => {
            switchImage(image1.current, image0.current);
          }, 50); //out
        }, 150); //munch
      }, 25); //in
    }
  }, [isMunching]);

  return (
    <div>
      <img ref={image0} src={images[0]} className='duckie'></img>
      <img ref={image1} src={images[1]} className='duckie'></img>
      <img ref={image2} src={images[2]} className='duckie'></img>
    </div >
  );
}
