// RouteForm.styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        paddingTop: height * 0.02,
    },
    outerContainer: {
        backgroundColor: "#e6ddcc",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        borderWidth: 2,
        borderColor: "black",
        width: width * 0.45 * 0.6,
    },
    card: {
        width: '100%',
        padding: 15,
        backgroundColor: "white",
        borderRadius: 8,
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        height: 35,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
        borderRadius: 6,
        fontSize: 12,
        backgroundColor: "#f9f9f9",
    },
    sectorsContainer: {
        alignItems: "center",
        marginBottom: 15,
        position: "relative",
    },
    houseImage: {
        width: width * 0.70 * 0.4 * 0.6 * 0.6,
        height: width * 0.70 * 0.4 * 0.6 * 0.6,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 3,
        marginRight: 8,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: "#e6ddcc",
    },
    checkboxNumber: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    topLeft: {
        top: "10%",
        left: "10%",
    },
    topRight: {
        top: "10%",
        right: "10%",
    },
    bottomLeft: {
        bottom: "10%",
        left: "10%",
    },
    bottomRight: {
        bottom: "10%",
        right: "10%",
    },
    sectorName: {
        fontSize: 12,
    },
    pickerContainer: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
    },
    picker: {
        height: 35,
        width: "100%",
        fontSize: 12,
    },
    dateTimeLabel: {
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#333',
    },
    webDatePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, // Reduje el margen inferior
        position: 'relative',
        width: '100%',
    },
    webDateInput: {
        flex: 1,
        paddingRight: 30,
        height: 35,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 6,
        fontSize: 12,
        backgroundColor: "#f9f9f9",
        paddingHorizontal: 8, // Asegurar el padding horizontal
    },
    webDatePickerIcon: {
        position: 'absolute',
        right: 10,
        padding: 5,
    },
    webDatePickerPopover: {
        position: 'absolute',
        top: 40,
        left: 0,
        zIndex: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    finishButton: {
        backgroundColor: "#e6ddcc",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
        alignSelf: "center",
        marginTop: 20,
        borderColor: "black",
        borderWidth: 1,
    },
    finishButtonText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "black",
    },
});