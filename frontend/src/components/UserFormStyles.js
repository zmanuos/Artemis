import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const baseScaleMobile = 0.8;
const baseScaleWeb = 0.8;
const mobileOuterContainerWidthPercentage = 0.90;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#faf9f9',
        paddingTop: 20 * (isWeb ? baseScaleWeb : baseScaleMobile),
    },
    outerContainer: {
        backgroundColor: '#e6ddcc',
        borderRadius: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
        padding: 8 * (isWeb ? baseScaleWeb : baseScaleMobile),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 2 * (isWeb ? baseScaleWeb : baseScaleMobile),
        borderColor: 'black',
        maxWidth: isWeb ? 400 : width * mobileOuterContainerWidthPercentage * (1 / baseScaleMobile),
        width: isWeb ? 400 : width * mobileOuterContainerWidthPercentage * baseScaleMobile,
    },
    card: {
        width: '100%',
        padding: 20 * (isWeb ? baseScaleWeb : baseScaleMobile),
        backgroundColor: 'white',
        borderRadius: 8 * (isWeb ? baseScaleWeb : baseScaleMobile),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 2 * (isWeb ? baseScaleWeb : baseScaleMobile),
        borderColor: 'black',
        marginBottom: 8 * (isWeb ? baseScaleWeb : baseScaleMobile),
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f4f4f4',
        borderRadius: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
        marginBottom: 20 * (isWeb ? baseScaleWeb : baseScaleMobile),
        paddingVertical: 8 * (isWeb ? baseScaleWeb : baseScaleMobile),
    },
    roleButton: {
        paddingVertical: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
        paddingHorizontal: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
        alignItems: 'center',
        borderRadius: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
    },
    roleButtonSelected: {
        backgroundColor: '#e6ddcc',
    },
    roleButtonText: {
        fontSize: 12 * (isWeb ? baseScaleWeb : baseScaleMobile),
        fontWeight: 'bold',
    },
    fieldLabel: {
        fontSize: 16 * (isWeb ? baseScaleWeb : baseScaleMobile),
        fontWeight: 'bold',
        marginBottom: 5 * (isWeb ? baseScaleWeb : baseScaleMobile),
        color: '#333',
    },
    input: {
        height: 40 * (isWeb ? baseScaleWeb : baseScaleMobile),
        borderColor: '#ccc',
        borderWidth: 1 * (isWeb ? baseScaleWeb : baseScaleMobile),
        marginBottom: 2 * (isWeb ? baseScaleWeb : baseScaleMobile),
        paddingHorizontal: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
        paddingVertical: 8 * (isWeb ? baseScaleWeb : baseScaleMobile),
        borderRadius: 6 * (isWeb ? baseScaleWeb : baseScaleMobile),
        fontSize: 16 * (isWeb ? baseScaleWeb : baseScaleMobile),
        backgroundColor: '#f9f9f9',
    },
    inputError: {
        borderColor: 'red',
    },
    pickerContainer: {
        borderColor: '#ccc',
        borderWidth: 1 * (isWeb ? baseScaleWeb : baseScaleMobile),
        borderRadius: 6 * (isWeb ? baseScaleWeb : baseScaleMobile),
        marginBottom: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
        backgroundColor: '#f9f9f9',
    },
    picker: {
        height: 40 * (isWeb ? baseScaleWeb : baseScaleMobile),
        width: '100%',
        color: '#000',
        fontSize: 16 * (isWeb ? baseScaleWeb : baseScaleMobile),
        borderRadius: 6 * (isWeb ? baseScaleWeb : baseScaleMobile),
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
    },
    registerButton: {
        backgroundColor: '#e6ddcc',
        paddingVertical: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
        paddingHorizontal: 30 * (isWeb ? baseScaleWeb : baseScaleMobile),
        borderRadius: 25 * (isWeb ? baseScaleWeb : baseScaleMobile),
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1 * (isWeb ? baseScaleWeb : baseScaleMobile),
        borderColor: 'black',
        marginTop: 10,
    },
    registerButtonText: {
        fontSize: 16 * (isWeb ? baseScaleWeb : baseScaleMobile),
        fontWeight: 'bold',
        color: 'black',
    },
    genderButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
        paddingHorizontal: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
        backgroundColor: '#f4f4f4',
        borderRadius: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
        paddingVertical: 8 * (isWeb ? baseScaleWeb : baseScaleMobile),
    },
    genderButton: {
        paddingVertical: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
        paddingHorizontal: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
        alignItems: 'center',
        borderRadius: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
    },
    genderButtonSelected: {
        backgroundColor: '#e6ddcc',
    },
    genderButtonText: {
        fontSize: 12 * (isWeb ? baseScaleWeb : baseScaleMobile),
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12 * (isWeb ? baseScaleWeb : baseScaleMobile),
    },
    errorBorder: {
        borderColor: 'red',
    },
    phoneLengthIndicator: {
        fontSize: 12 * (isWeb ? baseScaleWeb : baseScaleMobile),
        color: '#777',
        textAlign: 'right',
        marginTop: 2,
    },
});