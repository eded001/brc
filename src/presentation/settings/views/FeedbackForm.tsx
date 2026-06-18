import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logger } from "@libs/infrastructure/logger/Logger";
import { Input } from "../../../shared/components/input/Input";
import { Button } from "../../../shared/components/button/Button";

import { RadioOption } from "src/presentation/debug/components/Radio";
import { Section } from "src/presentation/debug/components/Section";

import { feedbackSchema } from "src/presentation/debug/schemas/feedback.schema";

type FormErrors = Record<string, string>;

export default function FeedbackForm() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [useful, setUseful] = useState("");
    const [usefulExplain, setUsefulExplain] = useState("");
    const [rating, setRating] = useState("");

    const [improvements, setImprovements] = useState("");
    const [usability, setUsability] = useState("");
    const [fulfills, setFulfills] = useState("");
    const [fulfillsExplain, setFulfillsExplain] = useState("");

    const handleSubmit = () => {
        const payload = {
            name,
            email,
            useful,
            usefulExplain,
            rating,
            improvements,
            usability,
            fulfills,
            fulfillsExplain,
        };

        const result = feedbackSchema.safeParse(payload);

        if (!result.success) {
            const fieldErrors: FormErrors = {};

            result.error.errors.forEach((err) => {
                const field = err.path[0] as string;
                fieldErrors[field] = err.message;
            });

            setErrors(fieldErrors);

            Alert.alert(
                "Formulário inválido",
                "Por favor, corrija os campos destacados."
            );

            return;
        }

        setErrors({});
        setLoading(true);

        const finalPayload = {
            ...result.data,
            timestamp: new Date().toISOString(),
        };

        Logger.info('FeedbackForm', 'Enviando feedback', finalPayload);

        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                "Feedback enviado com sucesso!",
                "Obrigado por contribuir com a evolução do BRC <3 Um Beijão da AmazoNext pra você 💚"
            );
        }, 1200);
    };

    const errorText = (field: string) =>
        errors[field] ? (
            <Text className="text-red-500 mt-2 text-sm">
                {errors[field]}
            </Text>
        ) : null;

    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <ScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-10">
                    <Text className="text-3xl font-bold text-white mb-3">
                        Pesquisa de Satisfação
                    </Text>

                    <Text className="text-zinc-400 text-base leading-6">
                        Seu feedback orienta a evolução do aplicativo.
                    </Text>
                </View>

                <Section number="1" title="Nome">
                    <Input
                        value={name}
                        onChangeText={setName}
                        placeholder="Digite seu nome completo"
                        error={errors.name}
                    />
                </Section>

                <Section number="2" title="E-mail (opcional)">
                    <Input
                        value={email}
                        onChangeText={setEmail}
                        placeholder="seu@email.com"
                        keyboardType="email-address"
                        error={errors.email}
                    />
                </Section>

                <Section number="3" title="Você achou o app útil?">
                    <View className="gap-3">
                        {["Sim", "Parcialmente", "Não"].map((opt) => (
                            <RadioOption
                                key={opt}
                                label={opt}
                                selected={useful === opt}
                                onPress={() => setUseful(opt)}
                            />
                        ))}
                    </View>
                    {errorText("useful")}

                    <Input
                        value={usefulExplain}
                        onChangeText={setUsefulExplain}
                        placeholder="Explique brevemente..."
                        multiline
                        error={errors.usefulExplain}
                    />
                </Section>

                <Section number="4" title="De 0 a 10, qual nota você dá ao app?">
                    <Text className="text-zinc-500 text-sm mb-4">
                        (0 = muito ruim | 10 = excelente)
                    </Text>

                    <View className="flex-row flex-wrap gap-2">
                        {Array.from({ length: 11 }, (_, i) => String(i)).map((opt) => (
                            <Pressable
                                key={opt}
                                onPress={() => setRating(opt)}
                                className={`w-[30%] py-3 rounded-xl border items-center ${rating === opt
                                    ? "bg-emerald-500 border-emerald-500"
                                    : errors.rating
                                        ? "border-red-500"
                                        : "border-zinc-700 bg-zinc-800"
                                    }`}
                            >
                                <Text
                                    className={`font-semibold ${rating === opt ? "text-white" : "text-zinc-200"
                                        }`}
                                >
                                    {opt}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {errorText("rating")}
                </Section>

                <Section
                    number="5"
                    title="Como você avalia a usabilidade (facilidade de uso)?"
                >
                    <View className="gap-3">
                        {["Muito ruim", "Ruim", "Regular", "Boa", "Excelente"].map(
                            (opt) => (
                                <RadioOption
                                    key={opt}
                                    label={opt}
                                    selected={usability === opt}
                                    onPress={() => setUsability(opt)}
                                />
                            )
                        )}
                    </View>
                    {errorText("usability")}
                </Section>

                <Section number="6" title="Que melhorias você sugere para o app?">
                    <Input
                        value={improvements}
                        onChangeText={setImprovements}
                        placeholder="Sugestões de melhorias..."
                        multiline
                        error={errors.improvements}
                    />
                </Section>

                <Section
                    number="7"
                    title="O app cumpre o papel que se propõe a cumprir?"
                >
                    <View className="gap-3">
                        {["Sim", "Parcialmente", "Não"].map((opt) => (
                            <RadioOption
                                key={opt}
                                label={opt}
                                selected={fulfills === opt}
                                onPress={() => setFulfills(opt)}
                            />
                        ))}
                    </View>
                    {errorText("fulfills")}

                    <Input
                        value={fulfillsExplain}
                        onChangeText={setFulfillsExplain}
                        placeholder="Explique sua resposta..."
                        multiline
                        error={errors.fulfillsExplain}
                    />
                </Section>

                <Button
                    title="Confirmar Feedback"
                    onPress={handleSubmit}
                    loading={loading}
                    className="mt-6"
                />
            </ScrollView>
        </SafeAreaView>
    );
}