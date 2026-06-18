import React, { useState } from 'react';
import { Alert, View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Logger } from '../../../libs/infrastructure/logger/Logger';
import { Input } from '../../../shared/components/input/Input';
import { Button } from '../../../shared/components/button/Button';

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

        } catch (error: any) {
            Logger.error('Auth', 'Erro ao fazer login', error);
            let userMessage = 'Ocorreu um erro ao fazer login.';
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                userMessage = 'E-mail ou senha incorretos.';
            } else if (error.code === 'auth/invalid-email') {
                userMessage = 'Formato de e-mail inválido.';
            }
            Alert.alert('Falha no Login', userMessage);
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

        } catch (error: any) {
            Logger.error('Auth', 'Erro ao criar conta', error);
            let userMessage = 'Não foi possível criar sua conta.';
            if (error.code === 'auth/email-already-in-use') {
                userMessage = 'Este e-mail já está em uso.';
            } else if (error.code === 'auth/weak-password') {
                userMessage = 'A senha escolhida é muito fraca.';
            } else if (error.code === 'auth/invalid-email') {
                userMessage = 'O formato do e-mail é inválido.';
            }
            Alert.alert('Falha no Cadastro', userMessage);
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

                <Input
                    label="Username"
                    value={name}
                    onChangeText={text => setName(text)}
                    placeholder="john_doe"
                    autoCapitalize="none"
                />

                <Input
                    label="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    placeholder="email@address.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Input
                    label="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    placeholder="Password"
                    secureTextEntry
                    autoCapitalize="none"
                />

                <Button
                    title={loading ? 'Signing in…' : 'Sign in'}
                    onPress={signInWithEmail}
                    loading={loading}
                    className="mb-3"
                />

                <Button
                    title="Create account"
                    onPress={signUpWithEmail}
                    disabled={loading}
                    variant="outline"
                />
            </View>
        </View>
    );
}