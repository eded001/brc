import React from "react";

// components
import { GoToScreen } from "@/components/go-to-screen";

// types
import { HeaderActionProps } from "@/constants/types/header/HeaderActionProps";

export default function HeaderAction({
    screen,
    icon: Icon,
    size = 22,
    color = "#A7F3D0",
}: HeaderActionProps) {
    return (
        <GoToScreen screen={screen}>
            <Icon size={size} color={color} />
        </GoToScreen>
    );
}