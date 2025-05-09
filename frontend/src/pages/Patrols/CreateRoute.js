import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderTitleBox from "../../components/HeaderTitleBox";
import RouteForm from "../../components/RouteForm"; // Importa RouteForm

const CreateRoute = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedGuard } = route.params || {}; // Recibe el guardia seleccionado

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <HeaderTitleBox iconName="map" text="CREATE ROUTE" />

        {selectedGuard ? (
          <>
            <Text style={styles.guardInfo}>
              Guard: {selectedGuard.nombre} {selectedGuard.apellido_paterno} {selectedGuard.apellido_materno}
            </Text>
            <RouteForm selectedGuard={selectedGuard} />
          </>
        ) : (
          <Text style={styles.errorText}>No guard selected. Please go back and select a guard.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f9",
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,

  },
  guardInfo: {
    fontSize: 18,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default CreateRoute;