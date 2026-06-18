import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Logger } from "../../../libs/infrastructure/logger/Logger";
import { RootStackParamList, RootStackNavigationProp } from "../../../../app/navigation/types";

type GoToScreenProps<T extends keyof RootStackParamList> = {
    screen: T;
    params?: RootStackParamList[T];
    children: React.ReactNode;
    className?: string;
};

export default function GoToScreen<T extends keyof RootStackParamList>({ screen, params, children, className }: GoToScreenProps<T>) {
    const navigation = useNavigation<RootStackNavigationProp>();

    function handlePress() {
        Logger.info('Navigation', 'Navigate', { screen, params });
        navigation.getParent()?.navigate(screen as any, params as any);
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