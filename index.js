/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import "./global.css";

import { getApp } from '@react-native-firebase/app';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

import notifee, { EventType } from '@notifee/react-native';

const app = getApp();
const messaging = getMessaging(app);

AppRegistry.registerComponent(appName, () => App);

// FCM background handler
setBackgroundMessageHandler(messaging, async remoteMessage => {
    console.log('[FCM] Background message:', remoteMessage);

    await notifee.displayNotification({
        title: remoteMessage.data?.title,
        body: remoteMessage.data?.body,
        data: remoteMessage.data,
        android: { channelId: 'default', pressAction: { id: 'default' } },
    });
});

// Notifee background event
notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
        console.log('[Notifee] Background press:', detail.notification?.data);
    }
    if (type === EventType.ACTION_PRESS) {
        console.log('[Notifee] Action pressed:', detail.pressAction?.id);
    }
});
