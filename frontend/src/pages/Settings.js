import React, { useState } from "react";
import { View, StyleSheet, PanResponder, TouchableOpacity, Text, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import InfoButton from "../components/InfoButton";

import ChangePassword from "./Settings/ChangePassword";
import ChangeEmail from "./Settings/ChangeEmail";

const Stack = createStackNavigator();

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [swipeDirection, setSwipeDirection] = useState("");
  const isMobile = Platform.OS !== 'web';

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 15;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 0) {
        setSwipeDirection("Right");
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 100) {
        navigation.navigate("Users");
      }
      setSwipeDirection("");
    },
  });

  const handleLogout = () => {
    navigation.navigate("LoginScreen");
  };

  const webStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#faf9f9",
      paddingVertical: 20,
      alignItems: 'center', // Center content horizontally on web
    },
    content: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      flexWrap: "wrap",
      marginBottom: 40,
      marginTop: 100, // Adjust top margin for web
      width: '80%', // Limit width on web for better layout
      maxWidth: 900, // Set a maximum width if needed
    },
    logoutContainer: {
      marginBottom: 40,
      alignItems: 'center',
    },
    logoutButton: {
      backgroundColor: "#e6ddcc",
      padding: 15,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "black",
      width: 200,
      alignItems: 'center',
    },
    logoutText: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: 'center',
    },
  });

  const mobileStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#faf9f9",
      paddingVertical: 20,
      justifyContent: 'space-between',
    },
    content: {
      flexDirection: "column",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 20,
      justifyContent: "flex-start",
    },
    logoutContainer: {
      marginBottom: 40,
      alignItems: 'center',
    },
    logoutButton: {
      backgroundColor: "#e6ddcc",
      padding: 15,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "black",
      width: 200,
      alignItems: 'center',
    },
    logoutText: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: 'center',
    },
  });

  const currentStyles = isMobile ? mobileStyles : webStyles;

  return (
    <View style={currentStyles.container} {...panResponder.panHandlers}>
      <View style={currentStyles.content}>
        <InfoButton title="CHANGE EMAIL" iconName="envelope" navigateTo="ChangeEmail" />
        <InfoButton title="CHANGE PASSWORD" iconName="user-cog" navigateTo="ChangePassword" />
      </View>
      <View style={currentStyles.logoutContainer}>
        <TouchableOpacity style={currentStyles.logoutButton} onPress={handleLogout}>
          <Text style={currentStyles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Settings = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UsersMain" component={SettingsScreen} />
    <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
  </Stack.Navigator>
);

export default Settings;