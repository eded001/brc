import React from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackProps } from "@navigation/types/rootStack";

type GoToScreenProps = {
    screen: keyof RootStackProps;
    children: React.ReactNode;
    buttonStyle?: StyleProp<ViewStyle>;
};

export default function GoToScreen({
    screen,
    children,
    buttonStyle,
}: GoToScreenProps) {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackProps>>();

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={() => navigation.navigate(screen)}
        >
            {children}
        </TouchableOpacity>
    );
}