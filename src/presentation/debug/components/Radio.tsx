import { Pressable, Text, View } from "react-native";

export function RadioOption({ label, selected, onPress }: {
    label: string;
    selected: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            className={`flex-row items-center gap-3 p-3 rounded-xl border ${selected
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-zinc-700 bg-zinc-900"
                }`}
        >
            <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center ${selected ? "border-emerald-500" : "border-zinc-500"
                    }`}
            >
                {selected && (
                    <View className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                )}
            </View>

            <Text
                className={`${selected ? "text-emerald-400 font-semibold" : "text-zinc-300"
                    }`}
            >
                {label}
            </Text>
        </Pressable>
    );
}