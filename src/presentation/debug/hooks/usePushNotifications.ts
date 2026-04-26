import { useEffect, useRef } from 'react';
import messaging, {
    FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {
    AndroidImportance,
    AndroidVisibility,
    EventType,
} from '@notifee/react-native';
import { Platform } from 'react-native';

// ─── Cria canal Android uma única vez ────────────────────────────────────────
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

// ─── Exibe notificação local (foreground) ────────────────────────────────────
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
            smallIcon: 'ic_notification', // nome do drawable
            pressAction: { id: 'default' },
            // badge no ícone do app
            badgeCount: 1,
        },
        ios: {
            sound: 'default',
            badge: 1,
        },
    });
}

// ─── Pede permissão e retorna o FCM token ────────────────────────────────────
async function requestPermissionAndGetToken(): Promise<string | null> {
    // iOS: pede permissão
    if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const allowed =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (!allowed) return null;
    }

    // Android 13+: pede permissão POST_NOTIFICATIONS
    if (Platform.OS === 'android') {
        await notifee.requestPermission();
    }

    // Garante que o dispositivo está registrado no APNs (iOS)
    if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
    }

    const token = await messaging().getToken();
    return token;
}

// ─── Handler para quando usuário toca na notificação ─────────────────────────
type NavigationHandler = (screen: string, params?: object) => void;

function handleNotificationPress(
    data: Record<string, string>,
    navigate: NavigationHandler,
) {
    if (data?.screen) {
        navigate(data.screen, data.params ? JSON.parse(data.params) : undefined);
    }
}

// ─── Hook principal ───────────────────────────────────────────────────────────
export function usePushNotifications(
    onTokenReceived: (token: string) => void,
    navigate: NavigationHandler,
) {
    const tokenRef = useRef<string | null>(null);

    useEffect(() => {
        let unsubscribeForeground: (() => void) | undefined;
        let unsubscribeNotifee: (() => void) | undefined;

        async function init() {
            await createAndroidChannel();

            const token = await requestPermissionAndGetToken();
            if (!token) return;

            // Evita reenviar o mesmo token
            if (tokenRef.current !== token) {
                tokenRef.current = token;
                onTokenReceived(token);
                console.log('[FCM] Token:', token);
            }

            // Token renovado (ex: reinstalação, backup restaurado)
            messaging().onTokenRefresh(newToken => {
                tokenRef.current = newToken;
                onTokenReceived(newToken);
            });

            // ── Foreground ──────────────────────────────────────────────────────────
            unsubscribeForeground = messaging().onMessage(async remoteMessage => {
                console.log('[FCM] Foreground:', remoteMessage);
                await displayLocalNotification(remoteMessage);
            });

            // ── Background: usuário tocou na notificação ────────────────────────────
            messaging().onNotificationOpenedApp(remoteMessage => {
                console.log('[FCM] Background tap:', remoteMessage);
                handleNotificationPress(
                    remoteMessage.data as Record<string, string>,
                    navigate,
                );
            });

            // ── Quit state: app foi aberto pela notificação ─────────────────────────
            const initialMessage = await messaging().getInitialNotification();
            if (initialMessage) {
                console.log('[FCM] Quit state tap:', initialMessage);
                // Pequeno delay para garantir que a navegação já está pronta
                setTimeout(() => {
                    handleNotificationPress(
                        initialMessage.data as Record<string, string>,
                        navigate,
                    );
                }, 500);
            }

            // ── Notifee: press em notificações locais ───────────────────────────────
            unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
                if (type === EventType.PRESS) {
                    handleNotificationPress(
                        detail.notification?.data as Record<string, string>,
                        navigate,
                    );
                }
            });
        }

        init();

        return () => {
            unsubscribeForeground?.();
            unsubscribeNotifee?.();
        };
    }, []);
}