import React, { useRef, useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Pressable, Dimensions, Animated, Image, StatusBar, ViewToken, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

/* ─── Dimensões ───────────────────────────────────────────── */

const { width: W, height: H } = Dimensions.get("window");
const SLIDER_H = H * 0.62;

/* ─── Tipagem ─────────────────────────────────────────────── */

interface Slide {
    id: string;
    chip: string;
    icon: string;
    title: string;
    description: string;
    imageUri: string;
}

/* ─── Slides ───────────────────────────────────────────────── */

const SLIDES: Slide[] = [
    {
        id: "1",
        chip: "Comunidade",
        icon: "🌐",
        title: "Conecte com devs de todo o Brasil",
        description: "Encontre pessoas que compartilham sua stack e sua vibe.",
        imageUri: "https://picsum.photos/seed/brconn1/900/1100",
    },
    {
        id: "2",
        chip: "Habilidades",
        icon: "⚡",
        title: "Mostre o que você sabe fazer",
        description: "Seu perfil técnico visível para quem realmente importa.",
        imageUri: "https://picsum.photos/seed/brconn2/900/1100",
    },
    {
        id: "3",
        chip: "Oportunidades",
        icon: "🚀",
        title: "Projetos, vagas e colaborações",
        description: "A próxima grande jogada da sua carreira pode estar aqui.",
        imageUri: "https://picsum.photos/seed/brconn3/900/1100",
    },
    {
        id: "4",
        chip: "Crescimento",
        icon: "🧠",
        title: "Evolua junto com a comunidade",
        description: "Conteúdo, mentorias e discussões que movem carreiras.",
        imageUri: "https://picsum.photos/seed/brconn4/900/1100",
    },
];

/* ─── SlideItem ───────────────────────────────────────────── */

const SlideItem = React.memo(({ item }: { item: Slide }) => {
    return (
        <View style={{ width: W, height: SLIDER_H }}>
            <Image
                source={{ uri: item.imageUri }}
                className="absolute w-full h-full"
                resizeMode="cover"
            />

            {/* Overlay */}
            <View className="absolute inset-0">
                <View className="flex-[0.25] bg-[rgba(2,19,10,0.15)]" />
                <View className="flex-[0.30] bg-[rgba(2,19,10,0.55)]" />
                <View className="flex-[0.45] bg-[rgba(2,19,10,0.95)]" />
            </View>

            {/* Accent bar */}
            <View className="absolute top-0 left-0 right-0 h-[2.5px] bg-bright opacity-70" />

            {/* Grid decorativa */}
            <View className="absolute top-5 right-5 opacity-10">
                {[0, 1, 2, 3].map((row) => (
                    <View key={row} className="flex-row mb-2">
                        {[0, 1, 2, 3].map((col) => (
                            <View
                                key={col}
                                className="w-1 h-1 rounded-full bg-bright mr-2"
                            />
                        ))}
                    </View>
                ))}
            </View>

            {/* Texto */}
            <View className="absolute bottom-8 left-6 right-6">
                <View className="flex-row items-center self-start bg-surface border border-primary/50 rounded-full px-3 py-1 mb-3 gap-1.5">
                    <Text className="text-[11px]">{item.icon}</Text>
                    <Text className="text-bright text-[10px] font-bold tracking-[1.6px] uppercase">
                        {item.chip}
                    </Text>
                </View>

                <Text className="text-whiteSoft text-[25px] font-extrabold leading-[31px] mb-2.5">
                    {item.title}
                </Text>

                <Text className="text-muted text-sm leading-[21px]">
                    {item.description}
                </Text>
            </View>
        </View>
    );
});

/* ─── Dots ─────────────────────────────────────────────────── */

const Dots = ({ count, active }: { count: number; active: number }) => (
    <View className="flex-row justify-center items-center gap-1.5">
        {Array.from({ length: count }).map((_, i) => (
            <View
                key={i}
                className={`h-1.5 rounded-full ${i === active ? "w-5 bg-bright" : "w-1.5 bg-border"
                    }`}
            />
        ))}
    </View>
);

/* ─── Botões ───────────────────────────────────────────────── */

const BtnPrimary = ({
    label,
    onPress,
}: {
    label: string;
    onPress: () => void;
}) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.96,
            useNativeDriver: true,
            speed: 30,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 30,
            bounciness: 4,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className="bg-primary rounded-xl py-4 items-center shadow-lg"
            >
                {({ pressed }) => (
                    <Text
                        className="text-bg text-[15px] font-extrabold"
                        style={{ opacity: pressed ? 0.85 : 1 }}
                    >
                        {label}
                    </Text>
                )}
            </Pressable>
        </Animated.View>
    );
};

