import React, { useState } from 'react';
import { Alert, View, Text, TextInput, Pressable } from 'react-native'
import { supabase } from '@supabase-client';

export default function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function signInWithEmail() {
        console.log('[AUTH] Sign in iniciado', { email })

        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('[AUTH] Erro ao fazer login', error)
            Alert.alert(error.message)
        } else {
            console.log('[AUTH] Login realizado com sucesso')
        }

        setLoading(false)
    }

    async function signUpWithEmail() {
        console.log('[AUTH] Sign up iniciado', { email })

        setLoading(true)

        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            console.error('[AUTH] Erro ao criar conta', error)
            Alert.alert(error.message)
        } else {
            console.log('[AUTH] Conta criada com sucesso', {
                sessionExists: !!session,
            })
        }

        if (!session) {
            console.warn('[AUTH] Usuário criado sem sessão ativa (verificação pendente)')
            Alert.alert('Please check your inbox for email verification!')
        }

        setLoading(false)
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

                {/* Email */}
                <View className="mb-4">
                    <Text className="text-xs text-zinc-300 mb-1">Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text)
                            console.log('[AUTH] Email alterado')
                        }}
                        placeholder="email@address.com"
                        placeholderTextColor="#71717A"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-50"
                    />
                </View>

                {/* Password */}
                <View className="mb-6">
                    <Text className="text-xs text-zinc-300 mb-1">Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text)
                            console.log('[AUTH] Password alterada')
                        }}
                        placeholder="Password"
                        placeholderTextColor="#71717A"
                        secureTextEntry
                        autoCapitalize="none"
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-50"
                    />
                </View>

                {/* Sign in */}
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

                {/* Sign up */}
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
    )
}