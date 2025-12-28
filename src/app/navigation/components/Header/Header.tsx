import React from "react";
import { View, Text } from "react-native";

// types
import { HeaderProps } from "@navigation/types/header";

// constants
import { Colors } from "@/constants/colors";

export default function Header({ title, action }: HeaderProps) {
    return (
        <View className={`flex-row items-center justify-between px-6 pt-10 pb-4`} style={{ backgroundColor: colors.background }}>
            <View className="flex-row items-center gap-2">
                <Text
                    className="text-2xl p-2 rounded-lg"
                    style={{ color: colors.primary, backgroundColor: colors.cardBackground }}
                >
                    BRC
                </Text>
                <Text
                    className="text-xl font-bold"
                    style={{ color: colors.primary }}
                >
                    {title}
                </Text>
            </View>

            {action}
        </View>
    );
}