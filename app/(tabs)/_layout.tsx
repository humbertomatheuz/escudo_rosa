import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: "#fff", // fundo branco
          borderTopWidth: 0.5,
          borderTopColor: "#eee",
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="doc.text" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="denunciar"
        options={{
          title: "Denunciar",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="exclamationmark.triangle.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="person.fill" // Ícone de pessoa
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
