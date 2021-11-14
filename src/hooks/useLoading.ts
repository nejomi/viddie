import { useState } from 'react';

export const useLoading = (initialState: boolean = true) => {
  const [loading, setLoading] = useState(initialState);

  const toggleLoading = () => {
    setLoading((val) => !val);
  };

  return [loading, toggleLoading] as const;
};
