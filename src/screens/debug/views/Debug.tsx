import React from 'react';
import { View, Text } from 'react-native';

// components
import { GoToScreen } from '@/components/go-to-screen';
import { Provider } from 'react-redux';
import { store } from '@/store';

// Routes
const screens = [
    { name: 'Register', label: 'Register' },
    { name: 'Auth', label: 'Auth' },
    { name: 'Firebase', label: 'Firebase' },
    { name: 'Redux', label: 'Redux' },
];

import { useAppSelector } from '@debug/hooks/redux';

export default function Test() {
    const theme = useAppSelector((state) => state.theme.mode);

    const isDark = theme === 'dark';
    return (
        <Provider store={store}>
            <View className={`flex-1 items-center justify-center px-6 ${isDark ? 'bg-black' : 'bg-green-200'}`}>
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
            </View>
        </Provider>
    );
}