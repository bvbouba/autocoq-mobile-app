import { Href } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext<{ setNavigationLink: (slug: Href | undefined) => void; navigationLink: Href | undefined}>({
  navigationLink: "/",
  setNavigationLink: () => {},
});

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [navigationLink, setNavigationLink] = useState<Href | undefined>(undefined);


  // const handleBackNavigation = () => {
  //   if (navigationParams === "orderSuccess") {
  //     router.push("/");
  //     return;
  //   }

  //   if (pathname.includes('shop')) {
  //     if (navigationParams) {
  //       router.push(`/shop?id=${navigationParams}`);
  //     } else {
  //       router.push("/shop");
  //     }
  //   } else {
  //     router.back();
  //   }
  // };

  return (
    <NavigationContext.Provider value={{ setNavigationLink, navigationLink }}>
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigationContext() {
  return useContext(NavigationContext);
}
