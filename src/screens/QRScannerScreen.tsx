import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { useAuth } from '../context/AuthContext';

export const QRScannerScreen = () => {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bienvenido {user?.name}</Text>
            <Text style={styles.text}>Rol: {user?.role}</Text>
            <Button
                title="Cerrar Sesión"
                onPress={logout}
                containerStyle={styles.button}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
    },
    button: {
        width: '80%',
        marginTop: 20,
    },
});
