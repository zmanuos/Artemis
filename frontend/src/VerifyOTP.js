// VerifyOTP.js
import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from "react-native";
import { API_IP } from "./api/Config";
import { useNavigation } from "@react-navigation/native";
import CustomNotification from "./components/CustomNotification"; // Importa el componente de notificación personalizado
import { Ionicons } from '@expo/vector-icons'; // Importa iconos

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const VerifyOTP = ({ route }) => {
    const { email } = route.params;
    const [otp, setOtp] = useState("");
    const navigation = useNavigation();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        navigation.setOptions({ headerShown: false }); // Oculta el header de navegación
    }, [navigation]);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000); // La notificación se ocultará después de 3 segundos (ajusta la duración si es necesario)
    };

    const verifyOTP = async () => {
        if (!otp) {
            showNotification("Please enter the verification code.", 'error');
            return;
        }

        try {
            const response = await fetch(`http://${API_IP}/Artemis/backend/verify_otp.php`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `email=${email}&otp=${otp}`,
            });

            const text = await response.text();
            console.log("Verify OTP Response:", text);

            try {
                const result = JSON.parse(text);

                if (result.status === "success") {
                    // **Elimina esta línea:**
                    // showNotification(result.message, 'success');
                    navigation.navigate("ResetPassword", { email });
                } else {
                    showNotification("The verification code is incorrect.", 'error');
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
                showNotification("Invalid server response.", 'error');
            }
        } catch (error) {
            console.error("Error making the request:", error);
            showNotification("There was a problem verifying the OTP. Please try again.", 'error');
        }
    };

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.outerContainer}>
            <View style={[styles.container, isWeb && styles.containerWeb]}>
                <TouchableOpacity onPress={goBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#555" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <CustomNotification
                    message={notification?.message}
                    type={notification?.type}
                    onClose={() => setNotification(null)}
                />
                <View style={styles.content}>
                    <Text style={styles.title}>Code Verification</Text>
                    <Text style={styles.infoText}>A verification code has been sent to:</Text>
                    <Text style={styles.emailText}>{email}</Text>
                    <Text style={styles.label}>Enter the code:</Text>
                    <TextInput
                        style={styles.input}
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="numeric"
                        placeholder="OTP Code"
                        maxLength={6} // Ajusta la longitud según tu necesidad
                    />
                    <TouchableOpacity style={styles.verifyButton} onPress={verifyOTP}>
                        <Text style={styles.verifyButtonText}>Verify Code</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const baseMarginWeb = 0.2;
const webWidthPercentage = 1 - (baseMarginWeb * 2);

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // Fondo blanco
    },
    container: {
        width: screenWidth * 0.85,
        padding: 20,
        backgroundColor: '#F5F1E6', // Fondo del otro formulario
        borderRadius: 10, // Borde redondeado igual al otro formulario
        alignItems: 'center',
        position: 'relative',
        borderWidth: 1.5, // Borde igual al input del otro formulario
        borderColor: 'black', // Color del borde igual al input del otro formulario
        elevation: 5, // Sombra similar
    },
    containerWeb: {
        maxWidth: 400, // Ancho máximo similar
        paddingVertical: 30,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: '#ddd', // Gris claro para el fondo del botón
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    backButtonText: {
        marginLeft: 5,
        color: '#000', // Color del texto similar al otro formulario
        fontSize: 16,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 22, // Tamaño de título similar
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // Color del título similar
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        marginTop: 40,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555', // Color del texto similar
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
    },
    emailText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 25,
        color: '#000', // Color similar
        fontFamily: 'Roboto-Medium',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555', // Color del label similar
        alignSelf: 'flex-start',
        fontFamily: 'Roboto-Regular',
    },
    input: {
        width: '100%',
        height: 45, // Altura del input similar
        borderColor: 'black', // Color del borde igual al otro formulario
        borderWidth: 1.5, // Ancho del borde igual al otro formulario
        borderRadius: 8, // Borde redondeado igual al otro formulario
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: 'white',
        fontFamily: 'Roboto-Regular',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2, // Sombra similar al input
    },
    verifyButton: {
        backgroundColor: 'white', // Color del botón similar
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25, // Borde redondeado similar
        alignSelf: 'center',
        marginTop: 20,
        borderWidth: 2, // Borde similar
        borderColor: 'black', // Color del borde similar
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Sombra similar
    },
    verifyButtonText: {
        color: 'black', // Color del texto del botón similar
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Medium',
    },
});

export default VerifyOTP;