import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    TextInput,
    StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { GoToScreen } from "@/components/go-to-screen";

// ─── Utils ─────────────────────────

function generateChatId(userA, userB) {
    return [userA, userB].sort().join("_");
}

// ─── Avatar ─────────────────────────

const AVATAR_COLORS = [
    'bg-primary', 'bg-bright', 'bg-info', 'bg-warning', 'bg-success', 'bg-danger'
];

function avatarColorFor(uid) {
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
        hash = uid.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(id) {
    return id.slice(0, 2).toUpperCase();
}

const Avatar = ({ uid }) => {
    const color = avatarColorFor(uid);
    return (
        <View className={`w-9 h-9 ${color} rounded-full items-center justify-center`}>
            <Text className="text-bg text-xs font-bold">
                {initials(uid)}
            </Text>
        </View>
    );
};

// ─── Tela ─────────────────────────

export default function InviteScreen() {
    const navigation = useNavigation();

    const [userId, setUserId] = useState(null);
    const [pendingInvites, setPendingInvites] = useState([]);
    const [historyInvites, setHistoryInvites] = useState([]);
    const [targetUserId, setTargetUserId] = useState("");

    // 🔐 Auth
    useEffect(() => {
        const unsub = auth().onAuthStateChanged(user => {
            console.log("🔐 [AUTH] Usuário:", user?.uid);
            setUserId(user?.uid || null);
        });
        return unsub;
    }, []);

    // 📥 Pendentes
    useEffect(() => {
        if (!userId) return;

        console.log("📡 [PENDING] Iniciando listener...");

        const unsub = firestore()
            .collection("invites")
            .where("toUserId", "==", userId)
            .where("status", "==", "pending")
            .onSnapshot(snap => {
                const data = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                console.log("📥 [PENDING] Recebidos:", data.length);
                setPendingInvites(data);
            }, err => {
                console.log("❌ [PENDING ERROR]:", err);
            });

        return unsub;
    }, [userId]);

    // 📜 Histórico
    useEffect(() => {
        if (!userId) return;

        console.log("📡 [HISTORY] Iniciando listener...");

        const unsub = firestore()
            .collection("invites")
            .where("toUserId", "==", userId)
            .where("status", "in", ["accepted", "rejected"])
            .onSnapshot(snap => {
                const data = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                console.log("📜 [HISTORY] Recebidos:", data.length);
                setHistoryInvites(data);
            }, err => {
                console.log("❌ [HISTORY ERROR]:", err);
            });

        return unsub;
    }, [userId]);

    // 📤 Enviar
    async function sendInvite() {
        if (!targetUserId || !userId) {
            console.log("⚠️ [SEND] Dados inválidos:", { targetUserId, userId });
            return;
        }

        console.log("📤 [SEND] Enviando convite:", {
            from: userId,
            to: targetUserId
        });

        try {
            await firestore().collection("invites").add({
                fromUserId: userId,
                toUserId: targetUserId,
                status: "pending",
                createdAt: firestore.FieldValue.serverTimestamp(),
                updatedAt: firestore.FieldValue.serverTimestamp()
            });

            console.log("✅ [SEND] Convite enviado");
            setTargetUserId("");
        } catch (err) {
            console.log("❌ [SEND ERROR]:", err);
        }
    }

    // ✅ Aceitar
    async function acceptInvite(invite) {
        console.log("✅ [ACCEPT] Convite:", invite);

        try {
            const batch = firestore().batch();

            const chatId = generateChatId(invite.fromUserId, invite.toUserId);

            batch.update(
                firestore().collection("invites").doc(invite.id),
                {
                    status: "accepted",
                    updatedAt: firestore.FieldValue.serverTimestamp()
                }
            );

            batch.set(
                firestore().collection("connections").doc(),
                {
                    users: [invite.fromUserId, invite.toUserId],
                    createdAt: firestore.FieldValue.serverTimestamp()
                }
            );

            batch.set(
                firestore().collection("chats").doc(chatId),
                {
                    users: [invite.fromUserId, invite.toUserId],
                    createdAt: firestore.FieldValue.serverTimestamp()
                }
            );

            await batch.commit();

            console.log("🚀 [ACCEPT] Chat criado:", chatId);

        } catch (err) {
            console.log("❌ [ACCEPT ERROR]:", err);
        }
    }

    // ❌ Rejeitar
    async function rejectInvite(id) {
        console.log("❌ [REJECT] ID:", id);

        try {
            await firestore().collection("invites").doc(id).update({
                status: "rejected",
                updatedAt: firestore.FieldValue.serverTimestamp()
            });

            console.log("🚫 [REJECT] Atualizado");
        } catch (err) {
            console.log("❌ [REJECT ERROR]:", err);
        }
    }

    // 💬 Abrir chat
    function openChat(item) {
        if (!userId) {
            console.log("⚠️ [CHAT] userId não encontrado");
            return;
        }

        const otherUserId =
            item.fromUserId === userId
                ? item.toUserId
                : item.fromUserId;

        const chatId = generateChatId(userId, otherUserId);

        console.log("💬 [NAVIGATE]", {
            chatId,
            otherUserId,
            item
        });

        navigation.getParent()?.navigate("PrivateChat", {
            chatId,
            otherUserId
        });
    }

    // ─── UI ─────────────────────────

    function PendingItem({ item }) {
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
                        onPress={() => acceptInvite(item)}
                        className="flex-1 bg-primary py-2.5 rounded-xl items-center"
                    >
                        <Text className="text-bg font-bold">Aceitar</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => rejectInvite(item.id)}
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
                        params={{ chatId, otherUserId }} // 🔥 aqui está o segredo
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
                    <TextInput
                        className="flex-1 bg-surface border border-borderSub rounded-xl px-4 py-2.5 text-whiteSoft"
                        placeholder="ID do usuário..."
                        placeholderTextColor="#3A6654"
                        value={targetUserId}
                        onChangeText={setTargetUserId}
                    />

                    <Pressable
                        onPress={sendInvite}
                        className="bg-primary px-4 rounded-xl items-center justify-center"
                    >
                        <Text className="text-bg font-bold">Enviar</Text>
                    </Pressable>
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
                        return <PendingItem item={item} />;
                    }

                    return <HistoryItem item={item} />;
                }}
            />
        </SafeAreaView>
    );
}