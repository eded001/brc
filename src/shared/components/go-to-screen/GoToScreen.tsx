import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackProps } from "@/constants/types/rootStack";

type GoToScreenProps = {
    screen: keyof RootStackProps;
    params?: any;
    children: React.ReactNode;
    className?: string;
};

export default function GoToScreen({ screen, params, children, className }: GoToScreenProps) {
    const navigation = useNavigation<any>();

    function handlePress() {
        console.log("🚀 [NAVIGATE]", { screen, params });

        navigation.getParent()?.navigate(screen, params);
    }

    return (
        <TouchableOpacity
            className={className}
            onPress={handlePress}
        >
            {children}
        </TouchableOpacity>
    );
}