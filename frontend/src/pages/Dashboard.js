import React, { useEffect, useState } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importar useNavigation
import Infocard from "../components/Infocard";
import InfoTable from "../components/InfoTable";
import { getRondas } from '../api/Ronda';
import { getEmpleados } from '../api/Empleados';
import { getLastAccesses } from "../api/LastAccesses";
import { getLastAlerts } from "../api/LastAlerts";

const Dashboard = () => {
  const [activeRoutes, setActiveRoutes] = useState(0);
  const [supervisores, setSupervisores] = useState(0);
  const [guardias, setGuardias] = useState(0);
  const [empleados, setEmpleados] = useState(0);
  const [accesses, setAccesses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const navigation = useNavigation();
  const [swipeDirection, setSwipeDirection] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener los datos de rondas
        const rondasData = await getRondas();
        const activeCount = rondasData.filter(ronda => ronda.estado === 1).length;
        setActiveRoutes(activeCount);

        const empleadosData = await getEmpleados();

        // Filtrar los supervisores
        const supervisoresCount = empleadosData.filter(emp => emp.rol === "supervisor").length;
        setSupervisores(supervisoresCount);

        // Filtrar los guardias
        const guardiasCount = empleadosData.filter(emp => emp.rol === "guardia").length;
        setGuardias(guardiasCount);

        // todos los empleados
        const empleadosCount = empleadosData.length;
        setEmpleados(empleadosCount);

        // Obtener los últimos accesos
        const lastAccessesData = await getLastAccesses(); 
        setAccesses(lastAccessesData); 

        // Obtener las últimas alertas
        const lastAlertsData = await getLastAlerts(); 
        setAlerts(lastAlertsData); 
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  // Crear el PanResponder para detectar el deslizamiento
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 15; // Solo activar si el deslizamiento es suficiente
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 0) {
        setSwipeDirection("Right"); // Deslizó hacia la derecha
      } else if (gestureState.dx < 0) {
        setSwipeDirection("Left"); // Deslizó hacia la izquierda
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      // Acción dependiendo de la dirección del deslizamiento
      if (gestureState.dx > 100) {
        // Si el deslizamiento es lo suficientemente largo a la derecha, navega hacia la pantalla de "Accesses"
        navigation.navigate("Accesses");
      } else if (gestureState.dx < -100) {
        // Si el deslizamiento es lo suficientemente largo a la izquierda, navega hacia la pantalla de "Users"
        navigation.navigate("Users");
      }
      setSwipeDirection("");
    },
  });

  return (
    <View
      style={styles.container}
      {...panResponder.panHandlers} // Asocia los gestos al contenedor
    >
      <View style={styles.content}>
        <Infocard title="Active Routes" number={activeRoutes} iconName="route" />
        <Infocard title="Supervisors" number={supervisores} iconName="user-cog" />
        <Infocard title="Guards" number={guardias} iconName="user-shield" />
        <Infocard title="Employees" number={empleados} iconName="user-lock" />
      </View>
      <View style={styles.content}>
        <InfoTable title="LAST ACCESSES" data={accesses} />
        <InfoTable title="LAST ALERTS" data={alerts} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-evenly", 
    flexWrap: "wrap", 
    marginBottom: 30,
  },
});

export default Dashboard;
