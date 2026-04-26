/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import "./global.css";
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

AppRegistry.registerComponent(appName, () => App);

// FCM background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('[FCM] Background message:', remoteMessage);
    // O FCM já exibe automaticamente se a mensagem tiver "notification" payload
    // Usar isso apenas para mensagens do tipo "data-only"
    await notifee.displayNotification({
        title: remoteMessage.data?.title,
        body: remoteMessage.data?.body,
        data: remoteMessage.data,
        android: { channelId: 'default', pressAction: { id: 'default' } },
    });
});

// Notifee background event (ex: ações de notificação)
notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
        console.log('[Notifee] Background press:', detail.notification?.data);
    }
    if (type === EventType.ACTION_PRESS) {
        const actionId = detail.pressAction?.id;
        console.log('[Notifee] Action pressed:', actionId);
    }
});
