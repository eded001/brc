import { AppState, Platform } from 'react-native'
import { supabase } from './client'

export function registerSupabaseAppState() {
    if (Platform.OS === 'web') return

    AppState.addEventListener('change', (state) => {
        if (state === 'active') {
            supabase.auth.startAutoRefresh()
        } else {
            supabase.auth.stopAutoRefresh()
        }
    })
}