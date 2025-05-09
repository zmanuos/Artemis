// CreatePatrols.js
import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderTitleBox from "../../components/HeaderTitleBox";
import GuardSelectionTable from "../../components/GuardSelectionTable";
import { getGuardias } from "../../api/GuardiasSeguridad";

const CreatePatrol = () => {
  const navigation = useNavigation();
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [guardias, setGuardias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const GuardiasData = await getGuardias();
        setGuardias(GuardiasData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleGuardSelect = useCallback((guard) => {
    console.clear();
    console.log("Selected Guard:", guard);
    setSelectedGuard(guard);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedGuard) {
      console.log("Continue with selected guard:", selectedGuard);
      navigation.navigate("CreateRoute", { selectedGuard });
    } else {
      console.log("No guard selected.");
    }
  }, [navigation, selectedGuard]);

  console.log("CreatePatrol rendered"); // Para depuración

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <HeaderTitleBox iconName="id-card-alt" text="ASSIGN GUARD" />

      <View style={styles.content}>
        <GuardSelectionTable
          data={guardias}
          onGuardSelect={handleGuardSelect}
          onContinue={handleContinue}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f9",
    paddingTop: 40,
    paddingBottom: 55,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    top: 10,
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
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 15,
  },
});

export default CreatePatrol;