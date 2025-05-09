import React from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const InfoButton = ({ title, iconName, navigateTo, number }) => {
  const navigation = useNavigation();
  const isMobile = Platform.OS !== 'web';

  const handlePress = () => {
    if (navigateTo) {
      navigation.navigate(navigateTo);
    }
  };

  const containerBackgroundColorMobile = "#f4f0e5";

  const mobileStyles = StyleSheet.create({
    container: {
      width: '95%',
      maxWidth: 500,
      height: 100,
      backgroundColor: containerBackgroundColorMobile,
      justifyContent: "flex-start",
      alignItems: "center",
      borderRadius: 25,
      borderWidth: 1,
      borderColor: "black",
      marginBottom: 15,
      flexDirection: 'row',
      paddingHorizontal: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    iconContainer: {
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 20,
    },
    titleContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: 'left',
    },
    number: {
      fontSize: 40,
      fontWeight: "bold",
      color: "#000",
    },
  });

  const webStyles = StyleSheet.create({
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
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    title: {
      fontSize: 25,
      fontWeight: "bold",
      textAlign: 'center',
    },
    number: {
      fontSize: 80,
      fontWeight: "bold",
      color: "#000",
    },
  });

  const currentStyles = isMobile ? mobileStyles : webStyles;

  return (
    <TouchableOpacity onPress={handlePress} style={currentStyles.container}>
      {!isMobile && (
        <View style={webStyles.card}>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
            <Icon name={iconName} size={50} color="black" />
          </View>
          <Text style={webStyles.title}>{String(title)?.toUpperCase() || "DEFAULT"}</Text>
          {number !== undefined && <Text style={webStyles.number}>{String(number)}</Text>}
        </View>
      )}
      {isMobile && (
        <View style={currentStyles.iconContainer}>
          <Icon name={iconName} size={50} color="black" />
        </View>
      )}
      {isMobile && (
        <View style={currentStyles.titleContainer}>
          <Text style={currentStyles.title}>{String(title)?.toUpperCase() || "DEFAULT"}</Text>
        </View>
      )}
      {number !== undefined && isMobile && (
        <Text style={currentStyles.number}>{String(number)}</Text>
      )}
    </TouchableOpacity>
  );
};

export default InfoButton;