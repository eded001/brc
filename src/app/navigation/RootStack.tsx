import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screens
import { Introduction } from "@screens/introduction";
import { Settings } from "@screens/settings";
import Register from "@test/screens/Register";
import Auth from "@test/screens/Auth";
import Firebase from "@test/screens/Firebase";

// navigation
const Stack = createNativeStackNavigator();
import AppTabs from "./AppTabs";

export default function RootStack() {
    const [hasSeenIntroduction, setHasSeenIntroduction] = useState(false);

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
                                navigation.replace("Register");
                            }}
                        />
                    )}
                </Stack.Screen>
            )}

             <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
            /> 

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

            <Stack.Screen
                name="Firebase"
                component={Firebase}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}