const BtnSecondary = ({
    label,
    onPress,
}: {
    label: string;
    onPress: () => void;
}) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.96,
            useNativeDriver: true,
            speed: 30,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 30,
            bounciness: 4,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className="bg-transparent rounded-xl py-4 items-center border-2 border-border"
            >
                {({ pressed }) => (
                    <Text
                        className="text-muted text-[15px] font-semibold"
                        style={{ opacity: pressed ? 0.6 : 1 }}
                    >
                        {label}
                    </Text>
                )}
            </Pressable>
        </Animated.View>
    );
};

/* ─── WelcomeScreen ───────────────────────────────────────── */

export default function WelcomeScreen() {
    const navigation = useNavigation<any>();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatRef = useRef<FlatList>(null);

    const masterOpacity = useRef(new Animated.Value(0)).current;
    const masterY = useRef(new Animated.Value(28)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(masterOpacity, {
                toValue: 1,
                duration: 650,
                useNativeDriver: true,
            }),
            Animated.spring(masterY, {
                toValue: 0,
                tension: 52,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems[0]?.index != null) {
                setActiveIndex(viewableItems[0].index);
            }
        },
        []
    );

    const viewAbilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
    });

    return (
        <View className="flex-1 bg-bg">
            <StatusBar barStyle="light-content" backgroundColor="#02130A" />

            {/* Carousel */}
            <Animated.View
                style={{
                    opacity: masterOpacity,
                    transform: [{ translateY: masterY }],
                }}
            >
                <FlatList
                    ref={flatRef}
                    data={SLIDES}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <SlideItem item={item} />}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    snapToInterval={W}
                    snapToAlignment="center"
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewAbilityConfig.current}
                    getItemLayout={(_, index) => ({
                        length: W,
                        offset: W * index,
                        index,
                    })}
                />
            </Animated.View>

            {/* Parte inferior */}
            <Animated.View
                className="flex-1 justify-between pt-4"
                style={{
                    opacity: masterOpacity,
                    transform: [{ translateY: masterY }],
                }}
            >
                <View className="items-center gap-3">
                    <Dots count={SLIDES.length} active={activeIndex} />

                    <View className="flex-row items-center w-3/5 gap-2.5">
                        <View className="flex-1 h-px bg-borderSub" />
                        <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <View className="flex-1 h-px bg-borderSub" />
                    </View>

                    <View className="items-center">
                        <Text className="text-whiteSoft text-[21px] font-black">
                            <Text className="text-bright">BR</Text> Connect
                        </Text>
                        <Text className="text-dim text-[10px] tracking-[1.4px] uppercase mt-1">
                            O hub social de eventos do Brasil
                        </Text>
                    </View>
                </View>

                <SafeAreaView edges={["bottom"]}>
                    <View className="px-6 pb-2 gap-3">
                        <BtnPrimary
                            label="Criar minha conta"
                            // onPress={() => navigation.navigate("Register")}
                        />
                        <BtnSecondary
                            label="Já tenho conta — Entrar"
                            // onPress={() => navigation.navigate("Login")}
                        />
                    </View>
                </SafeAreaView>
            </Animated.View>
        </View>
    );
}