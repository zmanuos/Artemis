import React, { useState, useEffect } from "react";
import { View, StyleSheet, PanResponder, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ActivePatrolCard from "../../components/ActivePatrolCard";
import HeaderTitleBox from "../../components/HeaderTitleBox";
import { getActivePatrols } from "../../api/ActivePatrols";

const ActivePatrols = () => {
  const navigation = useNavigation();
  const [swipeDirection, setSwipeDirection] = useState("");
  const [patrolDataArray, setPatrolDataArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patrolsData = await getActivePatrols();
        setPatrolDataArray(patrolsData);
      } catch (error) {
        console.error("Error al obtener las patrullas activas:", error);
      }
    };
  
    fetchData();
  }, []);
  

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

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

        <ScrollView>
      <View style={styles.container}>
        <HeaderTitleBox iconName="wifi" text="Active Patrols" />
          {patrolDataArray.map((patrol, index) => (
            <ActivePatrolCard key={index} patrolData={patrol} />
          ))}
      </View>
        </ScrollView>
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
    zIndex: 1000,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: "black",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
});

export default ActivePatrols;
