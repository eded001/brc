import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackProps } from "@navigation/types/rootStack";

type GoToScreenProps = {
    screen: keyof RootStackProps;
    children: React.ReactNode;
    className?: string;
};

export default function GoToScreen({ screen, children, className }: GoToScreenProps) {
    const navigation =
        useNavigation<any>();

    return (
        <TouchableOpacity
            className={className}
            onPress={() => navigation.navigate(screen)}
        >
            {children}
        </TouchableOpacity>
    );
}