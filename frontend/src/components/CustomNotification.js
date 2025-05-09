import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const CustomNotification = ({ message, type, duration = 2000, onClose }) => {
    const [slideAnim] = useState(new Animated.Value(-150));

    useEffect(() => {
        if (message) {
            // Mostrar la notificación
            Animated.timing(slideAnim, {
                toValue: isWeb ? 100 : -20, // Ajustar valor para web (más abajo)
                duration: 150,
                useNativeDriver: false,
            }).start(() => {
                // Ocultar la notificación después de la duración
                setTimeout(() => {
                    Animated.timing(slideAnim, {
                        toValue: -145,
                        duration: 150,
                        useNativeDriver: false,
                    }).start(() => {
                        if (onClose) {
                            onClose();
                        }
                    });
                }, duration);
            });
        }
    }, [message, duration, onClose, slideAnim, isWeb]);

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return '#2E7D32';
            case 'error':
                return '#D32F2F';
            default:
                return '#1976D2';
        }
    };

    const backgroundColor = getBackgroundColor();
    const textColor = 'white';

    // Si no hay mensaje, no renderizar nada
    if (!message) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.container,
                isWeb ? styles.containerWeb : {},
                { backgroundColor, transform: [{ translateY: slideAnim }] },
            ]}
        >
            <Text style={[styles.text, isWeb ? styles.textWeb : {}, { color: textColor }]}>{message}</Text>
        </Animated.View>
    );
};

const baseMarginWeb = 0.35;
const webWidthPercentage = 1 - (baseMarginWeb * 2);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: -100,
        left: screenWidth * 0.1,
        right: screenWidth * 0.1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 1,
        elevation: 0,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    text: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    containerWeb: {
        position: 'fixed',
        top: '3%', // Ajustar un poco más abajo
        left: '37%',
        transform: 'translateX(-10%)',
        width: screenWidth * Math.min(webWidthPercentage, 0.5), // Reducir el ancho máximo
        maxWidth: 400, // Reducir el ancho máximo
        paddingVertical: 10, // Reducir el padding vertical
        paddingHorizontal: 15, // Reducir el padding horizontal
        borderRadius: 8, // Reducir el radio del borde
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)', // Reducir la sombra
    },
    textWeb: {
        fontSize: 14, // Reducir el tamaño de la fuente
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CustomNotification;