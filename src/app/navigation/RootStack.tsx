import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Navigation
import AppTabs from "@/app/navigation/AppTabs";

// Screens
import Onboarding from "@/features/onboarding/screens/Introduction";

const Stack = createNativeStackNavigator();

export default function RootStack() {
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!hasSeenOnboarding ? (
                <Stack.Screen name="Onboarding">
                    {() => (
                        <Onboarding
                            onFinish={() => setHasSeenOnboarding(true)}
                        />
                    )}
                </Stack.Screen>
            ) : (
                <Stack.Screen name="AppTabs" component={AppTabs} />
            )}
        </Stack.Navigator>
    );
}