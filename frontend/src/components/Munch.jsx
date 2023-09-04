import React, { useState } from 'react';

const MunchButton = ({ onMunch }) => {
  const [isMunching, setIsMunching] = useState(false);

  const handleMunch = () => {
    if (!isMunching) {
      setIsMunching(true);
      onMunch(() => {
        setIsMunching(false);
      });
    }
  };

  return (
    <button onClick={handleMunch} disabled={isMunching}>
      Munch
    </button>
  );
};

export default MunchButton;
