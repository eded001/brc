import React from 'react';
import { View, Text } from 'react-native';

// components
import { GoToScreen } from '@/components/go-to-screen';

export default function Test() {
    return (
        <View className="flex-1 bg-black items-center justify-center px-6">
            <Text className="text-green-500 text-3xl font-bold mb-8">Test Hub</Text>

            <GoToScreen
                screen="Register"
                className="w-full bg-green-600 py-4 rounded-xl mb-4"
            >
                <Text className="text-black text-center text-lg font-semibold">Register</Text>
            </GoToScreen>

            <GoToScreen
                screen='Auth'
                className="w-full bg-green-600 py-4 rounded-xl mb-4"
            >
                <Text className="text-black text-center text-lg font-semibold">Auth</Text>
            </GoToScreen>

            <GoToScreen
                screen='Firebase'
                className="w-full bg-green-600 py-4 rounded-xl mb-4"
            >
                <Text className="text-black text-center text-lg font-semibold">Firebase</Text>
            </GoToScreen>
        </View>
    );
}