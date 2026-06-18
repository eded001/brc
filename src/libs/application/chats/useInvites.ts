import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Logger } from '../../infrastructure/logger/Logger';

function generateChatId(userA: string, userB: string) {
    return [userA, userB].sort().join("_");
}

export interface InviteData {
    id: string;
    fromUserId: string;
    toUserId: string;
    status: "pending" | "accepted" | "rejected";
    createdAt?: any;
    updatedAt?: any;
}

export function useInvites() {
    const [userId, setUserId] = useState<string | null>(null);
    const [pendingInvites, setPendingInvites] = useState<InviteData[]>([]);
    const [historyInvites, setHistoryInvites] = useState<InviteData[]>([]);

    useEffect(() => {
        const unsub = auth().onAuthStateChanged(user => {
            setUserId(user?.uid || null);
        });
        return unsub;
    }, []);

    useEffect(() => {
        if (!userId) return;

        const unsub = firestore()
            .collection("invites")
            .where("toUserId", "==", userId)
            .where("status", "==", "pending")
            .onSnapshot(snap => {
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPendingInvites(data);
            }, err => {
                Logger.error('useInvites', 'Falha ao buscar convites pendentes', err);
            });

        return unsub;
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        const unsub = firestore()
            .collection("invites")
            .where("toUserId", "==", userId)
            .where("status", "in", ["accepted", "rejected"])
            .onSnapshot(snap => {
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setHistoryInvites(data);
            }, err => {
                Logger.error('useInvites', 'Falha ao buscar histórico de convites', err);
            });

        return unsub;
    }, [userId]);

    async function sendInvite(targetUserId: string) {
        if (!targetUserId || !userId) return false;

        try {
            await firestore().collection("invites").add({
                fromUserId: userId,
                toUserId: targetUserId,
                status: "pending",
                createdAt: firestore.FieldValue.serverTimestamp(),
                updatedAt: firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (err) {
            Logger.error('useInvites', 'Erro ao enviar convite', err);
            Alert.alert('Ops', 'Não foi possível enviar o convite. Tente novamente mais tarde.');
            return false;
        }
    }

    async function acceptInvite(invite: InviteData) {
        try {
            const batch = firestore().batch();
            const chatId = generateChatId(invite.fromUserId, invite.toUserId);

            batch.update(firestore().collection("invites").doc(invite.id), {
                status: "accepted",
                updatedAt: firestore.FieldValue.serverTimestamp()
            });

            batch.set(firestore().collection("connections").doc(), {
                users: [invite.fromUserId, invite.toUserId],
                createdAt: firestore.FieldValue.serverTimestamp()
            });

            batch.set(firestore().collection("chats").doc(chatId), {
                users: [invite.fromUserId, invite.toUserId],
                createdAt: firestore.FieldValue.serverTimestamp()
            });

            await batch.commit();
        } catch (err) {
            Logger.error('useInvites', 'Erro ao aceitar convite', err);
            Alert.alert('Erro', 'Não foi possível aceitar o convite.');
        }
    }

    async function rejectInvite(id: string) {
        try {
            await firestore().collection("invites").doc(id).update({
                status: "rejected",
                updatedAt: firestore.FieldValue.serverTimestamp()
            });
        } catch (err) {
            Logger.error('useInvites', 'Erro ao recusar convite', err);
            Alert.alert('Erro', 'Não foi possível recusar o convite.');
        }
    }

    return {
        userId,
        pendingInvites,
        historyInvites,
        sendInvite,
        acceptInvite,
        rejectInvite
    };
}
