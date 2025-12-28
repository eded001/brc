import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CircleUserRound, Bug, Compass, Search as SearchIcon, Settings } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

// screens
import { Explore } from "@screens/explore";
import { Profile } from "@screens/profile";
import { Debug } from "@screens/debug";
import { Search as SearchScreen } from "@screens/search";

// components
import { Header, HeaderAction } from "@navigation/components/Header";

// colors
import { Colors } from "@/constants/colors";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
    const insets = useSafeAreaInsets();
    const isDebug = __DEV__;

    const tabs = [
        { name: "Explore", component: Explore, icon: Compass, title: "Explorar" },
        { name: "Search", component: SearchScreen, icon: SearchIcon, title: "Procurar" },
        { name: "Profile", component: Profile, icon: CircleUserRound, title: "Perfil" },
        ...(isDebug ? [{ name: "Debug", component: Debug, icon: Bug, title: "Depuração (Debug)" }] : []),
    ];

    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const tab = tabs.find(t => t.name === route.name);

                return {
                    header: () => (
                        <Header
                            title={tab?.title || ""}
                            action={
                                tab?.name === "Explore" ? (
                                    <HeaderAction
                                        screen="Settings"
                                        icon={Settings}
                                        size={24}
                                        color={colors.primary}
                                    />
                                ) : null
                            }
                        />
                    ),
                    tabBarHideOnKeyboard: true,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.borderGray,
                    tabBarStyle: {
                        backgroundColor: colors.background,
                        height: 60 + insets.bottom,
                        paddingTop: 5,
                        paddingBottom: insets.bottom,
                        borderTopWidth: 0,
                    },
                    headerShown: true,
                    tabBarLabelStyle: {
                        fontWeight: "700",
                    },
                    tabBarIcon: ({ color, size, focused }) => {
                        if (!tab) return null;
                        const Icon = tab.icon;

                        return (
                            <View
                                className={`p-1 mb-1 rounded-xl ${focused ? "bg-[#03382D]" : "bg-transparent"}`}
                                style={{ backgroundColor: focused ? colors.backButtonActive : "transparent" }}
                            >
                                <Icon
                                    color={color}
                                    size={size}
                                    fill={focused ? `${colors.primary}75` : "none"}
                                />
                            </View>
                        );
                    },
                };
            }}
        >
            {tabs.map(tab => (
                <Tab.Screen
                    key={tab.name}
                    name={tab.name}
                    component={tab.component}
                    options={{ title: tab.title }}
                />
            ))}
        </Tab.Navigator>
    );
}