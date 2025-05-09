import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderTitleBox from "../../components/HeaderTitleBox";
import { AuthContext } from "../../AuthContext";
import { API_IP } from "../../api/Config";

const { width: screenWidth } = Dimensions.get("window");
const baseMarginWeb = 0.02; // Reduced base margin for larger width
const webWidthPercentage = 0.4; // Increased width percentage for web

const ChangeEmail = () => {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const [currentEmail, setCurrentEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [loadingEmail, setLoadingEmail] = useState(true);
    const [notification, setNotification] = useState("");
    const [notificationType, setNotificationType] = useState("");

    const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

    const getNotificationBackgroundColor = (type) => {
        switch (type) {
            case 'success':
                return '#2E7D32'; // Stronger green
            case 'error':
                return '#D32F2F'; // Stronger red
            default:
                return '#1976D2'; // Stronger blue
        }
    };

    const getEmailUrl = `http://${API_IP}/Artemis/backend/login.php?action=getEmail`;
    const updateEmailUrl = `http://${API_IP}/Artemis/backend/login.php?action=updateEmail`;

    useEffect(() => {
        const fetchEmail = async () => {
            setLoadingEmail(true);
            if (user && user.id_empleado) {
                try {
                    const response = await fetch(getEmailUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id_empleado: user.id_empleado }),
                    });

                    const data = await response.json();

                    if (response.ok && data?.email) {
                        setCurrentEmail(data.email);
                    } else {
                        console.log(data?.message || "The email is already registered.");
                    }
                } catch (error) {
                    console.error("Error fetching email:", error);
                } finally {
                    setLoadingEmail(false);
                }
            } else {
                console.log("User information not available.");
                setLoadingEmail(false);
            }
        };

        fetchEmail();
    }, [user]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification("");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleSubmit = async () => {
        if (!newEmail) {
            setNotification("Please enter a new email address.");
            setNotificationType("error");
            return;
        }

        if (!user || !user.id_empleado) {
            setNotification("Employee information not found. Please try logging in again.");
            setNotificationType("error");
            return;
        }

        try {
            const response = await fetch(updateEmailUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_empleado: user.id_empleado,
                    nuevo_correo: newEmail,
                }),
            });

            const data = await response.json();

            if (response.ok && data?.message === "Correo electrónico actualizado exitosamente") {
                setNotification("Email updated successfully!");
                setNotificationType("success");
                setCurrentEmail(newEmail);
                setNewEmail("");
            } else {
                setNotification(data?.message || "Failed to update email.");
                setNotificationType("error");
            }
        } catch (error) {
            console.error("Error updating email:", error);
            setNotification("Error updating email. Please try again later.");
            setNotificationType("error");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={22} color="black" />
                <Text style={[styles.backText, isMobile ? styles.backTextMobile : null]}>Back</Text>
            </TouchableOpacity>
            {notification ? (
                <View
                    style={[
                        styles.notification,
                        { backgroundColor: getNotificationBackgroundColor(notificationType) },
                        isMobile ? styles.notificationMobileTop : styles.containerWeb,
                    ]}
                >
                    <Text style={[styles.notificationText, styles.text, isMobile ? styles.notificationTextMobile : styles.textWeb]}>
                        {notification}
                    </Text>
                </View>
            ) : null}
            <HeaderTitleBox iconName="envelope" text="CHANGE EMAIL ADDRESS" style={isMobile ? styles.headerTitleMobile : null} />

            <View style={styles.content}>
                <View style={styles.outerContainer}>
                    <View style={[styles.formContainer, isMobile ? styles.formContainerMobile : null]}>

                        {loadingEmail ? (
                            <Text style={[styles.loadingText, isMobile ? styles.loadingTextMobile : null]}>Loading email...</Text>
                        ) : (
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, isMobile ? styles.labelMobile : null]}>Current Email</Text>
                                <TextInput style={[styles.input, styles.disabledInput, isMobile ? styles.inputMobile : null]} value={currentEmail} editable={false} />
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, isMobile ? styles.labelMobile : null]}>New Email Address</Text>
                            <TextInput
                                style={[styles.input, isMobile ? styles.inputMobile : null]}
                                placeholder="Enter new email address"
                                placeholderTextColor="#aaa"
                                value={newEmail}
                                onChangeText={setNewEmail}
                                keyboardType="email-address"
                            />
                        </View>

                        <TouchableOpacity style={[styles.submitButton, isMobile ? styles.submitButtonMobile : null]} onPress={handleSubmit}>
                            <Text style={[styles.submitButtonText, isMobile ? styles.submitButtonTextMobile : null]}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#faf9f9",
        paddingVertical: 50,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: "#ddd",
        borderRadius: 8,
    },
    backText: {
        marginLeft: 5,
        fontSize: 16,
        color: "black",
    },
    notification: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        overflow: 'hidden',
    },
    notificationText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    containerWeb: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: screenWidth * webWidthPercentage,
        position: 'absolute',
        top: 15,
        left: 0,
        right: 0,
    },
    textWeb: {
        fontSize: 16,
    },
    content: {
        flex: 1,
        justifyContent: "flex-start", // Align content to the top
        alignItems: "center",
        paddingTop: 50, // Add some top padding to push it down from the header
    },
    outerContainer: {
        backgroundColor: "#e6ddcc",
        borderRadius: 15,
        padding: 20, // Further reduced padding
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 3,
        borderColor: "black",
    },
    formContainer: {
        width: screenWidth * 0.8, // Adjust width for mobile
        maxWidth: 400, // Increased maximum width for web
        padding: 20, // Further reduced padding
        backgroundColor: "white",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 3,
        borderColor: "black",
        alignItems: 'stretch',
    },
    formTitle: {
        fontSize: 22, // Further reduced font size
        fontWeight: 'bold',
        marginBottom: 20, // Further reduced margin
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 15, // Further reduced margin
    },
    label: {
        fontSize: 16, // Further reduced font size
        marginBottom: 5,
    },
    input: {
        height: 40, // Further reduced height
        borderColor: "#ccc",
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 8,
        fontSize: 16, // Further reduced font size
        backgroundColor: "#f9f9f9",
    },
    disabledInput: {
        backgroundColor: "#eee",
    },
    submitButton: {
        backgroundColor: "#e6ddcc",
        paddingVertical: 12, // Further reduced padding
        borderRadius: 25,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "black",
    },
    submitButtonText: {
        fontSize: 18, // Further reduced font size
        fontWeight: "bold",
        color: "black",
    },
    loadingText: {
        textAlign: "center",
        fontSize: 16, // Further reduced font size
        marginBottom: 15,
    },
    // Mobile Specific Styles
    headerTitleMobile: {
        fontSize: 12, // Even smaller header title on mobile
    },
    formContainerMobile: {
        width: screenWidth * 0.7, // Even smaller form width on mobile
        padding: 15, // Even smaller padding on mobile
    },
    formTitleMobile: {
        fontSize: 18, // Even smaller form title on mobile
        marginBottom: 15,
    },
    labelMobile: {
        fontSize: 14, // Even smaller label font size on mobile
        marginBottom: 3,
    },
    inputMobile: {
        height: 35, // Even smaller input height on mobile
        fontSize: 14, // Even smaller input font size on mobile
        paddingHorizontal: 8,
    },
    submitButtonMobile: {
        paddingVertical: 10, // Even smaller button padding on mobile
        borderRadius: 20,
    },
    submitButtonTextMobile: {
        fontSize: 16, // Even smaller button text size on mobile
    },
    loadingTextMobile: {
        fontSize: 14,
        marginBottom: 10,
    },
    backTextMobile: {
        fontSize: 14,
    },
    notificationMobileTop: {
        position: 'absolute',
        top: 130, // Adjust this value to position it below the header/back button
        left: 0,
        right: 0,
        margin: 10,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationTextMobile: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
});

export default ChangeEmail;