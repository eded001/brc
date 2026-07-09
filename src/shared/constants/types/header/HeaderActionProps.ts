import { RootStackParamList } from "@navigation/types";

export type HeaderActionProps = {
    screen: keyof RootStackParamList;
    icon: React.ComponentType<{ size?: number; color?: string }>;
    size?: number;
    color?: string;
};