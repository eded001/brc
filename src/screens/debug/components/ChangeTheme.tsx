import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { useAppDispatch, useAppSelector } from '@debug/hooks/redux';
import { toggleTheme } from '@/reducers/themeSlice';

export default function ChangeTheme() {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme.mode);

    const isDark = theme === 'dark';

    return (
        <View
            className={`flex-1 items-center justify-center ${isDark ? 'bg-black' : 'bg-green-200'}`}>

            <Text
                className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'
                    }`}>
                Redux
            </Text>

            <Text
                className={`mb-8 ${isDark ? 'text-zinc-300' : 'text-zinc-700'
                    }`}>
                aperte no botão para mudar o tema
            </Text>

            <Text
                className={`mb-6 font-semibold ${isDark ? 'text-emerald-400' : 'text-blue-600'
                    }`}>
                Tema atual: {theme}
            </Text>

            <TouchableOpacity
                onPress={() => dispatch(toggleTheme())}
                className="bg-emerald-500 px-6 py-3 rounded-xl">

                <Text className="text-white font-bold">
                    Mudar tema
                </Text>
            </TouchableOpacity>

        </View>
    );
}