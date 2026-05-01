import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        async function loadUser() {
            try {
                const currentUser = auth().currentUser;

                if (!currentUser) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Auth' }],
                    });
                    return;
                }

                const doc = await firestore()
                    .collection('users')
                    .doc(currentUser.uid)
                    .get();

                if (!doc.exists) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Auth' }],
                    });
                    return;
                }

                setUserData({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    ...doc.data(),
                });

            } catch (err) {
                console.log('[PROFILE] erro', err);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    async function logout() {
        await auth().signOut();

        navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
        });
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!userData) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-gray-500">Usuário não encontrado</Text>
            </View>
        );
    }

    const isAdmin = userData.role === 'admin';
    const isSupport = userData.role === 'support';
    const isUser = userData.role === 'user';

    const roleColor =
        isAdmin ? 'text-red-500' :
            isSupport ? 'text-orange-500' :
                'text-green-600';

    return (
        <View className="flex-1 bg-white px-6 pt-10">

            {/* Header */}
            <Text className="text-2xl font-bold text-gray-900">
                Perfil do Usuário
            </Text>

            <View className="mt-6 space-y-2">

                <Text className="text-gray-700">
                    <Text className="font-semibold">UID:</Text> {userData.uid}
                </Text>

                <Text className="text-gray-700">
                    <Text className="font-semibold">Email:</Text> {userData.email}
                </Text>

                <Text className="text-gray-700">
                    <Text className="font-semibold">Username:</Text> {userData.username}
                </Text>
            </View>

            {/* RBAC Card */}
            <View className="mt-8 p-4 rounded-2xl border border-gray-200 bg-gray-50">

                <Text className="text-lg font-semibold text-gray-900">
                    RBAC Status
                </Text>

                <Text className={`mt-2 font-medium ${roleColor}`}>
                    Role atual: {userData.role}
                </Text>

                {isAdmin && (
                    <Text className="mt-2 text-red-500 font-medium">
                        Acesso: ADMIN (full control)
                    </Text>
                )}

                {isSupport && (
                    <Text className="mt-2 text-orange-500 font-medium">
                        Acesso: SUPPORT (moderation level)
                    </Text>
                )}

                {isUser && (
                    <Text className="mt-2 text-green-600 font-medium">
                        Acesso: USER (restricted)
                    </Text>
                )}
            </View>

            {/* Logout */}
            <Pressable
                onPress={logout}
                className="mt-10 bg-black py-3 rounded-xl"
            >
                <Text className="text-white text-center font-semibold">
                    Sair
                </Text>
            </Pressable>

        </View>
    );
}