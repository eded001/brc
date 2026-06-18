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


import auth from '@react-native-firebase/auth';
import { usePrivateChat } from '@libs/application/chats/usePrivateChat';
import { PrivateChatScreenProps } from '../../../../app/navigation/types';
import { Logger } from '../../../libs/infrastructure/logger/Logger';
import { Avatar } from '../../../shared/components/avatar/Avatar';

// ─── Bubble ───────────────────────────────────────────

const MessageBubble = ({ item, isOwn }) => {
  return (
    <View
      className={`mx-3 mb-3 max-w-[75%] ${isOwn ? 'self-end' : 'self-start'}`}
    >
      {!isOwn && (
        <View className="flex-row items-center mb-1 gap-1">
          <Avatar uid={item.senderId} sizeClassName="w-8 h-8" />
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

// ─── Tela ─────────────────────────────────────────────

export default function PrivateChatScreen({ route }: PrivateChatScreenProps) {
  const chatId = route.params.chatId;
  const otherUserId = route.params.otherUserId;

  const currentUser = auth().currentUser;
  const userId = currentUser?.uid;

  const [input, setInput] = useState('');
  const listRef = useRef(null);

  const { messages, loading, sendMessage } = usePrivateChat(chatId, userId);

  // 🔍 INIT LOG
  useEffect(() => {
    Logger.info('PrivateChatScreen', 'Tela iniciada', { chatId, otherUserId, userId });
  }, [chatId, otherUserId, userId]);

  // auto scroll
  useEffect(() => {
    if (messages.length > 0) {
      Logger.info('PrivateChatScreen', 'Auto scroll para o fim', { count: messages.length });

      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // 📤 enviar
  const handleSendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    setInput('');
    const success = await sendMessage(text);
    if (!success) {
      setInput(text);
    }
  }, [input, sendMessage]);

  if (!chatId) {
    Logger.error('PrivateChatScreen', 'chatId ausente!');
    return (
      <SafeAreaView className="flex-1 bg-bg items-center justify-center">
        <Text className="text-whiteSoft">
          Erro ao abrir chat (chatId ausente)
        </Text>
      </SafeAreaView>
    );
  }

  // ─── render ─────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <StatusBar barStyle="light-content" backgroundColor="#02130A" />

      {/* HEADER */}
      <View className="flex-row items-center px-4 py-3 bg-card border-b border-border">
        <Avatar uid={otherUserId || '??'} sizeClassName="w-10 h-10" />

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
          // eslint-disable-next-line react-native/no-inline-styles
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
            onPress={handleSendMessage}
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
