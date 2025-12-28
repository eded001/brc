import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CircleUserRound, Bug, Compass, Search as SearchIcon, Settings } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// screens
import { Explore } from "@screens/explore";
import { Profile } from "@screens/profile";
import { Debug } from "@screens/debug";
import { Search as SearchScreen } from "@screens/search";

// components
import { Header, HeaderAction } from "@navigation/components/Header";
import { View } from "react-native";

const Tab = createBottomTabNavigator();
export default function AppTabs() {
    const insets = useSafeAreaInsets();
    const isDebug = __DEV__;
    const tabs = [
        {
            name: "Explore",
            component: Explore,
            icon: Compass,
            title: "Explorar"
        },
        {
            name: "Search",
            component: SearchScreen,
            icon: SearchIcon,
            title: "Procurar"
        },
        {
            name: "Profile",
            component: Profile,
            icon: CircleUserRound,
            title: "Perfil"
        },
        ...(isDebug ? [{
            name: "Debug",
            component: Debug,
            icon: Bug,
            title: "Depuração (Debug)"
        }] : []),
    ];

    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const tab = tabs.find(t => t.name === route.name);
                return {
                    // eslint-disable-next-line react/no-unstable-nested-components
                    header: () => (
                        <Header
                            title={tab?.title || ""}
                            action={
                                tab?.name === "Explore" ? (
                                    <HeaderAction
                                        screen="Settings"
                                        icon={Settings}
                                        size={24}
                                        color="#A7F3D0"
                                    />
                                ) : null
                            }
                        />
                    ),
                    tabBarHideOnKeyboard: true,
                    tabBarActiveTintColor: "#A7F3D0",
                    tabBarInactiveTintColor: "#C1D9A7",
                    tabBarStyle: {
                        backgroundColor: "#044024",
                        height: 60 + insets.bottom,
                        paddingTop: 5,
                        paddingBottom: insets.bottom,
                        borderTopWidth: 0,
                    },
                    headerShown: true,
                    tabBarLabelStyle: {
                        fontWeight: "700",
                    },
                    // eslint-disable-next-line react/no-unstable-nested-components
                    tabBarIcon: ({ color, size, focused }) => {
                        if (!tab) return null;
                        const Icon = tab.icon;

                        return (
                            <View
                                className={`p-[4px] mb-1 rounded-xl ${focused ? "bg-emerald-800" : "bg-transparent"}`}
                            >
                                <Icon
                                    color={color}
                                    size={size}
                                    fill={focused ? "#72B63B75" : "none"}
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
                    options={{
                        title: tab.title,
                    }}
                />
            ))}
        </Tab.Navigator>
    );
}