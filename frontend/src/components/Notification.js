import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const Notification = ({ message, type, duration = 2000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-150)); 

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: isWeb ? -10 : -20, 
        duration: 150, 
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -145, 
            duration: 150, 
            useNativeDriver: false,
          }).start(() => {
            setIsVisible(false);
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

  if (!isVisible && !message) {
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
    left: screenWidth * baseMarginWeb,
    right: screenWidth * baseMarginWeb,
    width: screenWidth * webWidthPercentage,
    paddingVertical: 10, 
    paddingHorizontal: 12,
    borderRadius: 12, 
  },
  textWeb: {
    fontSize: 12,
  },
});

export default Notification;