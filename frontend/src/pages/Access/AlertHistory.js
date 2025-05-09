import React, { useEffect, useState } from "react";
import { View, StyleSheet, PanResponder, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderTitleBox from "../../components/HeaderTitleBox";
import TableNoTitle from "../../components/TableNoTitle"; // Asegúrate de que esta sea la ruta correcta a tu TableNoTitle con lógica móvil/web
import { getAlertHistory } from "../../api/Alert_History";

const AlertHistory = () => {
    const navigation = useNavigation();
    const [swipeDirection, setSwipeDirection] = useState("");
    const [alertHistory, setAlertHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const AlertHistoryData = await getAlertHistory();
                setAlertHistory(AlertHistoryData);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
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
        <View
            style={styles.container}
            {...panResponder.panHandlers}
        >
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.content}>
                <HeaderTitleBox iconName="exclamation-circle" text="ALERT HISTORY" />
                <TableNoTitle data={alertHistory} />
            </View>
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
        zIndex: 100,
    },
    backText: {
        marginLeft: 2,
        fontSize: 16,
        color: "black",
    },
    content: {
        flex: 1,
        paddingTop: 55, 
    },
});

export default AlertHistory;