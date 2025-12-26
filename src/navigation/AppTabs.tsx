import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@/screens/Home';
import Profile from '@/screens/Profile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
    const tabs = [
        { name: "Chats", component: Home, title: "Chats" },
        { name: "Profile", component: Profile, title: "Perfil" },
    ];

    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={() => ({
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
            })}
        >
            {tabs.map((tab) => (
                <Tab.Screen
                    key={tab.name}
                    name={tab.name}
                    component={tab.component}
                    options={{ title: tab.title }}
                    listeners={{
                        tabPress: (e) => {
                            if (tab.name === "CreateEventTab") {
                                e.preventDefault();
                            }
                        },
                    }}
                />
            ))}
        </Tab.Navigator>
    );
}