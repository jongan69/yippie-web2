"use client"
import React from 'react';
import { useStorageState } from '@/lib/hooks/useStorageState';

// AUTH
export const AuthContext = React.createContext<{ signInAuth: (pubkey: any) => void; signOut: () => void; session?: string | null, isLoading: boolean } | null>(null);

// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');

    return (
        <AuthContext.Provider
            value={{
                signInAuth: (isAuthed: any) => {
                    setSession(isAuthed);
                },
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}