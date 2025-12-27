import React from "react";
import { View } from "react-native";
import Onboarding, { Slide } from "../components/Onboarding";

const SLIDES: Slide[] = [
    { id: "1", title: "Bem-vindo", description: "Organize suas ideias e avance com foco." },
    { id: "2", title: "Produtividade", description: "Fluxos simples, execução eficiente." },
    { id: "3", title: "Tudo pronto", description: "Vamos começar sua jornada." },
];

interface OnboardingScreenProps {
    onFinish: () => void;
}

export default function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
    return (
        <View className="flex-1 bg-green-50">
            <Onboarding
                slides={SLIDES}
                onFinish={onFinish}
                activeDotColor="#16A34A"
                inactiveDotColor="#A7F3D0"
                buttonText="Vamos lá"
            />
        </View>
    );
}