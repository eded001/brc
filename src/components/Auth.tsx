// Auth.tsx
import React, { useState } from "react";
import { Alert, View, Text, TextInput, Pressable } from "react-native";
import { supabase } from '@/services/lib/supabase';

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.signUp({ email, password });
        if (error) Alert.alert(error.message);
        if (!session) Alert.alert("Verifique seu email para confirmar o cadastro.");
        setLoading(false);
    }

    return (
        <View className="flex-1 items-center justify-center bg-green-50 px-6">
            <View className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                <View className="mb-6 items-center">
                    <Text className="text-2xl font-bold text-green-900">Bem-vindo</Text>
                    <Text className="mt-1 text-sm text-green-700">Acesse sua conta para continuar</Text>
                </View>

                <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium text-green-700">Email</Text>
                    <TextInput
                        className="h-12 rounded-xl border border-green-300 bg-green-50 px-4 text-base text-green-900 focus:border-green-700"
                        placeholder="email@address.com"
                        placeholderTextColor="#6B7280"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View className="mb-6">
                    <Text className="mb-1 text-sm font-medium text-green-700">Password</Text>
                    <TextInput
                        className="h-12 rounded-xl border border-green-300 bg-green-50 px-4 text-base text-green-900 focus:border-green-700"
                        placeholder="••••••••"
                        placeholderTextColor="#6B7280"
                        secureTextEntry
                        autoCapitalize="none"
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <Pressable
                    disabled={loading}
                    onPress={signInWithEmail}
                    className={`mb-3 h-12 items-center justify-center rounded-xl ${loading ? "bg-green-300" : "bg-green-700 active:bg-green-800"}`}
                >
                    <Text className="text-base font-semibold text-white">Entrar</Text>
                </Pressable>

                <Pressable
                    disabled={loading}
                    onPress={signUpWithEmail}
                    className="h-12 items-center justify-center rounded-xl border border-green-700"
                >
                    <Text className="text-base font-semibold text-green-700">Criar conta</Text>
                </Pressable>
            </View>

            <Text className="mt-6 text-xs text-green-400">© 2025 · Secure Auth by Supabase</Text>
        </View>
    );
}