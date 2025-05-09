// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);

    const login = async (userData) => {
        setIsLoading(true);
        setUser({ id_empleado: userData.id_empleado, rol: userData.rol });
        try {
            await AsyncStorage.setItem('userSession', JSON.stringify({ id_empleado: userData.id_empleado, rol: userData.rol }));
        } catch (error) {
            console.error('Error saving user session:', error);
        }
        setIsLoading(false);
    };

    const logout = async () => {
        setIsLoading(true);
        setUser(null);
        try {
            await AsyncStorage.removeItem('userSession');
        } catch (error) {
            console.error('Error removing user session:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const loadUserSession = async () => {
            setIsLoading(true);
            try {
                const session = await AsyncStorage.getItem('userSession');
                if (session) {
                    setUser(JSON.parse(session));
                }
            } catch (error) {
                console.error('Error loading user session:', error);
            }
            setIsLoading(false);
        };

        loadUserSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, setIsLoading }}>
            {children}
        </AuthContext.Provider>
    );
};