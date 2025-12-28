import React, { useRef, useState } from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, StyleProp, ViewStyle, TextStyle, } from "react-native";
import { SlidesProps } from "./types/slides";

const { width } = Dimensions.get("window");

interface OnboardingProps {
    slides: SlidesProps[];
    onFinish: () => void;

    allowSwipe?: boolean;

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
    allowSwipe = true,
    containerStyle,
    slideContainerStyle,
    titleStyle,
    descriptionStyle,
    activeDotColor = "#16A34A",
    inactiveDotColor = "#A7F3D0",
    buttonText = "Começar",
}: OnboardingProps) {
    const [index, setIndex] = useState(0);
    const listRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (index < slides.length - 1) {
            listRef.current?.scrollToIndex({
                index: index + 1,
                animated: true,
            });
            setIndex(index + 1);
        } else {
            onFinish();
        }
    };

    const handleBack = () => {
        if (index > 0) {
            listRef.current?.scrollToIndex({
                index: index - 1,
                animated: true,
            });
            setIndex(index - 1);
        }
    };

    return (
        <View className="flex-1" style={containerStyle}>
            <FlatList
                ref={listRef}
                data={slides}
                horizontal
                pagingEnabled
                scrollEnabled={allowSwipe}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onScroll={(e) => {
                    if (!allowSwipe) return;
                    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                    setIndex(newIndex);
                }}
                renderItem={({ item }) => (
                    <View
                        style={[{ width, paddingHorizontal: 20 }, slideContainerStyle]}
                        className="flex-1 items-center justify-center"
                    >
                        <Text style={titleStyle} className="text-3xl font-bold mb-3">
                            {item.title}
                        </Text>
                        <Text style={descriptionStyle} className="text-base text-center">
                            {item.description}
                        </Text>
                    </View>
                )}
            />

            <View className="pb-10 items-center">
                {/* Pontinhos */}
                <View className="flex-row mb-5">
                    {slides.map((_, i) => (
                        <View
                            key={i}
                            style={{
                                backgroundColor: i === index ? activeDotColor : inactiveDotColor,
                            }}
                            className="h-2 w-2 mx-1 rounded-full"
                        />
                    ))}
                </View>

                <View className="flex-row justify-between w-full px-10 mb-5">
                    {index > 0 ? (
                        <TouchableOpacity
                            onPress={handleBack}
                            className="px-6 py-3 rounded-md bg-green-800"
                        >
                            <Text className="text-green-200 font-semibold">Voltar</Text>
                        </TouchableOpacity>
                    ) : (
                        <View className="px-6 py-3" /> // espaço vazio
                    )}

                    <TouchableOpacity
                        onPress={handleNext}
                        className="px-6 py-3 rounded-md bg-green-900"
                    >
                        <Text className="text-green-100 font-semibold">
                            {index === slides.length - 1 ? buttonText : "Próximo"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}