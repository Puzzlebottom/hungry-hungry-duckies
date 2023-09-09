
import { useEffect } from 'react';
import useBugs from "../hooks/useBugs";

export default function Bugs({ bugState }) {

  const { startBugs, stopBugs, updateBugs, arena, } = useBugs();

  useEffect(() => {
    startBugs();
    return () => stopBugs();
  }, []);

  useEffect(() => {
    updateBugs(bugState);
  }, [bugState]);

  return (
    <div ref={arena} className='arena' />
  );
}
