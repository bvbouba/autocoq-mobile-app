import React, { createContext, FC, PropsWithChildren, useContext } from "react";
import { Menu, MenuFragment, MenuItemFragment, useGetMenuQuery } from "@/saleor/api.generated";

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
            channel: "ci",
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
