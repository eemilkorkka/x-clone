"use client";

import { IoSettings, IoSettingsOutline } from "react-icons/io5"
import { Navitem } from "./Navitem"
import useWindowWidth from "@/hooks/useWindowWidth";

export const SettingsNavItem = () => {

    const width = useWindowWidth();

    return (
        <Navitem
            href={width < 1024 ? "/settings" : "/settings/account"}
            icon={<IoSettingsOutline size={30} />}
            activeIcon={<IoSettings size={30} />}
            label="Settings and privacy"
            styles="hidden mobile:flex"
        />
    )
}