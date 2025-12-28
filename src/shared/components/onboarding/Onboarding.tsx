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
                <View className="flex-row mb-5">
                    {slides.map((_, i) => (
                        <View
                            key={i}
                            style={{
                                backgroundColor:
                                    i === index ? activeDotColor : inactiveDotColor,
                            }}
                            className="h-2 w-2 mx-1 rounded-full"
                        />
                    ))}
                </View>

                {controlledByButton && index === slides.length - 1 && (
                    <TouchableOpacity
                        onPress={handleNext}
                        style={buttonStyle}
                        className="px-8 py-3 rounded-md bg-green-900"
                    >
                        <Text
                            style={buttonTextStyle}
                            className="text-white font-semibold text-base"
                        >
                            {buttonText}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}