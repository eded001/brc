import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

// hooks
import { useAuth } from "@libs/application/auth/useAuth";

// screens
import { Introduction } from "@screens/introduction";
import { Settings } from "@screens/settings";
import Welcome from "@screens/auth/views/Welcome";
import Register from "@screens/auth/views/Register";
import Auth from "@screens/auth/views/Auth";
import Firebase from "@screens/settings/views/Firebase";
import RBAC from "@screens/settings/views/RBAC";
import Invite from "@screens/chats/views/Chats";
import PrivateChatScreen from "@screens/chats/views/PrivateChatScreen";

// navigation
import AppTabs from "./AppTabs";

import { RootStackParamList } from "@navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();



export default function RootStack() {
    const { user, loading } = useAuth();

    const [hasSeenIntroduction, setHasSeenIntroduction] = useState(true);

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