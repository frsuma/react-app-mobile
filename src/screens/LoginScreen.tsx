import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor complete todos los campos');
            return;
        }

        setLoading(true);
        try {
            await login({ email, password });
        } catch (error) {
            console.error('Error en pantalla de login:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text h3 style={styles.title}>Login</Text>
            
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                disabled={loading}
                leftIcon={{ type: 'material', name: 'email' }}
            />
            
            <Input
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                disabled={loading}
                leftIcon={{ type: 'material', name: 'lock' }}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
            ) : (
                <Button
                    title="Iniciar Sesión"
                    onPress={handleLogin}
                    containerStyle={styles.buttonContainer}
                    raised
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
    },
    loading: {
        marginTop: 20,
    },
});
