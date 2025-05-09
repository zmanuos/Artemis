import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Switch,
    Platform,
} from "react-native";
import { updateEstadoDispositivo } from "../api/Dispositivos";

const DeviceTable = ({ data }) => {
    const [deviceData, setDeviceData] = useState([]);
    const isWeb = Platform.OS === "web";
    const screenWidth = Dimensions.get("window").width;
    const headers = deviceData.length > 0 ? Object.keys(deviceData[0]) : [];
    const englishHeaders = {
        codigo: "Code",
        tipo: "Type",
        ubicacion: "Location",
        area: "Area",
        estado: "Status",
    };

    useEffect(() => {
        if (data) {
            const formattedData = data.map((item) => ({
                ...item,
                estado: item.estado === 1,
            }));
            setDeviceData(formattedData);
        }
    }, [data]);

    const handleToggle = async (codigo, estadoActual) => {
        try {
            const nuevoEstado = estadoActual ? 0 : 1;
            await updateEstadoDispositivo(codigo, nuevoEstado);
            setDeviceData((prevData) =>
                prevData.map((device) =>
                    device.codigo === codigo ? { ...device, estado: nuevoEstado === 1 } : device
                )
            );
        } catch (error) {
            console.error("Error updating device status:", error.message);
        }
    };

    const renderHeader = () => (
        <View style={[styles.headerRow, isWeb && styles.headerRowWeb]}>
            {headers.map((header, index) => (
                <Text
                    key={index}
                    style={[
                        styles.headerCell,
                        { width: screenWidth / headers.length },
                        header === "estado" && isWeb && styles.headerCellStatusWeb,
                    ]}
                >
                    {(englishHeaders[header] || header).toUpperCase()}
                </Text>
            ))}
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            {headers.map((header, headerIndex) => (
                <View
                    key={headerIndex}
                    style={[styles.cell, { width: screenWidth / headers.length }]}
                >
                    {header === "estado" ? (
                        <View style={[styles.statusContainer, isWeb && styles.statusContainerWeb]}>
                            <Switch
                                value={item.estado}
                                onValueChange={() => handleToggle(item.codigo, item.estado)}
                            />
                            {isWeb && (
                                <Text style={styles.statusTextWeb}>
                                    {item.estado ? "ACTIVE" : "INACTIVE"}
                                </Text>
                            )}
                        </View>
                    ) : (
                        <Text style={styles.cellText}>
                            {item[header] != null ? item[header].toString() : "-"}
                        </Text>
                    )}
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <View style={styles.outerContainer}>
                <View style={styles.scrollableContainer}>
                    <FlatList
                        data={deviceData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.codigo.toString()}
                        ListHeaderComponent={renderHeader}
                        stickyHeaderIndices={[0]}
                        style={styles.flatList}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        alignSelf: "center",
        width: "95%",
        marginVertical: 10,
        alignItems: "center",
        marginTop: 40,
    },
    outerContainer: {
        backgroundColor: "#f5f1e6",
        borderRadius: 10,
        padding: 10,
        borderWidth: 2,
        borderColor: "black",
        width: "100%",
    },
    scrollableContainer: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        maxHeight: 390,
        overflow: "hidden",
    },
    flatList: {
        marginTop: 10,
    },
    headerRow: {
        flexDirection: "row",
        backgroundColor: "#f0f0f0",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    row: {
        flexDirection: "row",
        paddingVertical: 20,
        alignItems: "center",
    },
    headerCell: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 12,
    },
    cell: {
        flex: 1,
        textAlign: "center",
        justifyContent: "center",
        paddingHorizontal: 5,
    },
    cellText: {
        fontSize: 13,
        textAlign: "center",
    },
    // Estilos específicos para la columna de estado
    headerCellStatusWeb: {
        flexDirection: "column",
        alignItems: "center", // Centrar el encabezado
    },
    statusContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    // Ajustes para web
    statusContainerWeb: {
        flexDirection: "column", // Alinear verticalmente en web
        alignItems: "center",   // Centrar el switch y el texto
        justifyContent: "center",
    },
    statusTextWeb: {
        marginTop: 5, // Espacio entre el switch y el texto
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center", // Asegurar que el texto esté centrado
    },
    // Nuevo estilo para el encabezado web
    headerRowWeb: {
        paddingVertical: 15, // Aumenta el padding vertical para hacerlo más alto
    },
});

export default DeviceTable;