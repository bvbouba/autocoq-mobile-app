import { usePathname, useRouter } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext<{ setNavigationSlug: (slug: string) => void; handleBackNavigation: () => void }>({
  handleBackNavigation: () => {},
  setNavigationSlug: () => {},
});

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [navigationSlug, setNavigationSlug] = useState<string>();
  const router = useRouter();
  const pathname = usePathname();

  const handleBackNavigation = () => {
    if (navigationSlug === "orderSuccess") {
      router.push("/");
      return;
    }

    if (pathname.includes('shop')) {
      if (navigationSlug) {
        router.push(`/shop?slug=${navigationSlug}`);
      } else {
        router.back();
      }
    } else {
      router.back();
    }
  };

  return (
    <NavigationContext.Provider value={{ setNavigationSlug, handleBackNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigationContext() {
  return useContext(NavigationContext);
}
