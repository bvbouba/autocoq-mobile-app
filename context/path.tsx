import {  usePathname, useRouter } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';

const PathContext = createContext<{ setPathSlug: (slug: string) => void; goBack: () => void }>({
  goBack: () => {},
  setPathSlug: () => {},
});

export const PathProvider = ({ children }: { children: React.ReactNode }) => {
  const [pathSlug, setPathSlug] = useState<string>();
  const router = useRouter();
  const pathname = usePathname();

  const goBack = () => {


    if (pathSlug==="orderSuccess") {
        router.push("/");
        
        return;
    }

    if (pathname.includes('shop') ) {
    
        if (pathSlug) {
          router.push(`/shop?slug=${pathSlug}`);
        } else {
          router.back(); 
        }

      } else {
        router.back();
      }
  };


  return (
    <PathContext.Provider value={{ setPathSlug, goBack }}>
      {children}
    </PathContext.Provider>
  );
};

export function usePath() {
  return useContext(PathContext);
}
