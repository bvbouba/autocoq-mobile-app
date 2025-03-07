import { usePathname, useRouter } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext<{ setNavigationParams: (slug: string) => void; handleBackNavigation: () => void }>({
  handleBackNavigation: () => {},
  setNavigationParams: () => {},
});

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [navigationParams, setNavigationParams] = useState<string>();
  const router = useRouter();
  const pathname = usePathname();

  const handleBackNavigation = () => {
    if (navigationParams === "orderSuccess") {
      router.push("/");
      return;
    }

    if (pathname.includes('shop')) {
      if (navigationParams) {
        router.push(`/shop?id=${navigationParams}`);
      } else {
        router.push("/shop");
      }
    } else {
      router.back();
    }
  };

  return (
    <NavigationContext.Provider value={{ setNavigationParams, handleBackNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigationContext() {
  return useContext(NavigationContext);
}
