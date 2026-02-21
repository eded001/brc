import React, { useState } from "react";
import {    Text,    View,    ActivityIndicator,    Pressable,    ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import firestore from "@react-native-firebase/firestore";
import NetInfo from "@react-native-community/netinfo";
import DeviceInfo from "react-native-device-info";
import { Platform } from "react-native";
import { CircleCheck, CircleX, WifiOff } from "lucide-react-native";

interface DeviceData {
    deviceId: string;
    latency: number;
    internetType: string;
    platform: string;
    timestamp: string;
}

export default function Firebase() {
    const [data, setData] = useState<DeviceData | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [offline, setOffline] = useState(false);

    const [retryAttempt, setRetryAttempt] = useState(0);
    const [retryCountdown, setRetryCountdown] = useState(0);

    const measureLatency = async (): Promise<number> => {
        const start = Date.now();
        await firestore().collection("ping").doc("test").get();
        return Date.now() - start;
    };

    const retryWithBackoff = async (
        fn: () => Promise<any>,
        maxRetries = 5,
        initialDelay = 1000
    ): Promise<any> => {
        let delay = initialDelay;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                setRetryAttempt(attempt);
                return await fn();
            } catch (error) {
                if (attempt === maxRetries) throw error;

                let remaining = delay / 1000;
                setRetryCountdown(remaining);

                await new Promise<void>((resolve) => {
                    const interval = setInterval(() => {
                        remaining -= 1;
                        setRetryCountdown(remaining);

                        if (remaining <= 0) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 1000);
                });

                delay *= 2;
            }
        }

        throw new Error("Retry falhou");
    };

    const collectAndSend = async () => {
        setLoading(true);
        setStatus("idle");
        setRetryAttempt(0);
        setRetryCountdown(0);
        setOffline(false);

        try {
            const netInfo = await NetInfo.fetch();

            if (!netInfo.isConnected) {
                setOffline(true);
                throw new Error("Sem conexão");
            }

            const [deviceId, latency] = await Promise.all([
                DeviceInfo.getUniqueId(),
                measureLatency(),
            ]);

            const payload: DeviceData = {
                deviceId,
                latency,
                internetType: formatInternetType(netInfo.type),
                platform: Platform.OS,
                timestamp: new Date().toISOString(),
            };

            await retryWithBackoff(() =>
                firestore().collection("device_logs").add(payload)
            );

            setData(payload);
            setStatus("success");
        } catch (error) {
            console.error(error);
            setStatus("error");
        } finally {
            setLoading(false);
            setRetryCountdown(0);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text className="text-3xl font-bold text-white mb-6">
                    Firebase Diagnostics
                </Text>

                <View className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-lg">
                    <Pressable
                        onPress={collectAndSend}
                        disabled={loading}
                        className={`rounded-xl py-4 items-center ${
                            loading ? "bg-zinc-700" : "bg-emerald-600"
                        }`}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text className="text-white font-semibold text-lg">
                                Coletar e Enviar Dados
                            </Text>
                        )}
                    </Pressable>

                    {/* Aviso visual de offline */}
                    {offline && (
                        <View className="mt-6 bg-red-950 border border-red-800 rounded-xl p-4 gap-3">
                            <View className="flex-row items-center gap-2">
                                <WifiOff size={20} color="#f87171" />
                                <Text className="text-red-400 font-bold text-lg">
                                    Sem conexão com a internet
                                </Text>
                            </View>

                            <Text className="text-red-300">
                                Verifique sua rede e tente novamente.
                            </Text>

                            <Pressable
                                onPress={collectAndSend}
                                className="bg-red-600 rounded-lg py-2 items-center mt-2"
                            >
                                <Text className="text-white font-semibold">
                                    Tentar novamente
                                </Text>
                            </Pressable>
                        </View>
                    )}

                    {/* UI de retry */}
                    {loading && retryAttempt > 0 && (
                        <View className="mt-6 bg-zinc-800 rounded-xl p-4 gap-2">
                            <Text className="text-yellow-400 font-semibold">
                                Tentativa {retryAttempt} de reconexão
                            </Text>

                            {retryCountdown > 0 && (
                                <>
                                    <Text className="text-zinc-400">
                                        Nova tentativa em {retryCountdown}s
                                    </Text>

                                    <View className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                                        <View
                                            className="h-full bg-yellow-500"
                                            style={{
                                                width: `${
                                                    100 -
                                                    (retryCountdown / 8) * 100
                                                }%`,
                                            }}
                                        />
                                    </View>
                                </>
                            )}
                        </View>
                    )}

                    {status === "success" && data && (
                        <View className="mt-6 gap-3">
                            <View className="flex-row items-center gap-2 mb-2">
                                <CircleCheck size={18} color="#10b981" />
                                <Text className="text-emerald-400 font-bold">
                                    Enviado com sucesso
                                </Text>
                            </View>

                            <View className="bg-zinc-800 rounded-xl p-4 gap-2">
                                <Row label="Device ID" value={data.deviceId} />
                                <Row label="Latência" value={`${data.latency}ms`} />
                                <Row label="Internet" value={data.internetType} />
                                <Row label="Plataforma" value={data.platform} />
                                <Row label="Timestamp" value={data.timestamp} />
                            </View>
                        </View>
                    )}

                    {status === "error" && !offline && (
                        <View className="mt-6 flex-row items-center gap-2">
                            <CircleX size={18} color="#ef4444" />
                            <Text className="text-red-400 font-medium">
                                Erro ao enviar dados
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <View className="flex-row justify-between border-b border-zinc-700 pb-1">
            <Text className="text-zinc-400">{label}</Text>
            <Text
                className="text-white font-medium ml-4 flex-1 text-right"
                numberOfLines={1}
            >
                {value}
            </Text>
        </View>
    );
}