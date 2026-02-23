import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, StatusBar, Text, TextInput, View, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Message = {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    createdAt: FirebaseFirestoreTypes.Timestamp | null;
};

type CurrentUser = {
    uid: string;
    name: string;
};

// ─── Constantes ───────────────────────────────────────────────────────────────

const CHAT_ID = 'sala-geral';
const STORAGE_KEY_UID = '@chat:uid';
const STORAGE_KEY_NAME = '@chat:name';

// Gera uma cor de avatar determinística a partir do uid
const AVATAR_COLORS = [
    'bg-primary',
    'bg-bright',
    'bg-info',
    'bg-warning',
    'bg-success',
    'bg-danger',
];

function avatarColorFor(uid: string): string {
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
        hash = uid.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string): string {
    return name
        .trim()
        .split(' ')
        .slice(0, 2)
        .map(w => w[0]?.toUpperCase() ?? '')
        .join('');
}

// ─── Componente: Avatar ───────────────────────────────────────────────────────

const Avatar = ({
    name,
    uid,
    size = 'sm',
}: {
    name: string;
    uid: string;
    size?: 'sm' | 'md';
}) => {
    const color = avatarColorFor(uid);
    const dim = size === 'md' ? 'w-10 h-10' : 'w-7 h-7';
    const font = size === 'md' ? 'text-sm font-bold' : 'text-xs font-bold';

    return (
        <View
            className={`${dim} ${color} rounded-full items-center justify-center`}
        >
            <Text className="text-bg">{initials(name)}</Text>
        </View>
    );
};

// ─── Componente: Bolha de mensagem ────────────────────────────────────────────

const MessageBubble = React.memo(
    ({ message, currentUid }: { message: Message; currentUid: string }) => {
        const isOwn = message.senderId === currentUid;

        const timeLabel = message.createdAt
            ? message.createdAt.toDate().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            })
            : '';

        return (
            <View
                className={`mb-3 mx-3 max-w-[80%] ${isOwn ? 'self-end' : 'self-start'
                    }`}
            >
                {/* Cabeçalho: avatar + nome (mensagens alheias) */}
                {!isOwn && (
                    <View className="flex-row items-center mb-1 ml-1 gap-1.5">
                        <Avatar name={message.senderName} uid={message.senderId} size="sm" />
                        <Text className="text-xs text-muted font-semibold">
                            {message.senderName}
                        </Text>
                    </View>
                )}

                {/* Bolha */}
                <View
                    className={`rounded-2xl px-4 py-2.5 ${isOwn
                        ? 'bg-primary rounded-tr-sm'
                        : 'bg-card border border-border rounded-tl-sm'
                        }`}
                >
                    <Text
                        className={`text-[15px] leading-5 ${isOwn ? 'text-bg font-medium' : 'text-whiteSoft'
                            }`}
                        selectable
                    >
                        {message.text}
                    </Text>
                </View>

                {/* Horário */}
                <Text
                    className={`text-[11px] text-dim mt-1 ${isOwn ? 'text-right mr-1' : 'ml-1'}`}
                >
                    {timeLabel}
                </Text>
            </View>
        );
    },
);

// ─── Componente: Modal de nome ─────────────────────────────────────────────────

