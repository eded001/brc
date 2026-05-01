import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { useAuth } from "@libs/application/auth/useAuth";

// components
import { GoToScreen } from '@/components/go-to-screen';

// Routes
const screens = [
    { name: 'Register', label: 'Register' },
    { name: 'Firebase', label: 'Firebase' },
    { name: 'Oauth', label: 'Oauth' },
    { name: 'RBAC', label: 'RBAC' },
    { name: 'Invite', label: 'Invite' },
];


export default function Test() {
    const { signOut } = useAuth();

    async function handleLogout() {
        try {
            await signOut();
        } catch (error) {
            console.error("Erro ao deslogar", error);
        }
    }

    return (
        <View className="flex-1 items-center justify-center px-6 bg-black">
            <Text className="text-green-500 text-3xl font-bold mb-8">
                Test Hub
            </Text>

            {screens.map(({ name, label }) => (
                <GoToScreen
                    key={name}
                    screen={name}
                    className="w-full bg-green-600 py-4 rounded-xl mb-4"
                >
                    <Text className="text-black text-center text-lg font-semibold">
                        {label}
                    </Text>
                </GoToScreen>
            ))}

            <Pressable
                onPress={handleLogout}
                className="w-full bg-green-600 py-4 rounded-xl mb-4"
            >
                <Text className="text-black text-center text-lg font-semibold">
                    Sair da conta
                </Text>
            </Pressable>
        </View>
    );
}