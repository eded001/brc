import React, { useState } from 'react';
import { Alert, View, Text, TextInput, Pressable } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    async function signInWithEmail() {
        setLoading(true);

        try {
            await auth().signInWithEmailAndPassword(email, password);

            navigation.reset({
                index: 0,
                routes: [{ name: 'AppTabs' }],
            });

        } catch (error) {
            Alert.alert(error.message);
        }

        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);

        try {
            const userCredential = await auth().createUserWithEmailAndPassword(
                email,
                password
            );

            const uid = userCredential.user.uid;

            await firestore()
                .collection('users')
                .doc(uid)
                .set({
                    uid,
                    username: name,
                    email,
                    role: 'user',
                    createdAt: firestore.FieldValue.serverTimestamp()
                });

            navigation.reset({
                index: 0,
                routes: [{ name: 'AppTabs' }],
            });

        } catch (error) {
            Alert.alert(error.message);
        }

        setLoading(false);
    }

    return (
        <View className="flex-1 bg-zinc-950 justify-center px-5">
            <View className="bg-zinc-900 rounded-2xl p-6 shadow-lg">
                <Text className="text-2xl font-semibold text-zinc-50 mb-1">
                    Welcome
                </Text>
                <Text className="text-sm text-zinc-400 mb-6">
                    Sign in or create your account
                </Text>

                <View className="mb-4">
                    <Text className="text-xs text-zinc-300 mb-1">Username</Text>
                    <TextInput
                        value={name}
                        onChangeText={text => setName(text)}
                        placeholder="john_doe"
                        placeholderTextColor="#71717A"
                        autoCapitalize="none"
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-50"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-xs text-zinc-300 mb-1">Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={text => setEmail(text)}
                        placeholder="email@address.com"
                        placeholderTextColor="#71717A"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-50"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-xs text-zinc-300 mb-1">Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={text => setPassword(text)}
                        placeholder="Password"
                        placeholderTextColor="#71717A"
                        secureTextEntry
                        autoCapitalize="none"
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-50"
                    />
                </View>

                <Pressable
                    onPress={signInWithEmail}
                    disabled={loading}
                    className={`rounded-lg py-3 items-center ${loading ? 'bg-emerald-700/60' : 'bg-emerald-600'
                        }`}
                >
                    <Text className="text-emerald-950 font-semibold">
                        {loading ? 'Signing in…' : 'Sign in'}
                    </Text>
                </Pressable>

                <Pressable
                    onPress={signUpWithEmail}
                    disabled={loading}
                    className="mt-3 rounded-lg py-3 items-center border border-zinc-700"
                >
                    <Text className="text-zinc-200 font-medium">
                        Create account
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}