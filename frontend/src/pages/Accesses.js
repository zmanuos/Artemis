import React, { useState } from "react";
import { View, StyleSheet, PanResponder, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import InfoButton from "../components/InfoButton";

//Paginas enlazadas para el boton
import AlertHistory from "./Access/AlertHistory";
import AccessesHistory from "./Access/AccessesHistory";
import ManageDevices from "./Access/ManageDevices";

const Stack = createStackNavigator();

const AccessesScreen = () => {
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
      } else if (gestureState.dx < 0) {
        setSwipeDirection("Left");
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 100) {
        navigation.navigate("Patrols");
      } else if (gestureState.dx < -100) {
        navigation.navigate("Dashboard");
      }
      setSwipeDirection("");
    },
  });

  const webStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#faf9f9",
      paddingVertical: 20,
      alignItems: 'center',
    },
    content: {
      flexDirection: "row",
      justifyContent: "space-around", // Distribute items evenly
      flexWrap: "nowrap", // Prevent wrapping to a new line
      marginTop: 100,
      width: '90%', // Adjust width to take more horizontal space
      maxWidth: 1200, // Set a larger max width if needed
    },
  });

  const mobileStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#faf9f9",
      paddingVertical: 20,
    },
    content: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 20,
      justifyContent: "flex-start",
    },
  });

  const currentStyles = isMobile ? mobileStyles : webStyles;

  return (
    <View style={currentStyles.container} {...panResponder.panHandlers}>
      <View style={currentStyles.content}>
        <InfoButton title="ALERT HISTORY" iconName="exclamation-circle" navigateTo="AlertHistory" />
        <InfoButton title="ACCESSES HISTORY" iconName="door-open" navigateTo="AccessesHistory" />
        <InfoButton title="MANAGE DEVICES" iconName="wrench" navigateTo="ManageDevices" />
      </View>
    </View>
  );
};

const AccessesNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AccessesMain" component={AccessesScreen} />
    <Stack.Screen name="AlertHistory" component={AlertHistory} />
    <Stack.Screen name="AccessesHistory" component={AccessesHistory} />
    <Stack.Screen name="ManageDevices" component={ManageDevices} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: { // Keep the original style for mobile as a fallback or initial
    flex: 1,
    backgroundColor: "#faf9f9",
    paddingVertical: 20,
  },
  content: { // Keep the original style for mobile as a fallback or initial
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: "flex-start",
  },
});

export default AccessesNavigator;