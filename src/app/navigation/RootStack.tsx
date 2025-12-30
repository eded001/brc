import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screens
import { Introduction } from "@screens/introduction";
import { Settings } from "@screens/settings";
import Register from "@test/screens/Register";
import Auth from "@test/screens/Auth";

// navigation
const Stack = createNativeStackNavigator();
import AppTabs from "./AppTabs";

export default function RootStack() {
    const [hasSeenIntroduction, setHasSeenIntroduction] = useState(true);

    return (
        <Stack.Navigator>
            {!hasSeenIntroduction && (
                <Stack.Screen
                    name="Introduction"
                    options={{ headerShown: false }}
                >
                    {({ navigation }) => (
                        <Introduction
                            onFinish={() => {
                                setHasSeenIntroduction(true);
                                navigation.replace("AppTabs");
                            }}
                        />
                    )}
                </Stack.Screen>
            )}

            {/* <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
            /> */}

            <Stack.Screen
                name="AppTabs"
                component={AppTabs}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Auth"
                component={Auth}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}