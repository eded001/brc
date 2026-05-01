import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

// hooks
import { useAuth } from "@libs/application/auth/useAuth";

// screens
import { Introduction } from "@screens/introduction";
import { Settings } from "@screens/settings";
import Welcome from "@debug/test/screens/Welcome";
import Register from "@debug/test/screens/Register";
import Firebase from "@debug/test/screens/Firebase";
import Auth from "@screens/debug/test/screens/Auth";
import RBAC from "@screens/debug/test/screens/RBAC";
import Invite from "@screens/debug/test/screens/Invite";
import PrivateChatScreen from "@screens/debug/test/screens/PrivateChatScreen";

// navigation
import AppTabs from "./AppTabs";

const Stack = createNativeStackNavigator();

const screens = [
    // { name: "Introduction", isRenderProp: true },
    { name: "Welcome", component: Welcome },
    { name: "Register", component: Register },
    { name: "AppTabs", component: AppTabs },
    { name: "Settings", component: Settings },
    { name: "Firebase", component: Firebase },
    { name: "Auth", component: Auth },
    { name: "Invite", component: Invite },
    { name: "PrivateChat", component: PrivateChatScreen },
];

export default function RootStack() {
    const { user, loading } = useAuth();

    const [hasSeenIntroduction, setHasSeenIntroduction] = useState(false);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-zinc-950">
                <ActivityIndicator size="large" color="#10B981" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!hasSeenIntroduction && (
                <Stack.Screen name="Introduction">
                    {({ navigation }) => (
                        <Introduction
                            onFinish={() => {
                                setHasSeenIntroduction(true);

                                // Replace evita voltar pro onboarding
                                navigation.replace(
                                    user ? "AppTabs" : "Auth"
                                );
                            }}
                        />
                    )}
                </Stack.Screen>
            )}

            {user ? (
                <>
                    <Stack.Screen name="AppTabs" component={AppTabs} />
                    <Stack.Screen name="Settings" component={Settings} />
                    <Stack.Screen name="Firebase" component={Firebase} />
                    <Stack.Screen name="RBAC" component={RBAC} />
                    <Stack.Screen name="Invite" component={Invite} />
                    <Stack.Screen name="PrivateChat" component={PrivateChatScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Welcome" component={Welcome} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="Auth" component={Auth} />
                </>
            )}
        </Stack.Navigator>
    );
}