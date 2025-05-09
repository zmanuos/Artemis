import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { API_IP } from '../api/Config';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const PasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const [notification, setNotification] = useState('');
    const [notificationType, setNotificationType] = useState('');

    const getNotificationBackgroundColor = (type) => {
        switch (type) {
            case 'success':
                return '#4CAF50'; // Un tono de verde más similar al de la imagen
            case 'error':
                return '#F44336'; // Un tono de rojo más similar al de la imagen
            default:
                return '#2196F3'; // Un tono de azul más similar al de la imagen
        }
    };

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification('');
            }, 3000); // Aumenté el tiempo a 3 segundos para que sea más visible
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleUpdatePassword = async () => {
        if (!user || !user.id_empleado) {
            setNotification('Could not retrieve user information.');
            setNotificationType('error');
            return;
        }

        if (!currentPassword || !newPassword || !confirmPassword) {
            setNotification('All fields are required.');
            setNotificationType('error');
            return;
        }

        if (newPassword.length < 8) {
            setNotification('New password must be at least 8 characters long.');
            setNotificationType('error');
            return;
        }

        if (newPassword !== confirmPassword) {
            setNotification('New password and confirmation do not match.');
            setNotificationType('error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `http://${API_IP}/Artemis/backend/login.php?action=updatePassword`,
                {
                    id_empleado: user.id_empleado,
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword,
                }
            );

            if (response.data && response.data.message) {
                setNotification(response.data.message);
                if (response.data.message === 'Password updated successfully') {
                    setNotificationType('success');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                } else {
                    setNotificationType('error');
                }
            } else {
                setNotification('Could not update password. Please try again.');
                setNotificationType('error');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setNotification('An error occurred while updating the password. Please check your internet connection and try again.');
            setNotificationType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const mobileOuterContainerStyle = {
        marginTop: 30,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 0,
    };

    const mobileCardStyle = {
        width: width * 0.85,
        paddingHorizontal: 25,
        paddingBottom: 25,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 0,
        marginBottom: 15,
    };

    const mobileInputStyle = {
        height: 45,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 6,
        fontSize: 16,
    };

    const mobileLabelStyle = {
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    };

    const mobileSubmitButtonStyle = {
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
    };

    const mobileSubmitButtonTextStyle = {
        fontSize: 18,
        fontWeight: 'bold',
    };

    const webCardStyle = isWeb ? {
        width: 400,
        height: 440, // Ajusta según sea necesario
        paddingHorizontal: 30,
        paddingBottom: 30,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 3,
        borderColor: 'black',
        marginBottom: 10,
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
    } : {};

    const webInputContainerStyle = isWeb ? {
        marginBottom: 15,
    } : {};

    const webLabelStyle = isWeb ? {
        fontSize: 16,
        marginBottom: 5,
    } : {};

    const webInputStyle = isWeb ? {
        height: 40,
        fontSize: 16,
        marginBottom: 8,
    } : {};

    const webSubmitButtonStyle = isWeb ? {
        paddingVertical: 12,
        borderRadius: 25,
    } : {};

    const webSubmitButtonTextStyle = isWeb ? {
        fontSize: 18,
    } : {};

    const notificationBaseStyle = {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        overflow: 'hidden',
        backgroundColor: getNotificationBackgroundColor(notificationType),
    };

    const mobileNotificationStyle = {
        ...notificationBaseStyle,
        position: 'absolute',
        top: -60, // Ajusté la posición vertical
        left: '5%',
        right: '5%',
    };

    const webNotificationStyle = {
        ...notificationBaseStyle,
        position: 'absolute',
        top: -70, // Ajusté la posición vertical
        left: '50%',
        transform: [{ translateX: '-50%' }],
        width: '80%',
        maxWidth: 400,
    };

    const notificationTextStyle = {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    };

    return (
        <View style={styles.container}>
            <View style={[styles.outerContainer, mobileOuterContainerStyle, isWeb && { alignItems: 'center' }]}>
                <View style={[styles.card, mobileCardStyle, webCardStyle]}>
                    <View style={{ position: 'relative' }}>
                        {notification ? (
                            <View style={isWeb ? webNotificationStyle : mobileNotificationStyle}>
                                <Text style={notificationTextStyle}>{notification}</Text>
                            </View>
                        ) : null}
                    </View>
                    <View style={[styles.inputContainer, webInputContainerStyle, { marginTop: 30 }]}>
                        <Text style={[styles.label, mobileLabelStyle, webLabelStyle]}>Currently Password</Text>
                        <View style={[styles.passwordInput, styles.passwordInputWithIcon]}>
                            <TextInput
                                style={[styles.input, mobileInputStyle, styles.inputWithIcon, webInputStyle]}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={!showCurrentPassword}
                            />
                            <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                <Ionicons
                                    name={showCurrentPassword ? "eye-off" : "eye"}
                                    size={24}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.inputContainer, webInputContainerStyle]}>
                        <Text style={[styles.label, mobileLabelStyle, webLabelStyle]}>New Password</Text>
                        <View style={[styles.passwordInput, styles.passwordInputWithIcon]}>
                            <TextInput
                                style={[styles.input, mobileInputStyle, styles.inputWithIcon, webInputStyle]}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNewPassword}
                            />
                            <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={() => setShowNewPassword(!showNewPassword)}
                            >
                                <Ionicons
                                    name={showNewPassword ? "eye-off" : "eye"}
                                    size={24}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.inputContainer, webInputContainerStyle]}>
                        <Text style={[styles.label, mobileLabelStyle, webLabelStyle]}>Confirm New Password</Text>
                        <View style={[styles.passwordInput, styles.passwordInputWithIcon]}>
                            <TextInput
                                style={[styles.input, mobileInputStyle, styles.inputWithIcon, webInputStyle]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? "eye-off" : "eye"}
                                    size={24}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, mobileSubmitButtonStyle, webSubmitButtonStyle, isLoading && { opacity: 0.7 }]}
                        onPress={handleUpdatePassword}
                        disabled={isLoading}
                    >
                        <Text style={[styles.submitButtonText, mobileSubmitButtonTextStyle, webSubmitButtonTextStyle]}>
                            {isLoading ? 'Updating...' : 'Update'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    outerContainer: {
        backgroundColor: '#e6ddcc',
        borderRadius: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 3,
        borderColor: 'black',
        marginTop: 40,
    },
    card: {
        width: width * 0.3,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 3,
        borderColor: 'black',
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    passwordInput: {
        flexDirection: "row",
        alignItems: "center",
    },
    passwordInputWithIcon: {
        position: 'relative',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 18,
        backgroundColor: '#f9f9f9',
        flex: 1,
    },
    inputWithIcon: {
        paddingRight: 50,
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -22 }],
        padding: 10,
    },
    eyeIcon: {},
    submitButton: {
        backgroundColor: '#e6ddcc',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 2,
        borderColor: 'black',
    },
    submitButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default PasswordForm;