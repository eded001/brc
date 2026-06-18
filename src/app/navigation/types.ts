import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Introduction: undefined;
    AppTabs: undefined;
    Settings: undefined;
    Firebase: undefined;
    RBAC: undefined;
    Invite: undefined;
    PrivateChat: { chatId: string; otherUserId: string };
    Welcome: undefined;
    Register: undefined;
    Auth: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type PrivateChatScreenProps = NativeStackScreenProps<RootStackParamList, "PrivateChat">;
