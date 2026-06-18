import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import auth from "@react-native-firebase/auth";
import { useInvites } from "@libs/application/chats/useInvites";

import { GoToScreen } from "@/components/go-to-screen";
import { Avatar } from "../../../shared/components/avatar/Avatar";
import { Input } from "../../../shared/components/input/Input";
import { Button } from "../../../shared/components/button/Button";

// ─── Utils ─────────────────────────

function generateChatId(userA, userB) {
    return [userA, userB].sort().join("_");
}

// ─── UI Components ──────────────────

function PendingItem({ item, onAccept, onReject }) {
    return (
        <View className="bg-card border border-border rounded-2xl p-4 mb-3 mx-3">
            <View className="flex-row items-center mb-3 gap-2">
                <Avatar uid={item.fromUserId} />
                <Text className="text-whiteSoft font-semibold">
                    {item.fromUserId}
                </Text>
            </View>

            <View className="flex-row gap-2">
                <Pressable
                    onPress={() => onAccept(item)}
                    className="flex-1 bg-primary py-2.5 rounded-xl items-center"
                >
                    <Text className="text-bg font-bold">Aceitar</Text>
                </Pressable>

                <Pressable
                    onPress={() => onReject(item.id)}
                    className="flex-1 bg-surface border border-borderSub py-2.5 rounded-xl items-center"
                >
                    <Text className="text-dim font-semibold">Recusar</Text>
                </Pressable>
            </View>
        </View>
    );
}

function HistoryItem({ item }) {
    const isAccepted = item.status === "accepted";

    const currentUser = auth().currentUser;
    const userId = currentUser?.uid;

    const otherUserId =
        item.fromUserId === userId
            ? item.toUserId
            : item.fromUserId;

    const chatId = generateChatId(userId, otherUserId);

    return (
        <View className="bg-card border border-border rounded-2xl p-4 mb-3 mx-3">
            <Text className="text-whiteSoft">{item.fromUserId}</Text>

            {isAccepted && (
                <GoToScreen
                    screen="PrivateChat"
                    params={{ chatId, otherUserId }}
                    className="bg-primary mt-3 py-2 rounded-xl items-center"
                >
                    <Text className="text-bg font-bold">
                        Conversar
                    </Text>
                </GoToScreen>
            )}
        </View>
    );
}

// ─── Tela ─────────────────────────

export default function InviteScreen() {
    const { pendingInvites, historyInvites, sendInvite, acceptInvite, rejectInvite } = useInvites();
    const [targetUserId, setTargetUserId] = useState("");

    async function handleSendInvite() {
        const success = await sendInvite(targetUserId);
        if (success) {
            setTargetUserId("");
        }
    }



    return (
        <SafeAreaView className="flex-1 bg-bg">
            <StatusBar barStyle="light-content" backgroundColor="#02130A" />

            <View className="px-4 py-3 bg-card border-b border-border">
                <Text className="text-whiteSoft font-bold text-base">
                    Convites
                </Text>
            </View>

            <View className="p-4 border-b border-border bg-card">
                <View className="flex-row gap-2">
                    <Input
                        containerClassName="flex-1 mb-0"
                        placeholder="ID do usuário..."
                        value={targetUserId}
                        onChangeText={setTargetUserId}
                    />

                    <Button
                        title="Enviar"
                        onPress={handleSendInvite}
                        className="px-6 py-1 h-[48px]"
                    />
                </View>
            </View>

            <FlatList
                data={[
                    { type: "pending" },
                    ...pendingInvites,
                    { type: "history" },
                    ...historyInvites
                ]}
                keyExtractor={(item, index) => item.id || item.type + index}
                renderItem={({ item }) => {
                    if (item.type === "pending") {
                        return <Text className="text-muted text-xs px-4 mt-4 mb-2">Pendentes</Text>;
                    }

                    if (item.type === "history") {
                        return <Text className="text-muted text-xs px-4 mt-4 mb-2">Histórico</Text>;
                    }

                    if (item.status === "pending") {
                        return <PendingItem item={item} onAccept={acceptInvite} onReject={rejectInvite} />;
                    }

                    return <HistoryItem item={item} />;
                }}
            />
        </SafeAreaView>
    );
}