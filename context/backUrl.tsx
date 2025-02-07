import {  usePathname, useRouter } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';

const PathContext = createContext<{ addPath: (slug: string) => void; goBack: () => void }>({
  goBack: () => {},
  addPath: () => {},
});

export const PathProvider = ({ children }: { children: React.ReactNode }) => {
  const [path, setPath] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const goBack = () => {
    setPath((prev) => {
      if (pathname.includes('shop') && prev.length > 0) {
        const newPath = prev.slice(0, -1);
        const slug = newPath[newPath.length - 1]; // Get the last slug after removing the current one

        if (slug) {
          router.push(`/shop?slug=${slug}`);
        } else {
          router.back(); // If no more slugs, use default back behavior
        }

        return newPath;
      } else {
        router.back();
        return prev; // No modification needed
      }
    });
  };

  const addPath = (slug: string) => {
    setPath((prev) => (prev[prev.length - 1] === slug ? prev : [...prev, slug]));
  };

  return (
    <PathContext.Provider value={{ addPath, goBack }}>
      {children}
    </PathContext.Provider>
  );
};

export function usePath() {
  return useContext(PathContext);
}
