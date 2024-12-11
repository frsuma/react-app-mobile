import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { AuthResponse, LoginCredentials, User } from '../types/auth.types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // URL del backend
    const API_URL = 'http://192.168.1.100:8000/api';

    // Configuración de axios para CORS y credenciales
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Accept'] = 'application/json';

    useEffect(() => {
        loadStoredAuth();
    }, []);

    const loadStoredAuth = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');
            
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
        } catch (error) {
            console.error('Error loading auth info:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials) => {
        try {
            console.log('Intentando login con:', credentials);
            console.log('URL:', `${API_URL}/login`);

            const response = await axios.post<AuthResponse>(`${API_URL}/login`, credentials);
            console.log('Respuesta del servidor:', response.data);

            const { token: newToken, user: userData } = response.data;
            
            await AsyncStorage.setItem('token', newToken);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            setToken(newToken);
            setUser(userData);
        } catch (error: any) {
            console.error('Error completo:', error);
            console.error('Error response:', error.response?.data);
            
            const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
            Alert.alert('Error', errorMessage);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Error al cerrar sesión');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
