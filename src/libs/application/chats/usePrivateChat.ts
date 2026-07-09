import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Logger } from '../../infrastructure/logger/Logger';

export interface ChatMessage {
    id: string;
    text: string;
    senderId: string;
    createdAt?: any;
}

export function usePrivateChat(chatId: string, userId: string | undefined) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!chatId) return;

        const unsubscribe = firestore()
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .orderBy('createdAt', 'asc')
            .onSnapshot(
                snapshot => {
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
                    setMessages(data);
                    setLoading(false);
                },
                (err) => {
                    Logger.error('usePrivateChat', 'Erro no listener de mensagens', err);
                    setLoading(false);
                }
            );

        return () => unsubscribe();
    }, [chatId]);

    const sendMessage = useCallback(async (text: string) => {
        if (!chatId || !userId || !text) return false;

        const payload = {
            text,
            senderId: userId,
            createdAt: firestore.FieldValue.serverTimestamp(),
        };

        try {
            await firestore()
                .collection('chats')
                .doc(chatId)
                .collection('messages')
                .add(payload);
            return true;
        } catch (err) {
            Logger.error('usePrivateChat', 'Erro ao enviar mensagem', err);
            Alert.alert('Ops', 'Sua mensagem não pôde ser enviada. Verifique sua conexão.');
            return false;
        }
    }, [chatId, userId]);

    return {
        messages,
        loading,
        sendMessage
    };
}
