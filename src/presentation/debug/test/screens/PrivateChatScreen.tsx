import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// ─── Avatar (mesma base visual) ─────────────────────────

const AVATAR_COLORS = [
  'bg-primary',
  'bg-bright',
  'bg-info',
  'bg-warning',
  'bg-success',
  'bg-danger',
];

function avatarColorFor(uid) {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const Avatar = ({ uid }) => {
  const color = avatarColorFor(uid);
  return (
    <View
      className={`w-8 h-8 ${color} rounded-full items-center justify-center`}
    >
      <Text className="text-bg text-xs font-bold">
        {uid?.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
};

// ─── Bubble ───────────────────────────────────────────

const MessageBubble = ({ item, isOwn }) => {
  return (
    <View
      className={`mx-3 mb-3 max-w-[75%] ${isOwn ? 'self-end' : 'self-start'}`}
    >
      {!isOwn && (
        <View className="flex-row items-center mb-1 gap-1">
          <Avatar uid={item.senderId} />
          <Text className="text-xs text-muted">{item.senderId}</Text>
        </View>
      )}

      <View
        className={`px-4 py-2.5 rounded-2xl ${
          isOwn
            ? 'bg-primary rounded-tr-sm'
            : 'bg-card border border-border rounded-tl-sm'
        }`}
      >
        <Text className={isOwn ? 'text-bg' : 'text-whiteSoft'}>
          {item.text}
        </Text>
      </View>
    </View>
  );
};

// helper simples
const log = (...args) => console.log('[PrivateChat]', ...args);
const error = (...args) => console.error('[PrivateChat][ERROR]', ...args);

// ─── Tela ─────────────────────────────────────────────

export default function PrivateChatScreen({ route, navigation }) {
  const chatId = route?.params?.chatId;
  const otherUserId = route?.params?.otherUserId;

  const currentUser = auth().currentUser;
  const userId = currentUser?.uid;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  const listRef = useRef(null);

  // 🔍 INIT LOG
  useEffect(() => {
    log('Tela iniciada');
    log('chatId:', chatId);
    log('otherUserId:', otherUserId);
    log('userId:', userId);
  }, []);

  if (!chatId) {
    error('chatId ausente!');
    return (
      <SafeAreaView className="flex-1 bg-bg items-center justify-center">
        <Text className="text-whiteSoft">
          Erro ao abrir chat (chatId ausente)
        </Text>
      </SafeAreaView>
    );
  }

  // 📡 listener
  useEffect(() => {
    log('Iniciando listener do Firestore...');

    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(
        snapshot => {
          log('Snapshot recebido:', snapshot.size, 'mensagens');

          if (snapshot.empty) {
            log('Nenhuma mensagem encontrada');
          }

          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          log('Primeira mensagem:', data[0]);

          setMessages(data);
          setLoading(false);
        },
        err => {
          error('Erro listener:', err);
        },
      );

    return () => {
      log('Encerrando listener');
      unsubscribe();
    };
  }, [chatId]);

  // auto scroll
  useEffect(() => {
    if (messages.length > 0) {
      log('Auto scroll para o fim:', messages.length);

      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // 📤 enviar
  const sendMessage = useCallback(async () => {
    const text = input.trim();

    log('Tentando enviar mensagem:', text);

    if (!text) {
      log('Mensagem vazia, ignorando envio');
      return;
    }

    if (!userId) {
      error('userId inválido, usuário não autenticado');
      return;
    }

    setInput('');

    const payload = {
      text,
      senderId: userId,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    log('Payload:', payload);

    try {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add(payload);

      log('Mensagem enviada com sucesso');
    } catch (err) {
      error('Erro ao enviar:', err);
      setInput(text);
    }
  }, [input, userId, chatId]);

  // ─── render ─────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <StatusBar barStyle="light-content" backgroundColor="#02130A" />

      {/* HEADER */}
      <View className="flex-row items-center px-4 py-3 bg-card border-b border-border">
        <Avatar uid={otherUserId || '??'} />

        <View className="ml-3 flex-1">
          <Text className="text-whiteSoft font-bold">{otherUserId}</Text>
          <Text className="text-muted text-xs">Conversa privada</Text>
        </View>
      </View>

      {/* MENSAGENS */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#00B37E" />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MessageBubble item={item} isOwn={item.senderId === userId} />
          )}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* INPUT */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-row items-end px-3 py-2.5 bg-card border-t border-border gap-2">
          <TextInput
            className="flex-1 bg-surface text-whiteSoft rounded-2xl px-4 py-2.5 border border-borderSub"
            placeholder="Digite uma mensagem..."
            placeholderTextColor="#3A6654"
            value={input}
            onChangeText={setInput}
            multiline
          />

          <Pressable
            onPress={sendMessage}
            className={`w-11 h-11 rounded-full items-center justify-center ${
              input.trim() ? 'bg-primary' : 'bg-surface border border-borderSub'
            }`}
          >
            <Text className={input.trim() ? 'text-bg font-bold' : 'text-dim'}>
              ↑
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
