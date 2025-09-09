import React, { createContext, FC, PropsWithChildren, useContext } from "react";
import { MenuFragment, useGetMenuQuery } from "@/saleor/api.generated";
import { getConfig } from "@/config";

interface MenuContextModel {
    menu?: MenuFragment | null;
    loading: boolean;
}

const MenuContext = createContext<MenuContextModel | undefined>(undefined);

export const useMenuContext = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error("useMenuContext must be used within a MenuProvider");
    }
    return context;
};

export const MenuProvider: FC<PropsWithChildren> = ({ children }) => {
    const { data, loading } = useGetMenuQuery({
        variables: {
            channel: getConfig().channel,
            slug: "navbar",
        },
    });

    const menu = data?.menu 

    return (
        <MenuContext.Provider value={{ menu, loading }}>
            {children}
        </MenuContext.Provider>
    );
};
