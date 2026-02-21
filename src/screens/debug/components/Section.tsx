import { Text, View } from "react-native";

export function Section({ title, children }: {
    number: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <View className="mb-8 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
            <Text className="text-white font-semibold text-lg mb-4">
                {title}
            </Text>

            {children}
        </View>
    );
}