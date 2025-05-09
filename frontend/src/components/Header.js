import React from "react";
import { View, Text, Pressable, StyleSheet, Platform, Dimensions } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";

const { width } = Dimensions.get('window');

const Header = () => {
  const navigation = useNavigation();
  const navigationState = useNavigationState((state) => state || {});
  const activeRoute =
    navigationState?.index !== undefined
      ? navigationState.routes[navigationState.index]?.name
      : "Dashboard";

  const getActiveStyle = (routeName) =>
    activeRoute === routeName ? styles.active : {};

  return (
    <View style={Platform.OS === "web" ? styles.headerWeb : styles.headerMobile}>
      <Pressable style={[styles.menuItemMobile, getActiveStyle("Patrols")]} onPress={() => navigation.navigate("Patrols")}>
        {Platform.OS !== "web" && <Icon name="route" size={18} color="#62605c" />}
        <Text style={styles.buttonTextMobile}>Patrols</Text>
      </Pressable>

      <Pressable style={[styles.menuItemMobile, getActiveStyle("Accesses")]} onPress={() => navigation.navigate("Accesses")}>
        {Platform.OS !== "web" && <Icon name="door-open" size={18} color="#62605c" />}
        <Text style={styles.buttonTextMobile}>Accesses</Text>
      </Pressable>

      <Pressable style={[styles.menuItemMobile, getActiveStyle("Dashboard")]} onPress={() => navigation.navigate("Dashboard")}>
        {Platform.OS !== "web" && <Icon name="chart-bar" size={18} color="#62605c" />}
        <Text style={styles.buttonTextMobile}>{Platform.OS === "web" ? "ARTEMIS" : "Dashboard"}</Text>
      </Pressable>

      <Pressable style={[styles.menuItemMobile, getActiveStyle("Users")]} onPress={() => navigation.navigate("Users")}>
        {Platform.OS !== "web" && <Icon name="users" size={18} color="#62605c" />}
        <Text style={styles.buttonTextMobile}>Users</Text>
      </Pressable>

      <Pressable style={[styles.menuItemMobile, getActiveStyle("Settings")]} onPress={() => navigation.navigate("Settings")}>
        {Platform.OS !== "web" && <Icon name="cogs" size={18} color="#62605c" />}
        <Text style={styles.buttonTextMobile}>Settings</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  headerMobile: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f5f1e6",
    height: 60, // Reduced height
    paddingVertical: 5, // Reduced vertical padding
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 10,
  },
  headerWeb: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f5f1e6",
    height: 100,
    paddingVertical: 15,
    position: "relative",
    zIndex: 10,
  },
  menuItemMobile: {
    alignItems: "center",
    paddingVertical: 5, // Reduced vertical padding
    paddingHorizontal: width > 375 ? 10 : 8, // Adjust horizontal padding based on screen width
    borderRadius: 8, // Slightly reduced border radius
  },
  buttonTextMobile: {
    fontFamily: "PlayfairDisplay-Regular",
    fontSize: 14, // Reduced font size
    color: "#62605c",
    padding: 5, // Reduced padding
  },
  active: {
    backgroundColor: "#d1cdc5",
  },
  buttonText: { // Keep the original style for web if needed
    fontFamily: "PlayfairDisplay-Regular",
    fontSize: 18,
    color: "#62605c",
    padding: 10,
  },
});

export default Header;