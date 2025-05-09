import React, { useState } from "react";
import { View, StyleSheet, PanResponder, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import InfoButton from "../components/InfoButton";

// Páginas enlazadas
import CreateUsers from "./Users/CreateUsers";
import ModifyUsers from "./Users/ModifyUsers";

// Definir el Stack
const Stack = createStackNavigator();

const UsersScreen = () => {
  const navigation = useNavigation();
  const [swipeDirection, setSwipeDirection] = useState('');
  const isMobile = Platform.OS !== 'web';

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 15,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 0) setSwipeDirection('Right');
      else if (gestureState.dx < 0) setSwipeDirection('Left');
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 100) navigation.navigate("Dashboard");
      else if (gestureState.dx < -100) navigation.navigate("Settings");
      setSwipeDirection('');
    },
  });

  const webStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#faf9f9",
      paddingVertical: 20,
    },
    content: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      flexWrap: "wrap",
      marginBottom: 30,
      marginTop: 160,
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
        <InfoButton title="CREATE USERS" iconName="user-plus" navigateTo="CreateUsers" />
        <InfoButton title="MANAGE USERS" iconName="user-edit" navigateTo="ModifyUsers" />
      </View>
    </View>
  );
};

const Users = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UsersMain" component={UsersScreen} />
    <Stack.Screen name="ModifyUsers" component={ModifyUsers} />
    <Stack.Screen name="CreateUsers" component={CreateUsers} />
  </Stack.Navigator>
);

export default Users;