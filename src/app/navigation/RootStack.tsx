import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppTabs from "./AppTabs";
import { Introduction } from "@screens/introduction";

const Stack = createNativeStackNavigator();

export default function RootStack() {
    const [hasSeenIntroduction, setHasSeenIntroduction] = useState(false);

    return (
        <Stack.Navigator>
            {!hasSeenIntroduction ? (
                <Stack.Screen
                    name="Introduction"
                    options={{ headerShown: false }}
                >
                    {() => (
                        <Introduction
                            onFinish={() => setHasSeenIntroduction(true)}
                        />
                    )}
                </Stack.Screen>
            ) : (
                <Stack.Screen
                    name="AppTabs"
                    component={AppTabs}
                    options={{ headerShown: false }}
                />
            )}
        </Stack.Navigator>
    );
}