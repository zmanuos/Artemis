import React, { useState, useEffect } from "react";
import { View, StyleSheet, PanResponder, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DataTable from "../../components/DataTableDateFilter"; // Asegúrate de la ruta correcta
import HeaderTitleBox from "../../components/HeaderTitleBox"; // Importa HeaderTitleBox
import { getPatrolReports } from "../../api/PatrolReports"; // Asegúrate de la ruta correcta
import moment from "moment"; // Asegúrate de importar moment

const PatrolReports = () => {
    const navigation = useNavigation();
    const [swipeDirection, setSwipeDirection] = useState("");
    const [patrolReportsData, setPatrolReportsData] = useState([]);

    useEffect(() => {
        const fetchPatrolReports = async () => {
            const data = await getPatrolReports();
            if (data) {
                const formattedData = data.map((report) => {
                    return {
                        ...report,
                        DATE: moment(report.DATE).format("DD/MM/YYYY"),
                        codigo: report.codigo, // Asumiendo que el identificador único en la API se llama "ID"
                        // Si el identificador único se llama "codigo" en la API, usa:
                        // codigo: report.codigo,
                    };
                });
                setPatrolReportsData(formattedData);
            }
        };

        fetchPatrolReports();
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

            <View style={styles.content}>
                <HeaderTitleBox iconName="file-alt" text="Patrol Reports" />
                <DataTable
                    data={patrolReportsData} // Pasando los datos obtenidos
                    navigation={navigation}
                    navigateTo="ReportDetails"
                    // idKey="id" // Elimina esta línea
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Esto permite que el View ocupe toda la pantalla
        backgroundColor: "#f5f5f5",
        paddingVertical: 50,
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
        paddingHorizontal: 20,
    },
});

export default PatrolReports;