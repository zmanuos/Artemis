import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, PanResponder } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderTitleBox from "../../components/HeaderTitleBox";

const { width } = Dimensions.get("window");

const ChangeEmail = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const currentEmail = "example@example.com";
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

  const handleSubmit = () => {
    console.log("New Email:", email);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <HeaderTitleBox iconName="mail" text="CHANGE EMAIL" />

      <View style={styles.content}>
        <View style={styles.outerContainer}>
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Email</Text>
              <TextInput
                style={styles.input}
                placeholder={currentEmail}
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>D

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
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
    paddingVertical: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  outerContainer: {
    backgroundColor: "#e6ddcc",
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
    borderColor: "black",
  },
  card: {
    width: width * 0.8,
    padding: 30,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
    borderColor: "black",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 18,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#e6ddcc",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: "black",
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});

export default ChangeEmail;