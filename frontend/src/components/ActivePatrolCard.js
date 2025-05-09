import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const isMobile = Platform.OS !== 'web';

const ActivePatrolCard = ({ patrolData }) => {
    const navigation = useNavigation();
    const formattedSectors = patrolData.sectors.split(' ').join(' -> ');
    const frequencyText = patrolData.frequency !== undefined && patrolData.frequency !== null
        ? `${String(patrolData.frequency)} Minutes`
        : '';

    const handleCardPress = () => {
        navigation.navigate('ActivePatrolsDetails', { id: patrolData.codigo });
    };

    return (
        <TouchableOpacity onPress={handleCardPress}>
            <View style={isMobile ? mobileStyles.container : styles.container}>
                <View style={isMobile ? mobileStyles.outerContainer : styles.outerContainer}>
                    <View style={isMobile ? mobileStyles.card : styles.card}>
                        <View style={isMobile ? mobileStyles.fieldContainer : styles.fieldContainer}>
                            <Ionicons name="map" size={24} color="black" style={isMobile ? mobileStyles.fieldIcon : styles.fieldIcon} />
                            <Text style={isMobile ? mobileStyles.fieldText : styles.fieldText}>ROUTE NAME</Text>
                            <TextInput
                                style={isMobile ? mobileStyles.input : styles.input}
                                value={patrolData.nombre}
                                editable={false}
                            />
                        </View>

                        <View style={isMobile ? mobileStyles.fieldContainer : styles.fieldContainer}>
                            <Ionicons name="person" size={24} color="black" style={isMobile ? mobileStyles.fieldIcon : styles.fieldIcon} />
                            <Text style={isMobile ? mobileStyles.fieldText : styles.fieldText}>GUARD</Text>
                            <TextInput
                                style={isMobile ? mobileStyles.input : styles.input}
                                value={patrolData.guard}
                                editable={false}
                            />
                        </View>

                        <View style={isMobile ? mobileStyles.dateTimeContainer : styles.dateTimeContainer}>
                            <View style={isMobile ? mobileStyles.dateTimeSubContainer : styles.dateTimeSubContainer}>
                                <Ionicons name="time" size={24} color="black" style={isMobile ? mobileStyles.fieldIcon : styles.fieldIcon} />
                                <Text style={isMobile ? mobileStyles.fieldText : styles.fieldText}>START</Text>
                                <TextInput
                                    style={[isMobile ? mobileStyles.input : styles.input, isMobile ? mobileStyles.dateInput : styles.dateInput]}
                                    value={patrolData.start}
                                    editable={false}
                                />
                            </View>
                            <View style={isMobile ? mobileStyles.dateTimeSubContainer : styles.dateTimeSubContainer}>
                                <Text style={[isMobile ? mobileStyles.fieldText : styles.fieldText, isMobile ? mobileStyles.endTextMobile : styles.endText]}>END</Text>
                                <TextInput
                                    style={[isMobile ? mobileStyles.input : styles.input, isMobile ? mobileStyles.dateInput : styles.dateInput]}
                                    value={patrolData.end}
                                    editable={false}
                                />
                            </View>
                        </View>

                        <View style={isMobile ? mobileStyles.fieldContainer : styles.fieldContainer}>
                            <Ionicons name="flag" size={24} color="black" style={isMobile ? mobileStyles.fieldIcon : styles.fieldIcon} />
                            <Text style={isMobile ? mobileStyles.fieldText : styles.fieldText}>SECTORS</Text>
                            <TextInput
                                style={isMobile ? mobileStyles.input : styles.input}
                                value={formattedSectors}
                                editable={false}
                            />
                        </View>

                        <View style={isMobile ? mobileStyles.fieldContainer : styles.fieldContainer}>
                            <Ionicons name="refresh" size={24} color="black" style={isMobile ? mobileStyles.fieldIcon : styles.fieldIcon} />
                            <Text style={isMobile ? mobileStyles.fieldText : styles.fieldText}>FREQUENCY</Text>
                            <TextInput
                                style={isMobile ? mobileStyles.input : styles.input}
                                value={frequencyText}
                                editable={false}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#faf9f9',
        marginTop: 30,
        paddingHorizontal: 10,
    },
    outerContainer: {
        backgroundColor: '#e6ddcc',
        borderRadius: 10,
        padding: 10,
        borderWidth: 2,
        borderColor: 'black',
    },
    card: {
        width: width * 0.5,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    fieldIcon: {
        marginRight: 8,
        width: 24,
        alignItems: 'center',
    },
    fieldText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 6,
        width: 90,
    },
    endText: {
        marginRight: 5,
        width: 30,
    },
    input: {
        flex: 1,
        height: 35,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 6,
        borderRadius: 6,
        fontSize: 12,
        backgroundColor: '#f9f9f9',
    },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    dateTimeSubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 5,
    },
    dateInput: {
        fontSize: 12,
        paddingHorizontal: 4,
        height: 30,
    },
});

const mobileStyles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#faf9f9',
    },
    outerContainer: {
        backgroundColor: '#e6ddcc',
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 15,
    },
    card: {
        width: '100%',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    fieldIcon: {
        marginRight: 8,
        width: 20,
        alignItems: 'center',
        fontSize: 20,
    },
    fieldText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 8,
        width: 90,
    },
    endTextMobile: {
        marginRight: 5,
        width: 40,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 8,
        borderRadius: 6,
        fontSize: 14,
        backgroundColor: '#f9f9f9',
    },
    dateTimeContainer: {
        flexDirection: 'column',
        marginBottom: 8,
    },
    dateTimeSubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    dateInput: {
        fontSize: 14,
        paddingHorizontal: 6,
        height: 35,
    },
});

export default ActivePatrolCard;