import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken, onMessage, onTokenRefresh, onNotificationOpenedApp, getInitialNotification, requestPermission, registerDeviceForRemoteMessages, FirebaseMessagingTypes, AuthorizationStatus } from '@react-native-firebase/messaging';

import notifee, {
    AndroidImportance,
    AndroidVisibility,
    EventType,
} from '@notifee/react-native';


// Cria canal Android
async function createAndroidChannel() {
    await notifee.createChannel({
        id: 'default',
        name: 'Notificações',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        vibration: true,
        sound: 'default',
    });
}


// Notificação local
async function displayLocalNotification(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) {
    const { title, body } = remoteMessage.notification ?? {};
    const data = remoteMessage.data ?? {};

    await notifee.displayNotification({
        title: title ?? 'Nova mensagem',
        body: body ?? '',
        data,
        android: {
            channelId: 'default',
            smallIcon: 'ic_notification',
            pressAction: { id: 'default' },
            badgeCount: 1,
        },
        ios: {
            sound: 'default',
            badge: 1,
        },
    });
}


// Permissão + Token
async function requestPermissionAndGetToken(messaging: any) {
    // iOS
    if (Platform.OS === 'ios') {
        const authStatus = await requestPermission(messaging);
        const allowed =
            authStatus === AuthorizationStatus.AUTHORIZED ||
            authStatus === AuthorizationStatus.PROVISIONAL;

        if (!allowed) return null;

        await registerDeviceForRemoteMessages(messaging);
    }

    // Android 13+
    if (Platform.OS === 'android') {
        await notifee.requestPermission();
    }

    return await getToken(messaging);
}


// Navegação
type NavigationHandler = (screen: string, params?: object) => void;

function handleNotificationPress(
    data: Record<string, string>,
    navigate: NavigationHandler,
) {
    if (data?.screen) {
        navigate(
            data.screen,
            data.params ? JSON.parse(data.params) : undefined
        );
    }
}


// Hook
export function usePushNotifications(
    onTokenReceived: (token: string) => void,
    navigate: NavigationHandler,
) {
    const tokenRef = useRef<string | null>(null);

    useEffect(() => {
        const app = getApp();
        const messaging = getMessaging(app);

        let unsubscribeForeground: any;
        let unsubscribeToken: any;
        let unsubscribeOpened: any;
        let unsubscribeNotifee: any;

        async function init() {
            await createAndroidChannel();

            const token = await requestPermissionAndGetToken(messaging);
            if (!token) return;

            if (tokenRef.current !== token) {
                tokenRef.current = token;
                onTokenReceived(token);
                console.log('[FCM] Token:', token);
            }

            // TOKEN REFRESH
            unsubscribeToken = onTokenRefresh(messaging, newToken => {
                tokenRef.current = newToken;
                onTokenReceived(newToken);
            });

            // FOREGROUND
            unsubscribeForeground = onMessage(messaging, async remoteMessage => {
                console.log('[FCM] Foreground:', remoteMessage);
                await displayLocalNotification(remoteMessage);
            });

            // BACKGROUND TAP
            unsubscribeOpened = onNotificationOpenedApp(
                messaging,
                remoteMessage => {
                    handleNotificationPress(
                        remoteMessage.data as Record<string, string>,
                        navigate
                    );
                }
            );

            // QUIT STATE
            const initialMessage = await getInitialNotification(messaging);
            if (initialMessage) {
                setTimeout(() => {
                    handleNotificationPress(
                        initialMessage.data as Record<string, string>,
                        navigate
                    );
                }, 500);
            }

            // NOTIFEE
            unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
                if (type === EventType.PRESS) {
                    handleNotificationPress(
                        detail.notification?.data as Record<string, string>,
                        navigate
                    );
                }
            });
        }

        init();

        return () => {
            unsubscribeForeground?.();
            unsubscribeToken?.();
            unsubscribeOpened?.();
            unsubscribeNotifee?.();
        };
    }, [onTokenReceived, navigate]);
}