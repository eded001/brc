import { AppState, Platform } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

const supabaseUrl = "YOUR_REACT_NATIVE_SUPABASE_URL"
const supabaseAnonKey = "YOUR_REACT_NATIVE_SUPABASE_PUBLISHABLE_KEY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        lock: processLock,
    },
})

// Diz ao Supabase Auth para atualizar a sessão automaticamente de forma contínua
// se o aplicativo estiver em primeiro plano. Ao adicionar isso, você continuará
// a receber eventos `onAuthStateChange` com o evento `TOKEN_REFRESHED` ou
// `SIGNED_OUT` se a sessão do usuário for encerrada. Isso deve
// ser registrado apenas uma vez.
if (Platform.OS !== "web") {
    AppState.addEventListener('change', (state) => {
        if (state === 'active') {
            supabase.auth.startAutoRefresh()
        } else {
            supabase.auth.stopAutoRefresh()
        }
    })
}