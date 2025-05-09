import React, { useState } from "react";
import { View, StyleSheet, PanResponder, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import UserForm from "../../components/UserForm";
import HeaderTitleBox from "../../components/HeaderTitleBox";

const CreateUsers = () => {
  const navigation = useNavigation();
  const [swipeDirection, setSwipeDirection] = useState("");

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

  const handleRegister = (formData) => {
    console.log("User registered:", formData);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} {...panResponder.panHandlers}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <HeaderTitleBox iconName="user-plus" text="CREATE USER" />
        <UserForm roles={['SUPERVISOR', 'GUARD', 'EMPLOYEE']} onSubmit={handleRegister} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f9",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    marginBottom: 10,
    backgroundColor: "#ddd",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: "black",
  },
});

export default CreateUsers;
