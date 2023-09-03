import '../../public/stylesheets/Table.css';
import { useEffect, useState, useRef } from 'react';

export default function Duckie({ images, isMunching }) {

  const [image, setImage] = useState(0);

  const image0 = useRef();
  const image1 = useRef();
  const image2 = useRef();

  useEffect(() => {
    image1.current.classList.add('hidden');
    image2.current.classList.add('hidden');

    if (isMunching) {
      image1.current.classList.remove('hidden');
      image0.current.classList.add('hidden');
      setTimeout(() => {
        image2.current.classList.remove('hidden');
        image1.current.classList.add('hidden');
        setTimeout(() => {
          image1.current.classList.remove('hidden');
          image2.current.classList.add('hidden');
          setTimeout(() => {
            image0.current.classList.remove('hidden');
            image1.current.classList.add('hidden');
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
