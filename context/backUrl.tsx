import { useRouter } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';

const BackUrlContext = createContext<{ backUrl: string | null; setBackUrl: (url: string) => void, }>({
  backUrl: null,
  setBackUrl: () => {},
});

export const BackUrlProvider = ({ children }: { children: React.ReactNode }) => {
  const [backUrl, setBackUrl] = useState<string | null>(null);




  return (
    <BackUrlContext.Provider value={{ backUrl, setBackUrl }}>
      {children}
    </BackUrlContext.Provider>
  );
}

export function useBackUrl() {
  return useContext(BackUrlContext);
}