"use client";
import PostButtonDialog from "@/components/Layout/LeftSideBar/PostButtonDialog";
import Button from "../Button";
import { FaFeatherPointed } from "react-icons/fa6";
import { useContext } from "react";
import { DisplayContext } from "@/Context/DisplayContext";
import { bgColors } from "@/utils/colors";

const FloatingPostButton = () => {

    const { selectedIndex } = useContext(DisplayContext)!;

    return (
        <div className="mobile:hidden fixed bottom-20 right-5 z-10">
            <PostButtonDialog>
                <Button styles={`${bgColors[selectedIndex ?? 0].color}`}>
                    <FaFeatherPointed size={35} className="p-1" />
                </Button>
            </PostButtonDialog>
        </div>
    );
}

export default FloatingPostButton;