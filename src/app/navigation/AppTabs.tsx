import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CircleUserRound, TestTube, SearchIcon, Compass } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Screens
import Test from "@/features/debug/screens/Test";
import Explore from "@/features/explore/screens/Explore";
import Profile from "@/features/profile/screens/Profile";
import Search from "@/features/search/screens/Search";

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
            name: "Pesquisar",
            component: Search,
            icon: SearchIcon,
            title: "Perfil",
            avatar: null,
        },
        {
            name: "Profile",
            component: Profile,
            icon: CircleUserRound,
            title: "Perfil",
            avatar: null,
        },
        ...(isDebug
            ? [{ name: "Test", component: Test, icon: TestTube, title: "Testes" }]
            : []),
    ];

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
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
                // eslint-disable-next-line react/no-unstable-nested-components
                tabBarIcon: ({ color, size, focused }) => {
                    const tab = tabs.find(t => t.name === route.name);
                    if (!tab) return null;

                    const Icon = tab.icon;
                    return (
                        <Icon
                            color={color}
                            size={size}
                            fill={focused ? "#72B63B75" : "none"}
                        />
                    );
                },
            })}
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