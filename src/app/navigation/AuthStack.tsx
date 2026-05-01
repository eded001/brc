import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from '@debug/test/screens/Auth';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={Auth} />
        </Stack.Navigator>
    );
}