
import { useEffect, useState } from 'react';
import useBugs from "../hooks/useBugs";

export default function Bugs({ bugState }) {

  const { startBugs, stopBugs, updateBugs, arena, } = useBugs();
  const [height, setHeight] = useState(document.body.clientHeight);
  const [width, setWidth] = useState(document.body.clientWidth);

  const handleResize = () => {
    setHeight(document.body.clientHeight);
    setWidth(document.body.clientWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    startBugs(width, height);

    return () => {
      stopBugs();
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height]);

  useEffect(() => {
    updateBugs(bugState);
  }, [bugState]);

  return (
    <div ref={arena} className='arena' />
  );
}
