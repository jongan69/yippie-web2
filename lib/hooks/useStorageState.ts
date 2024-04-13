"use client"
// import * as SecureStore from 'expo-secure-store';
import React, { Dispatch, SetStateAction, useReducer } from 'react';
// import { Platform } from 'react-native';

type UseStateHook<T> = [
    [boolean, T | null],
    Dispatch<SetStateAction<T | null>>
];

function useAsyncState<T>(
    initialValue: T | null = null,
): UseStateHook<T> {
    const reducer = (
        state: [boolean, T | null],
        action: T | null = null,
    ): [boolean, T | null] => [false, action];

    return useReducer(reducer, [true, initialValue]) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
    try {
        if (value === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, value);
        }
    } catch (e) {
        console.error('Local storage is unavailable:', e);
    }
}

export function useStorageState(key: string): UseStateHook<string> {
    // Public
    const [state, setState] = useAsyncState<any>();

    // Get
    React.useEffect(() => {
        try {
            if (typeof localStorage !== 'undefined') {
                setState(localStorage.getItem(key));
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
    }, [key]);

    // Set
    const setValue: any = React.useCallback(
        (value: string | null) => {
            setStorageItemAsync(key, value).then(() => {
                setState(value);
            });
        },
        [key]
    );

    return [state, setValue];
}