import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Explore: undefined;
    Profile: undefined;
    Settings: undefined;
    Onboarding: undefined;
};

type TestScreenProp = NativeStackNavigationProp<RootStackParamList>;

export default function Test() {
    const navigation = useNavigation<TestScreenProp>();

    return (
        <View className="flex-1 bg-black items-center justify-center px-6">
            <Text className="text-green-500 text-3xl font-bold mb-8">Test Hub</Text>

            <TouchableOpacity
                onPress={() => navigation.navigate('Explore')}
                className="w-full bg-green-600 py-4 rounded-xl mb-4"
                activeOpacity={0.8}
            >
                <Text className="text-black text-center text-lg font-semibold">Explore</Text>
            </TouchableOpacity>
        </View>
    );
}