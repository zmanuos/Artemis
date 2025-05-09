import React, { useEffect ,useState } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importar useNavigation
import { Ionicons } from "@expo/vector-icons"; // Ícono para el botón
import HeaderTitleBox from "../../components/HeaderTitleBox";
import DeviceTable from "../../components/DeviceTable";
import { getDispositivos } from "../../api/Dispositivos";

const ManageDevices = () => {
  const navigation = useNavigation();
  const [swipeDirection, setSwipeDirection] = useState("");
  const [dispositivos, setDispositivos] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const DispositivosData = await getDispositivos(); 
          setDispositivos(DispositivosData); 
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      };
  
      fetchData();
    }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) =>
      Math.abs(gestureState.dx) > 15,
    onPanResponderMove: (evt, gestureState) => {
      setSwipeDirection(gestureState.dx > 0 ? "Right" : "Left");
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 100) navigation.navigate("Patrols");
      else if (gestureState.dx < -100) navigation.navigate("Dashboard");
      setSwipeDirection("");
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <HeaderTitleBox iconName="wrench" text="MANAGE DEVICES" />
        <DeviceTable data={dispositivos} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f9",
    paddingVertical: 25,

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
    zIndex: 100,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: "black",
  },
});

export default ManageDevices;
