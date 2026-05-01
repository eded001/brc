import React, { createContext, useEffect, useState } from 'react';
import * as authService from '@libs/domain/auth/src/service';

export const AuthContext = createContext({});

export function AuthProvider({ children } : any) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged(user => {
            setUser(user);
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