const NameModal = ({
    visible,
    onConfirm,
}: {
    visible: boolean;
    onConfirm: (name: string) => void;
}) => {
    const [value, setValue] = useState('');

    const handleConfirm = () => {
        const trimmed = value.trim();
        if (trimmed.length < 2) return;
        onConfirm(trimmed);
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-overlay items-center justify-center px-8">
                <View className="w-full bg-card border border-border rounded-3xl p-6">
                    {/* Ícone */}
                    <View className="w-14 h-14 rounded-full bg-surface border border-primary items-center justify-center self-center mb-4">
                        <Text className="text-2xl">👤</Text>
                    </View>

                    <Text className="text-whiteSoft text-lg font-bold text-center mb-1">
                        Como quer ser chamado?
                    </Text>
                    <Text className="text-muted text-sm text-center mb-5">
                        Seu nome aparecerá nas mensagens enviadas.
                    </Text>

                    <TextInput
                        className="bg-surface border border-borderSub rounded-xl px-4 py-3 text-whiteSoft text-[15px] mb-4"
                        placeholder="Seu nome..."
                        placeholderTextColor="#3A6654"
                        value={value}
                        onChangeText={setValue}
                        maxLength={32}
                        autoFocus
                        onSubmitEditing={handleConfirm}
                    />

                    <Pressable
                        onPress={handleConfirm}
                        disabled={value.trim().length < 2}
                        className={`rounded-xl py-3 items-center ${value.trim().length >= 2 ? 'bg-primary' : 'bg-surface'
                            }`}
                    >
                        <Text
                            className={`font-bold text-base ${value.trim().length >= 2 ? 'text-bg' : 'text-dim'
                                }`}
                        >
                            Entrar no chat
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

// ─── Componente: Indicador de envio ──────────────────────────────────────────

const SendingIndicator = () => (
    <View className="flex-row items-center px-5 pb-2">
        <View className="w-1.5 h-1.5 rounded-full bg-primary opacity-80 mr-1" />
        <View className="w-1.5 h-1.5 rounded-full bg-primary opacity-50 mr-1" />
        <View className="w-1.5 h-1.5 rounded-full bg-primary opacity-25" />
    </View>
);

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function ChatScreen() {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [showNameModal, setShowNameModal] = useState(false);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);

    const listRef = useRef<FlatList>(null);

    // ── Carregar ou criar usuário ──────────────────────────────────────────────

    useEffect(() => {
        (async () => {
            try {
                const [storedUid, storedName] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEY_UID),
                    AsyncStorage.getItem(STORAGE_KEY_NAME),
                ]);

                if (storedUid && storedName) {
                    setCurrentUser({ uid: storedUid, name: storedName });
                } else {
                    setShowNameModal(true);
                }
            } catch {
                setShowNameModal(true);
            } finally {
                setLoadingUser(false);
            }
        })();
    }, []);

    const handleNameConfirm = useCallback(async (name: string) => {
        const uid = uuid.v4() as string;
        await Promise.all([
            AsyncStorage.setItem(STORAGE_KEY_UID, uid),
            AsyncStorage.setItem(STORAGE_KEY_NAME, name),
        ]);
        setCurrentUser({ uid, name });
        setShowNameModal(false);
    }, []);

    // ── Listener Firestore ─────────────────────────────────────────────────────

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = firestore()
            .collection('chats')
            .doc(CHAT_ID)
            .collection('messages')
            .orderBy('createdAt', 'asc')
            .onSnapshot(
                snapshot => {
                    const msgs: Message[] = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...(doc.data() as Omit<Message, 'id'>),
                    }));
                    setMessages(msgs);
                },
                error => console.error('Firestore error:', error),
            );

        return unsubscribe;
    }, [currentUser]);

    // Auto-scroll
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages.length]);

    // ── Enviar mensagem ───────────────────────────────────────────────────────

    const sendMessage = useCallback(async () => {
        if (!currentUser) return;
        const text = inputText.trim();
        if (!text || sending) return;

        setInputText('');
        setSending(true);

        try {
            await firestore()
                .collection('chats')
                .doc(CHAT_ID)
                .collection('messages')
                .add({
                    text,
                    senderId: currentUser.uid,
                    senderName: currentUser.name,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
        } catch (error) {
            console.error('Erro ao enviar:', error);
            setInputText(text);
        } finally {
            setSending(false);
        }
    }, [currentUser, inputText, sending]);

    // ── Render ────────────────────────────────────────────────────────────────

    const renderItem = useCallback(
        ({ item }: { item: Message }) =>
            currentUser ? (
                <MessageBubble message={item} currentUid={currentUser.uid} />
            ) : null,
        [currentUser],
    );

    const keyExtractor = useCallback((item: Message) => item.id, []);

    const hasText = !!inputText.trim();

    if (loadingUser) {
        return (
            <SafeAreaView className="flex-1 bg-bg items-center justify-center">
                <ActivityIndicator color="#00B37E" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-bg">
            <StatusBar barStyle="light-content" backgroundColor="#02130A" />

            {/* Modal de escolha de nome */}
            <NameModal visible={showNameModal} onConfirm={handleNameConfirm} />

            {/* ── Header ──────────────────────────────────────── */}
            <View className="flex-row items-center px-4 py-3 bg-card border-b border-border">
                <View className="w-10 h-10 rounded-full bg-surface border-2 border-primary items-center justify-center mr-3">
                    <Text className="text-primary font-bold text-sm">SG</Text>
                </View>

                <View className="flex-1">
                    <Text className="text-whiteSoft font-bold text-base tracking-wide">
                        Sala Geral
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                        <View className="w-2 h-2 rounded-full bg-bright mr-1.5" />
                        <Text className="text-muted text-xs">Chat em tempo real</Text>
                    </View>
                </View>

                {/* Avatar do usuário atual */}
                {currentUser && (
                    <View className="flex-row items-center gap-2">
                        <Text className="text-dim text-xs">{currentUser.name}</Text>
                        <Avatar name={currentUser.name} uid={currentUser.uid} size="md" />
                    </View>
                )}
            </View>

            {/* ── Mensagens + Input ────────────────────────────── */}
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <FlatList
                    ref={listRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="items-center justify-center mt-24 px-8">
                            <View className="w-16 h-16 rounded-full bg-surface border border-border items-center justify-center mb-4">
                                <Text className="text-3xl">💬</Text>
                            </View>
                            <Text className="text-whiteSoft text-base font-bold text-center">
                                Nenhuma mensagem ainda
                            </Text>
                            <Text className="text-muted text-sm text-center mt-1 leading-5">
                                Seja o primeiro a iniciar a conversa!
                            </Text>
                        </View>
                    }
                />

                {sending && <SendingIndicator />}

                {/* ── Input bar ───────────────────────────────── */}
                <View className="flex-row items-end px-3 py-2.5 bg-card border-t border-border gap-2">
                    <TextInput
                        className="flex-1 bg-surface text-whiteSoft rounded-2xl px-4 py-2.5 min-h-[44px] max-h-28 text-[15px] border border-borderSub"
                        placeholder="Digite uma mensagem..."
                        placeholderTextColor="#3A6654"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        onSubmitEditing={sendMessage}
                        blurOnSubmit={false}
                    />

                    <Pressable
                        onPress={sendMessage}
                        disabled={!hasText || sending}
                        className={`w-11 h-11 rounded-full items-center justify-center ${hasText && !sending
                            ? 'bg-primary'
                            : 'bg-surface border border-borderSub'
                            }`}
                    >
                        <Text
                            className={`text-lg leading-none font-black ${hasText && !sending ? 'text-bg' : 'text-dim'
                                }`}
                        >
                            ↑
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}