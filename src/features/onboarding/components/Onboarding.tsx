import React, { useState } from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from "react-native";

const { width } = Dimensions.get("window");

export interface Slide {
    id: string;
    title: string;
    description: string;
}

interface OnboardingProps {
    slides: Slide[];
    onFinish: () => void;

    /* Estilos customizáveis */
    containerStyle?: StyleProp<ViewStyle>;
    slideContainerStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    descriptionStyle?: StyleProp<TextStyle>;
    activeDotColor?: string;
    inactiveDotColor?: string;
    buttonStyle?: StyleProp<ViewStyle>;
    buttonTextStyle?: StyleProp<TextStyle>;
    buttonText?: string;
}

export default function Onboarding({
    slides,
    onFinish,
    containerStyle,
    slideContainerStyle,
    titleStyle,
    descriptionStyle,
    activeDotColor = "#16A34A",
    inactiveDotColor = "#A7F3D0",
    buttonStyle,
    buttonTextStyle,
    buttonText = "Começar",
}: OnboardingProps) {
    const [index, setIndex] = useState(0);

    return (
        <View className="flex-1" style={containerStyle}>
            <FlatList
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onScroll={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
                renderItem={({ item }) => (
                    <View style={[{ width }, { paddingHorizontal: 20 }, slideContainerStyle]} className="flex-1 items-center justify-center">
                        <Text style={titleStyle} className="text-3xl font-bold mb-3">{item.title}</Text>
                        <Text style={descriptionStyle} className="text-base text-center">{item.description}</Text>
                    </View>
                )}
            />

            <View className="pb-10 items-center">
                <View className="flex-row mb-5">
                    {slides.map((_, i) => (
                        <View
                            key={i}
                            style={{ backgroundColor: i === index ? activeDotColor : inactiveDotColor }}
                            className="h-2 w-2 mx-1 rounded-full"
                        />
                    ))}
                </View>

                {index === slides.length - 1 && (
                    <TouchableOpacity
                        onPress={onFinish}
                        style={buttonStyle}
                        className="px-8 py-3 rounded-md bg-green-900"
                    >
                        <Text style={buttonTextStyle} className="text-white font-semibold text-base">{buttonText}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}