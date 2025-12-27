import React from "react";
import { View, Text } from "react-native";

// types
import { HeaderProps } from "@navigation/types/header";

export default function Header({ title, action }: HeaderProps) {
    return (
        <View className="bg-[#044024] border-b-0 px-6 pt-10 pb-4 flex-row items-center justify-between">

            <View className="flex-row items-center gap-2">
                <Text className="text-2xl text-[#A7F3D0] bg-[#032b18] p-2 rounded-lg">
                    BRC
                </Text>
                <Text className="text-xl font-bold text-[#A7F3D0]">
                    {title}
                </Text>
            </View>

            {action}
        </View>
    );
}