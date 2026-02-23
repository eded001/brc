import React from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import RootStack from '@navigation/RootStack';
import { usePushNotifications } from '@debug/hooks/usePushNotifications';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

async function getOrCreateDeviceId(): Promise<string> {
  const stored = await AsyncStorage.getItem('@device_id');
  if (stored) return stored;

  const newId = uuid.v4().toString();
  await AsyncStorage.setItem('@device_id', newId);
  return newId;
}

function AppContent() {
  const navigation = useNavigation();

  usePushNotifications(
    async (token) => {
      const deviceId = await getOrCreateDeviceId();

      await firestore()
        .collection('devices')
        .doc(deviceId)
        .set({ fcmToken: token, platform: Platform.OS }, { merge: true });
    },
    (screen, params) => {
      navigation.navigate(screen as never, params as never);
    },
  );

  return <RootStack />;
}

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </NavigationContainer>
  );
}