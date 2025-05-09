// ActivePatrolDetailsStatic.js
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";

const RondinesDetails = () => {
    const route = useRoute();
    const { patrol } = route.params; // Recibimos la información de la patrulla activa

    if (!patrol) {
        return <View style={styles.container}><Text>No se proporcionaron detalles del rondín.</Text></View>;
    }

    // Simulación de checkpoints estáticos (reemplazar con datos reales eventualmente)
    const staticCheckpoints = [
        { id: 1, sector: { nombre: patrol.sectors.includes('A') ? 'A' : 'N/A' }, timestamp: new Date().getTime() - 60000 }, // Hace 1 minuto
        { id: 2, sector: { nombre: patrol.sectors.includes('D') ? 'D' : 'N/A' }, timestamp: new Date().getTime() - 30000 }, // Hace 30 segundos
        { id: 3, sector: { nombre: patrol.sectors.includes('A') ? 'A' : 'N/A' }, timestamp: new Date().getTime() },       // Ahora
    ].filter(cp => cp.sector.nombre !== 'N/A'); // Filtra sectores no incluidos en la patrulla

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Detalles del Rondín Activo</Text>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Nombre de la Ruta:</Text>
                <Text style={styles.detailText}>{patrol.routeName}</Text>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Guardia:</Text>
                <Text style={styles.detailText}>{patrol.guardName}</Text>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Inicio:</Text>
                <Text style={styles.detailText}>{new Date(patrol.startTime).toLocaleString()}</Text>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Fin:</Text>
                <Text style={styles.detailText}>{new Date(patrol.endTime).toLocaleString()}</Text>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Frecuencia:</Text>
                <Text style={styles.detailText}>{patrol.frequency}</Text>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Sectores:</Text>
                <Text style={styles.detailText}>{patrol.sectors}</Text>
            </View>

            <View style={styles.checkpointsContainer}>
                <Text style={styles.subtitle}>Historial de Visitas (Estático):</Text>
                {staticCheckpoints.length > 0 ? (
                    staticCheckpoints.map((checkpoint) => (
                        <View key={checkpoint.id} style={styles.checkpointItem}>
                            <Text style={styles.checkpointText}>Sector: {checkpoint.sector.nombre}</Text>
                            <Text style={styles.checkpointText}>Hora: {new Date(checkpoint.timestamp).toLocaleString()}</Text>
                        </View>
                    ))
                ) : (
                    <Text>No se han registrado visitas aún.</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    detailCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 5,
    },
    detailText: {
        fontSize: 16,
        color: '#777',
    },
    checkpointsContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    checkpointItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    checkpointItemLast: {
        borderBottomWidth: 0,
    },
    checkpointText: {
        fontSize: 14,
        color: '#777',
    },
});

export default RondinesDetails;