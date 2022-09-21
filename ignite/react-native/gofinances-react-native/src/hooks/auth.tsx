import React, { useContext, ReactNode, createContext, useState} from 'react';

import * as Google from 'expo-google-app-auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export const AuthContext = createContext({} as AUthContextData);
interface Props {
    children: ReactNode;
}

interface IUser {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AUthContextData {
    user: IUser;
    sigInWithGoogle(): Promise<void>;
    signOut(): Promise<void>;
    loading: boolean;
}


function AuthProvider({ children }: Props) {
    const [ user, setUser ] = useState<IUser>({} as IUser);
    const [ loading, setLoading ] = useState(true);

    const userStorageKey = '@gofinances:user';

    useEffect(() => {
        async function loadStorageData() {
            const userStorage = await AsyncStorage.getItem(userStorageKey);

            if(userStorage) {
                const userLogged = JSON.parse(userStorage);
                setUser(userLogged);
            }

            setLoading(false);
        }

        loadStorageData();
    },[])

    async function signOut() {
        setUser({} as IUser);
        await AsyncStorage.removeItem(userStorageKey);
    }

    async function sigInWithGoogle() {
        setLoading(true);
        try {
            const result: any = await Google.logInAsync({
                iosClientId: '803752754616-q2jkdcda992o1ht26h0c4rfs4vt9kbae.apps.googleusercontent.com',
                androidClientId: '803752754616-cvbl346e30jvu9k1eu483fvpsjnrh946.apps.googleusercontent.com',
                scopes: ['profile', 'email']
            });

            if(result.type = 'success') {
                const userLogged = {
                    id: String(result.user.id),
                    email: result.user.email!,
                    name: result.user.name!,
                    photo: result.user.photoUrl!
                }

                setUser(userLogged);

                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
            }

        } catch(err) {
            setLoading(false);
            throw new Error(err)
        }
    }

    return (
        <AuthContext.Provider value={{ user, sigInWithGoogle, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}


export { AuthProvider, useAuth }