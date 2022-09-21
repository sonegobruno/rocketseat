import React, { createContext, useEffect, useCallback, useState, useContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface IUser {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
}

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthContextState {
    user: IUser;
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void;
    updateUser(user: IUser): Promise<void>; 
    loading: boolean;
}

interface AuthState {
    token: string;
    user: IUser;
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState);

export const AuthProvider: React.FC = ({children}) => {
    const [data, setData] = useState<AuthState>({} as AuthState);
    const [loading, setLoading] = useState(true);

    const signIn = useCallback(async ({email, password}) => {
        const response = await api.post('sessions', {
            email,
            password
        });

        const { token, user} = response.data;

        await AsyncStorage.multiSet([
            ['@GoBarber:token', token],
            ['@GoBarber:user', JSON.stringify(user)]
        ])

        api.defaults.headers.authorization = `Bearer ${token}`;

        setData({ token, user });
    },[]);

    const signOut = useCallback(async () => {
        await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);
    
        setData({} as AuthState);
    },[])
 
    const updateUser = useCallback(async (user: IUser) => {
        await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));
        setData({
            token: data.token,
            user
        });
    },[data.token])

    useEffect(()=>{
        async function loadStorage(): Promise<void> {
            const [ token, user ] = await AsyncStorage.multiGet([
                '@GoBarber:token', '@GoBarber:user'
            ])

            if( token[1] && user[1]) {
                api.defaults.headers.authorization = `Bearer ${token[1]}`;
                setData({token: token[1], user: JSON.parse(user[1])});
            }

            setLoading(false);
        }

        loadStorage();
    },[]);

    return (
        <AuthContext.Provider value={{user: data.user, signIn, signOut, loading, updateUser}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextState {
    const context = useContext(AuthContext);
    
    if(!context) {
        throw new Error('useAuth must be used whithin an AuthProvider');
    }

    return context;
}


