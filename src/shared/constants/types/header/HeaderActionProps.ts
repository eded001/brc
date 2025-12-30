import { RootStackProps } from "@navigation/types/rootStack/RootStackProps";

export type HeaderActionProps = {
    screen: keyof RootStackProps;
    icon: React.ComponentType<{ size?: number; color?: string }>;
    size?: number;
    color?: string;
};