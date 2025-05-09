import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getApiUrl } from '../../api/Config';
import HeaderTitleBoxID from '../../components/HeaderTitleBoxIDS';

const ActivePatrolsDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;
    const [ronda, setRonda] = useState(null);
    const [pulsaciones, setPulsaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isWeb = Platform.OS === 'web';

    const containerStyle = [
        styles.container,
        isWeb && webStyles.webContainer
    ];

    const contentStyle = [
        styles.content,
        isWeb && webStyles.webContent
    ];

    const pulsacionesContainerOuterStyle = [
        styles.pulsacionesContainerOuter,
        isWeb && webStyles.pulsacionesContainerOuterWeb,
    ];

    const fetchRondaDetails = async (useAllRondas = false) => {
        setLoading(true);
        setError(null);
        const endpoint = useAllRondas ? 'get_all_active_patrols' : 'active_patrols_details';

        try {
            const rondaResponse = await fetch(getApiUrl(endpoint));
            if (!rondaResponse.ok) {
                throw new Error(`HTTP error! status: ${rondaResponse.status}`);
            }
            const rondaData = await rondaResponse.json();
            const selectedRonda = rondaData.find(item => item.codigo = id);
            if (selectedRonda) {
                setRonda(selectedRonda);
                return true; // Found the ronda
            } else {
                console.error(`Round with ID ${id} not found using endpoint: ${endpoint}.`);
                return false; // Did not find the ronda
            }
        } catch (err) {
            console.error('Error fetching ronda data:', err);
            setError('Error fetching round data.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchPulsaciones = async () => {
        setError(null);
        try {
            const pulsacionesResponse = await fetch(`${getApiUrl('ruta_pulsasiones')}?codigo_ronda=${id}`);
            if (!pulsacionesResponse.ok) {
                throw new Error(`HTTP error! status: ${pulsacionesResponse.status}`);
            }
            const pulsacionesData = await pulsacionesResponse.json();
            setPulsaciones(pulsacionesData);
        } catch (err) {
            console.error('Error fetching pulsations:', err);
            setError('Error fetching pulsations.');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const rondaFound = await fetchRondaDetails();
            if (!rondaFound) {
                // If not found with the filtered endpoint, try fetching all
                const allRondasFound = await fetchRondaDetails(true);
                if (!allRondasFound) {
                    setError(`Round with ID ${id} not found.`);
                    return;
                }
            }
            await fetchPulsaciones();
        };

        loadData();
    }, [id]);

    const getPulsacionStatus = (timestamp) => {
        const pulsacionTime = new Date(timestamp).getTime();
        const now = Date.now();
        const diffMinutes = Math.floor((now - pulsacionTime) / (1000 * 60));

        if (diffMinutes <= 3) {
            return (
                <View style={styles.statusContainer}>
                    <Ionicons name="checkmark-circle" size={18} color="green" />
                    <Text style={[styles.statusText, isWeb && webStyles.webStatusText]}>OK</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.statusContainer}>
                    <Ionicons name="warning" size={18} color="red" />
                    <Text style={[styles.statusText, isWeb && webStyles.webStatusText]}>Alert</Text>
                </View>
            );
        }
    };

    const calculatePulsacionDescription = (pulsacion, frequency) => {
        const pulsacionTime = new Date(pulsacion.timestamp).getTime();
        const rondaStartTime = ronda.start ? new Date(ronda.start).getTime() : null;
        if (!rondaStartTime) {
            return 'Round start time not available.';
        }
        const elapsedTime = pulsacionTime - rondaStartTime;
        const expectedTime = frequency * 60 * 1000;

        const difference = Math.abs(elapsedTime - expectedTime);
        let differenceMinutes = Math.floor(difference / (1000 * 60));

        const sectors = ronda.sectors.split(' ');
        const sectorIndex = sectors.indexOf(pulsacion.ubicacion);

        const getRelativeTimeInfo = () => {
            const cycleTime = frequency * sectors.length * 60 * 1000;
            let relativeElapsedTime = elapsedTime % cycleTime;
            if (relativeElapsedTime < 0) {
                relativeElapsedTime += cycleTime;
            }
            const expectedRelativeTime = (sectors.indexOf(pulsacion.ubicacion) * frequency * 60 * 1000);
            const relativeDifference = Math.abs(relativeElapsedTime - expectedRelativeTime);
            const relativeDifferenceMinutes = Math.floor(relativeDifference / (1000 * 60));
            return { relativeDifferenceMinutes };
        };

        if (sectorIndex === -1) {
            const timeDifferenceNow = Math.floor((Date.now() - pulsacionTime) / (1000 * 60));
            const earlyOrLate = timeDifferenceNow < 0 ? 'early' : 'late';
            const absTimeDifference = Math.abs(timeDifferenceNow);
            const timeString = absTimeDifference >= 60 ? `${Math.floor(absTimeDifference / 60)} hours ${absTimeDifference % 60} minutes` : `${absTimeDifference} minutes`;
            return `Sector not in expected sequence, pressed ${timeString} ${earlyOrLate}.`;
        }

        const expectedSectorTime = rondaStartTime + (frequency * sectorIndex * 60 * 1000);
        const { relativeDifferenceMinutes } = getRelativeTimeInfo();

        if (relativeDifferenceMinutes <= 3) {
            return 'Pulsation within expected time.';
        } else if (elapsedTime < expectedSectorTime && relativeDifferenceMinutes <= 5) {
            return 'Pulsation pressed early.';
        } else if (elapsedTime > expectedSectorTime && relativeDifferenceMinutes > 3) {
            let displayTime = `${relativeDifferenceMinutes} minutes`;
            if (relativeDifferenceMinutes >= 60) {
                const hours = Math.floor(relativeDifferenceMinutes / 60);
                const minutes = relativeDifferenceMinutes % 60;
                displayTime = `${hours} hours ${minutes} minutes`;
            }
            return `Pulsation pressed late (${displayTime}).`;
        } else {
            const { relativeDifferenceMinutes } = getRelativeTimeInfo();
            return `Pulsation out of sequence.`;
        }
    };

    const formatSectors = (sectors) => {
        if (!sectors) return '';
        return sectors.split(' ').join(' -> ');
    };

    const getRoundStatus = (start, end) => {
        const now = new Date();
        const startTime = start ? new Date(start) : null;
        const endTime = end ? new Date(end) : null;

        if (!startTime) {
            return { status: 'Not Started', color: 'orange' };
        } else if (startTime > now) {
            return { status: 'Not Started', color: 'orange' };
        } else if (!endTime || endTime > now) {
            return { status: 'In progress', color: 'green' };
        } else {
            return { status: 'Finalized', color: 'red' };
        }
    };

    const roundStatusInfo = getRoundStatus(ronda?.start, ronda?.end);

    if (loading) {
        return (
            <View style={containerStyle}>
                <Text>Loading data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={containerStyle}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!ronda) {
        return (
            <View style={containerStyle}>
                <Text>Round data not found.</Text>
            </View>
        );
    }

    return (
        <View style={containerStyle}>
            <TouchableOpacity style={isWeb ? webStyles.webBackButton : styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color="black" />
                <Text style={isWeb ? webStyles.webBackText : styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={contentStyle}>
                <HeaderTitleBoxID iconName="clipboard-list" id={id} />

                <View style={[styles.infoContainer, isWeb && webStyles.webInfoContainer, { marginTop: 10 }]}>
                    <Text style={[styles.infoLabel, isWeb && webStyles.webInfoLabel]}>Name:</Text>
                    <Text style={[styles.infoValue, isWeb && webStyles.webInfoValue]}>{ronda.nombre}</Text>
                </View>
                <View style={[styles.infoContainer, isWeb && webStyles.webInfoContainer]}>
                    <Text style={[styles.infoLabel, isWeb && webStyles.webInfoLabel]}>Guard:</Text>
                    <Text style={[styles.infoValue, isWeb && webStyles.webInfoValue]}>{ronda.guard}</Text>
                </View>
                <View style={[styles.infoContainer, isWeb && webStyles.webInfoContainer]}>
                    <Text style={[styles.infoLabel, isWeb && webStyles.webInfoLabel]}>Start:</Text>
                    <Text style={[styles.infoValue, isWeb && webStyles.webInfoValue]}>{ronda.start}</Text>
                </View>
                <View style={[styles.infoContainer, isWeb && webStyles.webInfoContainer]}>
                    <Text style={[styles.infoLabel, isWeb && webStyles.webInfoLabel]}>End:</Text>
                    <Text style={[styles.infoValue, isWeb && webStyles.webInfoValue]}>{ronda.end}</Text>
                </View>
                <View style={[styles.infoContainer, isWeb && webStyles.webInfoContainer]}>
                    <Text style={[styles.infoLabel, isWeb && webStyles.webInfoLabel]}>Sectors:</Text>
                    <Text style={[styles.infoValue, isWeb && webStyles.webInfoValue]}>{formatSectors(ronda.sectors)}</Text>
                </View>
                <View style={[styles.infoContainer, isWeb && webStyles.webInfoContainer]}>
                    <Text style={[styles.infoLabel, isWeb && webStyles.webInfoLabel]}>Frequency:</Text>
                    <Text style={[styles.infoValue, isWeb && webStyles.webInfoValue]}>{ronda.frequency} Minutes per sector</Text>
                </View>

                <View style={pulsacionesContainerOuterStyle}>
                    <View style={[styles.pulsacionesContainerInner, isWeb && webStyles.webPulsacionesContainerInner]}>
                        <View style={[styles.pulsationHeader, isWeb && webStyles.webPulsationHeader]}>
                            <Text style={[styles.title, isWeb && webStyles.webTitle]}>Pulsations:</Text>
                            <Text style={[styles.roundStatus, isWeb && webStyles.webRoundStatus, { color: roundStatusInfo.color }]}>
                                {roundStatusInfo.status}
                            </Text>
                        </View>
                        <ScrollView style={isWeb ? webStyles.webPulsacionesScroll : styles.pulsacionesScroll}>
                            {pulsaciones.length === 0 ? (
                                <Text style={[styles.noPulsations, isWeb && webStyles.webNoPulsations]}>No pulsations found.</Text>
                            ) : (
                                pulsaciones.map((pulsacion, index) => (
                                    <View key={index} style={[styles.pulsacionItem, isWeb && webStyles.webPulsacionItem, index < pulsaciones.length - 1 && styles.pulsacionItemBorder, isWeb && index < pulsaciones.length - 1 && webStyles.webPulsacionItemBorder]}>
                                        <View style={styles.pulsacionDetails}>
                                            <Text style={[styles.pulsacionTextBold, isWeb && webStyles.webPulsacionTextBold]}>Location: {pulsacion.ubicacion}</Text>
                                            <Text style={[styles.pulsacionText, isWeb && webStyles.webPulsacionText]}>Time: {pulsacion.timestamp}</Text>
                                            <Text style={[styles.pulsacionText, isWeb && webStyles.webPulsacionText, webStyles.webPulsacionDesc]}>Desc: {calculatePulsacionDescription(pulsacion, ronda.frequency)}</Text>
                                        </View>
                                        <View style={[styles.pulsacionStatus, isWeb && webStyles.webPulsacionStatus]}>
                                            {getPulsacionStatus(pulsacion.timestamp)}
                                        </View>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf9f9',
        padding: 10,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        position: "absolute",
        top: 30,
        left: 10,
        backgroundColor: "#ddd",
        borderRadius: 8,
        zIndex: 1000,
    },
    backText: {
        marginLeft: 5,
        fontSize: 14,
        color: "black",
    },
    content: {
        paddingTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoLabel: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoValue: {
        fontSize: 16,
    },
    pulsacionesContainerOuter: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        padding: 10,
        marginTop: 20,
        backgroundColor: '#f5f1e6',
    },
    pulsacionesContainerInner: {
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        padding: 12,
        maxHeight: 400,
    },
    pulsacionesScroll: {
        flexGrow: 1,
    },
    pulsacionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    pulsacionDetails: {
        flex: 1,
    },
    pulsacionText: {
        fontSize: 14,
        marginBottom: 3,
    },
    pulsacionTextBold: {
        fontSize: 14,
        marginBottom: 3,
        fontWeight: 'bold',
    },
    pulsacionStatus: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        flexDirection: 'row',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 14,
        marginLeft: 5,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    noPulsations: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666',
        paddingVertical: 10,
    },
    pulsationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
    },
    roundStatus: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    pulsacionItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(238, 238, 238, 0.3)',
    },
});

const webStyles = StyleSheet.create({
    webContainer: {
        flex: 1,
        backgroundColor: '#faf9f9',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 15,
        minHeight: '80vh',
    },
    webContent: {
        maxWidth: 700,
        width: '100%',
        padding: 15,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    webBackButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 6,
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "#eee",
        borderRadius: 6,
        zIndex: 1000,
        cursor: 'pointer',
    },
    webBackText: {
        marginLeft: 4,
        fontSize: 12,
        color: "black",
    },
    webInfoContainer: {
        marginBottom: 6,
    },
    webInfoLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    webInfoValue: {
        fontSize: 14,
    },
    webTitle: {
        fontSize: 18,
    },
    webRoundStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    pulsacionesContainerOuterWeb: {
        maxWidth: '100%',
        width: '100%',
        alignSelf: 'center',
        flexGrow: 1,
        marginBottom: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        backgroundColor: '#f8f8f8',
    },
    webPulsacionesContainerInner: {
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 10,
        maxHeight: 400,
    },
    webPulsacionesScroll: {
        flexGrow: 1,
    },
    webPulsacionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    webPulsacionDetails: {
        flex: 1,
    },
    webPulsacionText: {
        fontSize: 12,
        marginBottom: 2,
    },
    webPulsacionTextBold: {
        fontSize: 12,
        marginBottom: 2,
        fontWeight: 'bold',
    },
    webPulsacionDesc: {
        fontSize: 10,
    },
    webPulsacionStatus: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        flexDirection: 'row',
    },
    webStatusText: {
        fontSize: 12,
        marginLeft: 3,
    },
    webNoPulsations: {
        fontSize: 12,
        textAlign: 'center',
        color: '#777',
        paddingVertical: 8,
    },
    webPulsationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 4,
    },
    webPulsacionItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(238, 238, 238, 0.5)',
    },
});

export default ActivePatrolsDetails;