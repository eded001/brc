import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screens
// import { Introduction } from "@screens/introduction";
import { Settings } from "@screens/settings";
import Welcome from "@test/screens/Welcome";
import Register from "@test/screens/Register";
import Auth from "@test/screens/Auth";
import Firebase from "@test/screens/Firebase";
import Redux from "@screens/debug/test/screens/Redux";

// navigation
import AppTabs from "./AppTabs";
import { store } from "@/store";
import { Provider } from "react-redux";

const Stack = createNativeStackNavigator();

// Configuração centralizada das telas
const screens = [
    // {
    //     name: "Introduction",
    //     isRenderProp: true,
    // },

    { name: "Welcome", component: Welcome },
    { name: "Register", component: Register },
    { name: "AppTabs", component: AppTabs },
    { name: "Settings", component: Settings },
    { name: "Auth", component: Auth },
    { name: "Firebase", component: Firebase },
    { name: "Redux", component: Redux }
];

export default function RootStack() {
    // const [hasSeenIntroduction, setHasSeenIntroduction] = useState(false);

    return (
        <Provider store={store}>
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
        </Provider>
    );
}