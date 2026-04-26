import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screens
import { Introduction } from "@screens/introduction";
import { Settings } from "@screens/settings";
import Welcome from "@debug/test/screens/Welcome";
import Register from "@debug/test/screens/Register";
import Firebase from "@debug/test/screens/Firebase";

// navigation
import AppTabs from "./AppTabs";

const Stack = createNativeStackNavigator();

// Configuração centralizada das telas
const screens = [
    // { name: "Introduction", isRenderProp: true },
    { name: "Welcome", component: Welcome },
    { name: "Register", component: Register },
    { name: "AppTabs", component: AppTabs },
    { name: "Settings", component: Settings },
    { name: "Firebase", component: Firebase },
];

export default function RootStack() {
    // const [hasSeenIntroduction, setHasSeenIntroduction] = useState(false);

    return (
        <Stack.Navigator initialRouteName="AppTabs">
            {/* {!hasSeenIntroduction && (
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
            )} */}


            {screens.map(({ name, component }) => (
                <Stack.Screen
                    key={name}
                    name={name}
                    component={component}
                    options={{ headerShown: false }}
                />
            ))}
        </Stack.Navigator>
    );
}