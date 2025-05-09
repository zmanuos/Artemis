import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Image, Platform, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_IP } from './api/Config';
import { AuthContext } from './AuthContext';
import RequestOTP from './RequestOTP';
import CustomNotification from './components/CustomNotification'; // Asegúrate de tener este componente

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const { login, isLoading, setIsLoading } = useContext(AuthContext);
    const [loginError, setLoginError] = useState('');
    const [showRecoverPassword, setShowRecoverPassword] = useState(false);
    const route = useRoute();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        navigation.setOptions({ headerShown: false });

        // Verifica si hay un mensaje de éxito al montar el componente
        if (route.params?.passwordResetSuccess) {
            showNotification(route.params.passwordResetSuccess, 'success');
            // Limpia el parámetro para que no se muestre de nuevo
            navigation.setParams({ passwordResetSuccess: undefined });
        }
    }, [navigation, route.params?.passwordResetSuccess]);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000); // Ocultar después de 3 segundos
    };

    const handleLogin = async () => {
        if (isLoading) {
            return;
        }
        setLoginError('');
        setIsLoading(true);

        if (!userId || !password) {
            setLoginError('Por favor, introduce correo y contraseña.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`http://${API_IP}/Artemis/backend/login.php`, {
                correo: userId,
                contrasena: password,
            });

            console.log(response.data);

            if (response.data.message === 'Inicio de sesión exitoso') {
                login({ id_empleado: response.data.id_empleado, rol: response.data.rol });
                navigation.navigate('Dashboard');
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error) {
            console.error('Error en el login:', error);
            Alert.alert('Error', 'Error al iniciar sesión. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecoverPasswordPress = () => {
        setShowRecoverPassword(true);
    };

    const handleBackToLogin = () => {
        setShowRecoverPassword(false);
    };

    const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
    const styles = isMobile ? mobileStyles : desktopStyles;

    return (
        <View style={styles.container}>
            <CustomNotification
                message={notification?.message}
                type={notification?.type}
                onClose={() => setNotification(null)}
            />
            {showRecoverPassword ? (
                <View style={styles.outerContainer}>
                    <RequestOTP navigation={navigation} />
                    <TouchableOpacity onPress={handleBackToLogin}>
                        <Text style={styles.recoverPassword}>Return to login</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.outerContainer}>
                    <View style={styles.card}>
                        <Image source={require('./assets/images/as.png')} style={styles.logo} />
                        <Text style={styles.label}>EMAIL</Text>
                        <TextInput
                            style={styles.input}
                            value={userId}
                            onChangeText={setUserId}
                            keyboardType="default"
                        />
                        <Text style={styles.label}>PASSWORD</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <Text style={styles.loginButtonText}>LOG IN</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleRecoverPasswordPress}>
                            <Text style={styles.recoverPassword}>Recover Password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const mobileStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F1E6',
    },
    outerContainer: {
        width: width * 0.85,
        padding: 20,
        backgroundColor: '#F5F1E6',
        elevation: 5,
        alignItems: 'center',
    },
    card: {
        width: '100%',
        alignItems: 'center',
    },
    logo: {
        width: 160,
        height: 160,
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: 'black',
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'black',
        borderWidth: 1.5,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: 'white',
        fontFamily: 'Roboto-Regular',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    loginButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: 'black',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadiusshadowRadius: 3.84,
        elevation: 5,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Roboto-Regular',
    },
    recoverPassword: {
        fontSize: 14,
        color: '#444',
        marginTop: 10,
        fontFamily: 'Roboto-Regular',
    },
});

const desktopStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    outerContainer: {
        backgroundColor: '#F5F1E6',
        borderWidth: 2,
        borderColor: 'black',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    card: {
        width: width * 0.35,
        padding: 30,
        backgroundColor: '#F5F1E6',
        elevation: 5,
        alignItems: 'center',
    },
    logo: {
        width: 160,
        height: 160,
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: 'black',
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'black',
        borderWidth: 1.5,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: 'white',
        fontFamily: 'Roboto-Regular',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    loginButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: 'black',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Roboto-Regular',
    },
    recoverPassword: {
        fontSize: 14,
        color: '#444',
        marginTop: 10,
        fontFamily: 'Roboto-Regular',
    },
});

export default LoginScreen;