import { useState } from "react";

const useView = () => {
  const [view, setView] = useState('loading');

  return { view, setView };
};

export default useView;
