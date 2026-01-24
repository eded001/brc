import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CircleUserRound, Bug, Compass, Search as SearchIcon, Settings, MessageCircle, TicketsIcon, } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

// screens
import { Explore } from "@screens/explore";
import { Profile } from "@screens/profile";
import { Debug } from "@screens/debug";
import { Search as SearchScreen } from "@screens/search";
import { Chats } from "@screens/chats";
import { Events } from "@screens/events";

// components
import { Header, HeaderAction } from "@/components/header";

// colors
import { Colors } from "@/constants/colors";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const insets = useSafeAreaInsets();
  const isDebug = __DEV__;

  const tabs = [
    {
      name: "Explore",
      component: Explore,
      icon: Compass,
      title: "Explorar",
    },
    {
      name: "Search",
      component: SearchScreen,
      icon: SearchIcon,
      title: "Procurar",
    },
    {
      name: "Events",
      component: Events,
      icon: TicketsIcon,
      title: "Eventos",
    },
    {
      name: "Chats",
      component: Chats,
      icon: MessageCircle,
      title: "Chats",
    },
    {
      name: "Profile",
      component: Profile,
      icon: CircleUserRound,
      title: "Perfil",
    },
    ...(isDebug
      ? [
        {
          name: "Debug",
          component: Debug,
          icon: Bug,
          title: "Depuração (Debug)",
        },
      ]
      : []),
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
                    color={Colors.primary}
                  />
                ) : null
              }
            />
          ),
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.borderGray,
          tabBarStyle: {
            backgroundColor: Colors.background,
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
                className={`p-1 mb-1 rounded-xl ${focused ? "bg-[#03382D]" : "bg-transparent"}`}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  backgroundColor: focused
                    ? Colors.backButtonActive
                    : "transparent",
                }}
              >
                <Icon
                  color={color}
                  size={size}
                  fill={focused ? `${Colors.primary}75` : "none"}
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
