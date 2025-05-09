// ResetPassword.js
import React, { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, ActivityIndicator } from "react-native";
import { API_IP } from "./api/Config";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomNotification from "./components/CustomNotification"; // Asegúrate de tener este componente
import { Ionicons } from '@expo/vector-icons'; // Importa iconos

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const ResetPassword = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { email, otpVerified } = route.params || {}; // Recibe el parámetro
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    useEffect(() => {
        navigation.setOptions({ headerShown: false }); // Oculta el header

        // Muestra la notificación si otpVerified es true al montar el componente
        if (otpVerified) {
            showNotification("Verification successful. You can now reset your password.", 'success');
        }

        // Navega a LoginScreen después de mostrar la notificación de éxito
        if (resetSuccess) {
            const timer = setTimeout(() => {
                navigation.navigate("LoginScreen");
            }, 200); // Espera 0.5 segundos después de activar resetSuccess
            return () => clearTimeout(timer);
        }
    }, [navigation, otpVerified, resetSuccess]);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        const duration = type === 'success' ?  1400 : 3000; // Notificación de éxito dura 1.5 segundos
        setTimeout(() => {
            setNotification(null);
            if (type === 'success' && message === "Password has been reset successfully.") {
                setResetSuccess(true);
            }
        }, duration);
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            showNotification("Please enter and confirm your new password.", 'error');
            return;
        }

        if (newPassword.length < 8) {
            showNotification("The new password must be at least 8 characters long.", 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showNotification("The new password and confirmation do not match.", 'error');
            return;
        }

        setIsLoading(true); // Activa el estado de carga
        try {
            const response = await fetch(`http://${API_IP}/Artemis/backend/login.php?action=resetPassword`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: newPassword,
                }),
            });

            const text = await response.text();
            console.log("Reset Password Response:", text);

            try {
                const result = JSON.parse(text);
                if (result.status === "success") {
                    showNotification("Password has been reset successfully.", 'success');
                    // La navegación se maneja en el useEffect
                } else {
                    showNotification(result.message || "Failed to reset password. Please try again.", 'error');
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
                showNotification("Invalid server response.", 'error');
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            showNotification("There was a problem resetting the password. Please try again.", 'error');
        } finally {
            setIsLoading(false); // Desactiva el estado de carga
        }
    };

    const goBack = () => {
        navigation.goBack();
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <View style={styles.outerContainer}>
            <View style={[styles.container, isWeb && styles.containerWeb]}>
                <TouchableOpacity onPress={goBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#000" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <CustomNotification
                    message={notification?.message}
                    type={notification?.type}
                    onClose={() => setNotification(null)}
                />
                <View style={styles.content}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.infoText}>Enter your new password for the email:</Text>
                    <Text style={styles.emailText}>{email}</Text>

                    <Text style={styles.label}>New Password:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showNewPassword}
                            placeholder="New Password"
                        />
                        <TouchableOpacity onPress={toggleNewPasswordVisibility} style={styles.eyeIcon}>
                            <Ionicons
                                name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                                size={24}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Confirm New Password:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            placeholder="Confirm New Password"
                        />
                        <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                            <Ionicons
                                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                size={24}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword} disabled={isLoading}>
                        {isLoading ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ActivityIndicator color="black" style={{ marginRight: 8 }} />
                                <Text style={styles.resetButtonText}>Cargando...</Text>
                            </View>
                        ) : (
                            <Text style={styles.resetButtonText}>Reset Password</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    container: {
        width: screenWidth * 0.85,
        padding: 20,
        backgroundColor: '#F5F1E6',
        borderRadius: 10,
        alignItems: 'center',
        position: 'relative',
        borderWidth: 1.5,
        borderColor: 'black',
        elevation: 5,
    },
    containerWeb: {
        maxWidth: 400,
        paddingVertical: 30,
    },
    backButton: {
        position: 'absolute',
        top: 15,
        left: 15,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: '#ddd',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
    backButtonText: {
        marginLeft: 3,
        color: '#000',
        fontSize: 14,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        marginTop: 40,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
    },
    emailText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 25,
        color: '#000',
        fontFamily: 'Roboto-Medium',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
        alignSelf: 'flex-start',
        fontFamily: 'Roboto-Regular',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 45,
        borderColor: 'black',
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: 'white',
        fontFamily: 'Roboto-Regular',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
        paddingRight: 40, // Espacio para el icono
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        height: '100%',
        justifyContent: 'center',
    },
    resetButton: {
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignSelf: 'center',
        marginTop: 20,
        borderWidth: 2,
        borderColor: 'black',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    resetButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Medium',
    },
});

export default ResetPassword;