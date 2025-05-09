// RouteForm.js
import React, { useState, useEffect, lazy, Suspense } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { createRonda } from "../api/Ronda";
import { createRondaGuardia } from "../api/RondaGuardia";
import { styles as webStyles } from "./RouteForm.styles";
import { styles as mobileStyles } from "./RouteForm.styles.mobile";

// Importación dinámica para web
const DatePickerWeb = lazy(() =>
    Platform.OS === 'web'
        ? import('react-datepicker').then(module => {
            import('react-datepicker/dist/react-datepicker.css'); // Import CSS here
            return { default: module.default };
        })
        : Promise.resolve({ default: null }) // Retorna un componente nulo para otras plataformas
);

// Conditional import for mobile (Expo)
let DateTimePicker = null;
if (Platform.OS !== 'web') {
    ({ default: DateTimePicker } = require('@react-native-community/datetimepicker'));
}

const Notification = ({ message, type, onClose }) => {
    const notificationStyles = Platform.OS === 'web' ? webNotificationStyles : mobileNotificationStyles;
    const backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';

    return (
        <TouchableOpacity onPress={onClose} style={[notificationStyles.container, { backgroundColor }]}>
            <Text style={notificationStyles.text}>{message}</Text>
            <TouchableOpacity onPress={onClose} style={notificationStyles.closeButton}>
                <Text style={notificationStyles.closeButtonText}>&times;</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const RouteForm = ({ selectedGuard }) => {
    const navigation = useNavigation();
    const [routeName, setRouteName] = useState("");
    const [frequency, setFrequency] = useState("15 Minutes");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedSectors, setSelectedSectors] = useState({
        "Sector A": false,
        "Sector B": false,
        "Sector C": false,
        "Sector D": false,
    });
    const [sectorOrder, setSectorOrder] = useState([]);
    const [sectorInput, setSectorInput] = useState("");

    // Estados para controlar la visibilidad de los pickers de fecha y hora en móvil
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [startDateMode, setStartDateMode] = useState("datetime");
    const [endDateMode, setEndDateMode] = useState("datetime");

    // Estados para los mensajes de error de validación
    const [routeNameError, setRouteNameError] = useState("");
    const [startDateError, setStartDateError] = useState("");
    const [endDateError, setEndDateError] = useState("");

    // Estado para la notificación
    const [notification, setNotification] = useState(null);

    const frequencyOptions = ["15 Minutes", "30 Minutes", "1 Hour"];

    // Determinar qué estilos usar basados en la plataforma
    const currentStyles = Platform.OS === 'web' ? webStyles : mobileStyles;

    const toggleSector = (sector) => {
        setSelectedSectors((prev) => ({
            ...prev,
            [sector]: !prev[sector],
        }));
        setSectorOrder((prev) => {
            if (prev.includes(sector)) {
                return prev.filter((s) => s !== sector);
            } else {
                return [...prev, sector];
            }
        });
    };

    useEffect(() => {
        setSectorInput(sectorOrder.map((sector) => sector.slice(-1)).join(" -> "));
    }, [sectorOrder]);

    const validateForm = () => {
        let isValid = true;
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Compare only dates

        // Start date validation
        const selectedStartDate = new Date(startDate);
        selectedStartDate.setHours(0, 0, 0, 0);
        if (selectedStartDate < now) {
            setStartDateError("Start date cannot be before the current date.");
            isValid = false;
        } else {
            setStartDateError("");
        }

        // End date validation
        const selectedEndDate = new Date(endDate);
        selectedEndDate.setHours(0, 0, 0, 0);
        const selectedStartDateForEnd = new Date(startDate);
        selectedStartDateForEnd.setHours(0, 0, 0, 0);
        if (selectedEndDate < selectedStartDateForEnd) {
            setEndDateError("End date cannot be before the start date.");
            isValid = false;
        } else {
            setEndDateError("");
        }

        return isValid;
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
            navigation.navigate("Dashboard"); // Redirect to Dashboard after notification
        }, 2000); // Hide after 2 seconds and then redirect
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const rondaData = {
                nombre: routeName,
                hora_inicio: startDate.toISOString(),
                hora_fin: endDate.toISOString(),
                intervalos: frequency,
                secuencia: sectorOrder.map((sector) => sector.slice(-1)).join(" "),
            };

            const createdRonda = await createRonda(rondaData);
            console.log("Ronda creada:", createdRonda);

            if (!createdRonda || !createdRonda.codigo) {
                throw new Error("Error creating route, code not obtained.");
            }

            const guardId = selectedGuard.ID;
            if (!guardId) {
                throw new Error("selectedGuard object does not contain guard ID.");
            }

            const rondaGuardiaData = {
                codigo_ronda: createdRonda.codigo,
                id_guardia: guardId,
            };
            console.log("Data for ronda_guardia:", rondaGuardiaData);

            const createdRondaGuardia = await createRondaGuardia(rondaGuardiaData);
            console.log("Ronda-Guardia created:", createdRondaGuardia);

            showNotification(`Route created successfully with guard: ${selectedGuard.nombre} ${selectedGuard.apellido_paterno}`, 'success');
        } catch (error) {
            console.error("Error creating route or route-guard:", error);
            showNotification("There was an error creating the route.", 'error');
        }
    };

    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(Platform.OS === 'ios');
        setStartDate(currentDate);
        setStartDateError(""); // Clear error on date change
        validateForm(); // Re-validate on change for real-time feedback
    };

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(Platform.OS === 'ios');
        setEndDate(currentDate);
        setEndDateError(""); // Clear error on date change
        validateForm(); // Re-validate on change for real-time feedback
    };

    const showStartDatepicker = () => {
        setStartDateMode('datetime');
        setShowStartDatePicker(true);
    };

    const showEndDatepicker = () => {
        setEndDateMode('datetime');
        setShowEndDatePicker(true);
    };

    const handleWebStartDateChange = (date) => {
        setStartDate(date);
        setStartDateError(""); // Clear error on date change
        validateForm(); // Re-validate on change for real-time feedback
    };

    const handleWebEndDateChange = (date) => {
        setEndDate(date);
        setEndDateError(""); // Clear error on date change
        validateForm(); // Re-validate on change for real-time feedback
    };

    const handleRouteNameChange = (text) => {
        // Allow only letters (including ñ and accents), spaces
        const sanitizedText = text.replace(/[^a-zA-Z\u00C0-\u017F\s]/g, '');
        setRouteName(sanitizedText);
        if (/[^a-zA-Z\u00C0-\u017F\s]/.test(text)) {
            setRouteNameError("Route name cannot contain special characters or numbers.");
        } else {
            setRouteNameError("");
        }
    };

    const SectorCheckbox = ({ sector, label, style }) => {
        const isChecked = selectedSectors[sector];
        const order = sectorOrder.indexOf(sector) + 1;
        const displayOrder = isChecked && order > 0 ? `${order}` : '';

        return (
            <TouchableOpacity
                style={[currentStyles.checkboxContainer, style]}
                onPress={() => toggleSector(sector)}
            >
                <View style={[currentStyles.checkbox, isChecked && currentStyles.checkboxChecked]}>
                    {displayOrder !== '' && <Text style={currentStyles.checkboxNumber}>{displayOrder}</Text>}
                </View>
                <Text style={currentStyles.sectorName}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={currentStyles.container}>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <View style={currentStyles.outerContainer}>
                <View style={currentStyles.card}>
                    <Text style={currentStyles.label}>Route Name</Text>
                    <TextInput
                        style={currentStyles.input}
                        value={routeName}
                        onChangeText={handleRouteNameChange}
                    />
                    {routeNameError ? <Text style={currentStyles.errorText}>{routeNameError}</Text> : null}

                    <Text style={currentStyles.label}>Select Sectors:</Text>
                    <View style={currentStyles.sectorsContainer}>
                        <Image
                            source={require("../assets/images/maqueta.jpg")}
                            style={currentStyles.houseImage}
                            resizeMode="contain"
                        />
                        <SectorCheckbox sector="Sector A" label="Sector A" style={currentStyles.topLeft} />
                        <SectorCheckbox sector="Sector B" label="Sector B" style={currentStyles.topRight} />
                        <SectorCheckbox sector="Sector C" label="Sector C" style={currentStyles.bottomLeft} />
                        <SectorCheckbox sector="Sector D" label="Sector D" style={currentStyles.bottomRight} />
                    </View>

                    <Text style={currentStyles.label}>Selected Sectors</Text>
                    <TextInput
                        style={currentStyles.input}
                        value={sectorInput}
                        editable={false}
                    />

                    <Text style={currentStyles.label}>Frecuency by sector.</Text>
                    {Platform.OS === 'web' ? (
                        <View style={currentStyles.pickerContainer}>
                            <Picker
                                selectedValue={frequency}
                                style={currentStyles.picker}
                                onValueChange={(itemValue) => setFrequency(itemValue)}
                            >
                                {frequencyOptions.map((option) => (
                                    <Picker.Item key={option} label={option} value={option} />
                                ))}
                            </Picker>
                        </View>
                    ) : (
                        <View style={currentStyles.frequencyOptionsContainer}>
                            {frequencyOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        currentStyles.frequencyOptionButton,
                                        frequency === option && currentStyles.frequencyOptionButtonActive,
                                    ]}
                                    onPress={() => setFrequency(option)}
                                >
                                    <Text
                                        style={[
                                            currentStyles.frequencyOptionText,
                                            frequency === option && currentStyles.frequencyOptionTextActive,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <Text style={currentStyles.dateTimeLabel}>Start Date & Time:</Text>
                    {Platform.OS === 'web' ? (
                        <Suspense fallback={<Text>Loading calendar...</Text>}>
                            <DatePickerWeb
                                selected={startDate}
                                onChange={handleWebStartDateChange}
                                dateFormat="MMMM d, yyyy h:mm aa" // Formato legible: Mes día, año hora:minutos AM/PM
                                showTimeSelect
                                timeFormat="HH:mm"
                            />
                        </Suspense>
                    ) : (
                        Platform.OS !== 'web' && DateTimePicker && (
                            <View style={currentStyles.dateContainer}>
                                <TouchableOpacity style={currentStyles.dateTimeWrapper} onPress={showStartDatepicker}>
                                    <Text style={currentStyles.dateInput}>{startDate.toLocaleString('en-US')}</Text>
                                </TouchableOpacity>
                                {showStartDatePicker && (
                                    <DateTimePicker
                                        testID="startDatePicker"
                                        value={startDate}
                                        mode={startDateMode}
                                        is24Hour={false}
                                        display="default"
                                        onChange={onChangeStartDate}
                                    />
                                )}
                            </View>
                        )
                    )}
                    {startDateError ? <Text style={currentStyles.errorText}>{startDateError}</Text> : null}

                    <Text style={currentStyles.dateTimeLabel}>End Date & Time:</Text>
                    {Platform.OS === 'web' ? (
                        <Suspense fallback={<Text>Loading calendar...</Text>}>
                            <DatePickerWeb
                                selected={endDate}
                                onChange={handleWebEndDateChange}
                                dateFormat="MMMM d, yyyy h:mm aa" // Formato legible: Mes día, año hora:minutos AM/PM
                                showTimeSelect
                                timeFormat="HH:mm"
                            />
                        </Suspense>
                    ) : (
                        Platform.OS !== 'web' && DateTimePicker && (
                            <View style={currentStyles.dateContainer}>
                                <TouchableOpacity style={currentStyles.dateTimeWrapper} onPress={showEndDatepicker}>
                                    <Text style={currentStyles.dateInput}>{endDate.toLocaleString('en-US')}</Text>
                                </TouchableOpacity>
                                {showEndDatePicker && (
                                    <DateTimePicker
                                        testID="endDatePicker"
                                        value={endDate}
                                        mode={endDateMode}
                                        is24Hour={false}
                                        display="default"
                                        onChange={onChangeEndDate}
                                    />
                                )}
                            </View>
                        )
                    )}
                    {endDateError ? <Text style={currentStyles.errorText}>{endDateError}</Text> : null}

                    <TouchableOpacity style={currentStyles.finishButton} onPress={handleSubmit}>
                        <Text style={currentStyles.finishButtonText}>FINISH</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// Define estilos para mensajes de error
const errorTextStyle = {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
};

// Estilos para la notificación (adaptados para web y móvil) - MÁS PEQUEÑA
const webNotificationStyles = {
    container: {
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#4CAF50',
        color: 'white',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: 180, // Más pequeño
    },
    text: {
        flexGrow: 1,
        fontSize: 12, // Más pequeño
    },
    closeButton: {
        marginLeft: 8, // Más pequeño
    },
    closeButtonText: {
        color: 'white',
        fontSize: 14, // Más pequeño
        fontWeight: 'bold',
        lineHeight: 1,
    },
};

const mobileNotificationStyles = {
    container: {
        position: 'absolute',
        top: 30, // Ligeramente más abajo y más pequeño
        left: 15,
        right: 15,
        backgroundColor: '#4CAF50',
        color: 'white',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        zIndex: 1000,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        flexGrow: 1,
        fontSize: 12, // Más pequeño
    },
    closeButton: {
        marginLeft: 8, // Más pequeño
    },
    closeButtonText: {
        color: 'white',
        fontSize: 14, // Más pequeño
        fontWeight: 'bold',
        lineHeight: 1,
    },
};

// Aplicar los estilos de error a los estilos existentes
const styles = Platform.OS ==='web' ? webStyles : mobileStyles;
if (styles) {
    styles.errorText = errorTextStyle;
}

export default RouteForm;