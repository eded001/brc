import React, { createContext, useEffect, useState } from 'react';
import * as authService from '@libs/domain/auth/src/service';

export const AuthContext = createContext({});

export function AuthProvider({ children } : { children: React.ReactNode }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged(authUser => {
            setUser(authUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn: authService.signIn,
                signUp: authService.signUp,
                signOut: authService.signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}