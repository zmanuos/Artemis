import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const Infocard = ({ title = "Template", number = 0, iconName = "users" }) => {
  const isMobile = Platform.OS !== "web";

  return (
    <View style={isMobile ? styles.mobileCard : styles.container}>
      <View style={isMobile ? styles.mobileInnerCard : styles.card}>
        <Text style={isMobile ? styles.mobileTitle : styles.title}>{title.toUpperCase()}</Text>
        <View style={isMobile ? styles.mobileContent : styles.content}>
          {!isMobile && <Icon name={iconName} size={60} color="black" />}
          <Text style={isMobile ? styles.mobileNumber : styles.number}>{number}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 330,
    height: 240,
    backgroundColor: "#f5f1e6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "black",
  },
  card: {
    width: 300,
    height: 200,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
  },
  content: {
    flexDirection: "row",
    alignItems: "center"
  },
  number: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#000",
    paddingLeft: 20,
  },
  
  // Estilos para versión móvil
  mobileCard: {
    marginBottom: 20,
    width: 140,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  mobileInnerCard: {
    marginTop: 30,
    width: 140,
    height: 80,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  mobileTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  mobileContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  mobileNumber: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
  },
});

export default Infocard;
