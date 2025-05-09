// Frontend (React Native for Web): UserDetails.js
import React, { useState, useEffect, useRef } from 'react'; // Importamos useRef
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Alert, StyleSheet, Platform, Modal, Dimensions } from 'react-native';
import { getApiUrl } from '../../api/Config';
import HeaderTitleBox from '../../components/HeaderTitleBox';
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");
const baseMarginWeb = 0.02; // Reduced base margin for larger width
const webWidthPercentage = 0.4; // Increased width percentage for web

const UserDetails = ({ route, navigation }) => {
    const { employeeId } = route.params;
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedDetails, setUpdatedDetails] = useState({});
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [availableRfids, setAvailableRfids] = useState([]);
    const [loadingRfids, setLoadingRfids] = useState(false);
    const [errorRfids, setErrorRfids] = useState(null);
    const [showRfidModal, setShowRfidModal] = useState(false); // Changed to modal
    const [previousRfid, setPreviousRfid] = useState(null);
    const [selectedRole, setSelectedRole] = useState(userDetails?.rol || 'empleado');
    const [notification, setNotification] = useState("");
    const [notificationType, setNotificationType] = useState("");
    const [telefonoError, setTelefonoError] = useState("");
    const [contrasenaError, setContrasenaError] = useState("");
    const [telefonoLength, setTelefonoLength] = useState(0);

    // Usamos useRef para referenciar el contenedor del formulario
    const formContainerRef = useRef(null);

    const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

    const getNotificationBackgroundColor = (type) => {
        switch (type) {
            case 'success':
                return '#2E7D32'; // Stronger green
            case 'error':
                return '#D32F2F'; // Stronger red
            default:
                return '#1976D2'; // Stronger blue
        }
    };

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification("");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = `${getApiUrl('updateUserDetails')}?action=getEmployeeDetailsByRole`;
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `id_empleado=${employeeId}`,
                });
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                const data = await response.json();
                if (data && !data.message) {
                    setUserDetails(data);
                    setUpdatedDetails(data);
                    setPreviousRfid(data.rfid);
                    setSelectedRole(data.rol);
                } else {
                    setError(data?.message || 'Failed to fetch user details.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (employeeId) {
            fetchUserDetails();
        } else {
            setLoading(false);
        }
    }, [employeeId]);

    useEffect(() => {
        const fetchInactiveRfids = async () => {
            if (isEditing && (selectedRole === 'supervisor' || selectedRole === 'empleado' || selectedRole === 'guardia')) {
                setLoadingRfids(true);
                setErrorRfids(null);
                try {
                    const apiUrl = `${getApiUrl('updateUserDetails')}?action=getInactiveRfidCodes`;
                    const response = await fetch(apiUrl);
                    if (!response.ok) throw new Error(`Error: ${response.status}`);
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        let filteredRfids = data.filter(rfid => rfid.estado === 'Inactivo' || rfid.codigo_rfid === userDetails?.rfid);
                        filteredRfids = [{ codigo_rfid: '0', estado: 'Inactivo', tipo: selectedRole }, ...filteredRfids];
                        filteredRfids = filteredRfids.filter(rfid => rfid.tipo === selectedRole || rfid.codigo_rfid === '0' || rfid.codigo_rfid === userDetails?.rfid);
                        setAvailableRfids(filteredRfids);
                    } else {
                        setErrorRfids('Failed to fetch available RFID codes.');
                    }
                } catch (err) {
                    setErrorRfids(err.message);
                } finally {
                    setLoadingRfids(false);
                }
            } else {
                setAvailableRfids([]);
            }
        };
        fetchInactiveRfids();
    }, [isEditing, selectedRole, userDetails?.rfid]);

    const handleInputChange = (name, value) => {
        setUpdatedDetails(prev => ({ ...prev, [name]: value }));
        if (name === 'telefono') {
            if (/[^0-9]/.test(value)) {
                // No permitir caracteres no numéricos en tiempo real
                const numericValue = value.replace(/[^0-9]/g, '');
                setUpdatedDetails(prev => ({ ...prev, [name]: numericValue }));
                setTelefonoLength(numericValue.length);
            } else {
                setTelefonoLength(value.length);
            }
            // La validación de 10 dígitos se hará al enviar el formulario
        } else if (name === 'newPassword') {
            // La validación de mínimo 8 caracteres se hará al enviar el formulario
        }
    };
    const handleStartEdit = () => { setIsEditing(true); setUpdatedDetails({ ...userDetails }); setPreviousRfid(userDetails.rfid); };
    const handleCancelEdit = () => { setIsEditing(false); setUpdatedDetails(userDetails); setUpdateError(null); setShowRfidModal(false); setTelefonoError(""); setContrasenaError(""); }; // Hide modal on cancel and clear errors
    const handleRoleSelect = (role) => { setSelectedRole(role); setUpdatedDetails(prev => ({ ...prev, rol: role })); };

    const handleUpdateDetails = async () => {
        setUpdateLoading(true);
        setUpdateError(null);
        setTelefonoError("");
        setContrasenaError("");
        let hasError = false;

        if ((selectedRole === 'empleado' || selectedRole === 'guardia') && (updatedDetails.telefono && updatedDetails.telefono.length !== 10)) {
            setTelefonoError("Phone number must be 10 digits.");
            hasError = true;
        }

        if (selectedRole === 'supervisor' && updatedDetails.newPassword && updatedDetails.newPassword.length < 8) {
            setContrasenaError("Password must be at least 8 characters long.");
            hasError = true;
        }

        if (hasError) {
            setUpdateLoading(false);
            return;
        }

        const updatesToSend = {};
        let rfidUpdateSuccessful = true;

        const sendRfidUpdate = async (rfidToUpdate, employeeIdToAssign, rfidToRemove = null) => {
            const payload = { id_empleado: employeeIdToAssign };
            if (rfidToRemove !== null) {
                payload.rfid_a_remover = rfidToRemove;
            } else if (rfidToUpdate !== null && rfidToUpdate !== '0') {
                payload.codigo_rfid = rfidToUpdate;
            }

            console.log("Enviando actualización de RFID:", payload);

            try {
                const apiUrl = getApiUrl('actualizar_rfid');
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error(`Error updating RFID: ${response.status}`);
                const data = await response.json();
                console.log("Respuesta de actualización de RFID:", data);
                if (data?.message !== 'RFID updated successfully' && data?.message !== 'RFID successfully unassigned.') {
                    setUpdateError(data?.message || 'Failed to update RFID.');
                    setNotification(data?.message || 'Failed to update RFID.');
                    setNotificationType('error');
                    return false;
                } else {
                    setUserDetails(prev => ({ ...prev, rfid: payload.codigo_rfid === null ? null : payload.codigo_rfid }));
                    setUpdatedDetails(prev => ({ ...prev, rfid: payload.codigo_rfid === null ? null : payload.codigo_rfid }));
                    return true;
                }
            } catch (err) {
                setUpdateError(err.message);
                setNotification(err.message);
                setNotificationType('error');
                return false;
            }
        };

        let rfidToUpdateToSend = null;
        let rfidToRemoveToSend = null;

        if (updatedDetails.rfid === '0' && userDetails?.rfid) {
            rfidToRemoveToSend = userDetails.rfid;
        } else if (updatedDetails.rfid !== userDetails?.rfid && updatedDetails.rfid !== '0') {
            rfidToUpdateToSend = updatedDetails.rfid;
        }

        if (rfidToUpdateToSend !== null || rfidToRemoveToSend !== null) {
            rfidUpdateSuccessful = await sendRfidUpdate(rfidToUpdateToSend, employeeId, rfidToRemoveToSend);
        } else {
            rfidUpdateSuccessful = true; // No RFID change
        }

        if (selectedRole === 'supervisor') {
            if (updatedDetails.correo !== userDetails?.correo && updatedDetails.correo !== undefined) updatesToSend.correo = updatedDetails.correo;
            if (updatedDetails.newPassword?.length > 0) updatesToSend.newPassword = updatedDetails.newPassword;
        } else if (selectedRole === 'empleado' || selectedRole === 'guardia') {
            if (updatedDetails.telefono !== userDetails?.telefono && updatedDetails.telefono !== undefined) updatesToSend.telefono = updatedDetails.telefono;
        }
        if (updatedDetails.nombre !== userDetails?.nombre && updatedDetails.nombre !== undefined) updatesToSend.nombre = updatedDetails.nombre;
        if (updatedDetails.apellido_paterno !== userDetails?.apellido_paterno && updatedDetails.apellido_paterno !== undefined) updatesToSend.apellido_paterno = updatedDetails.apellido_paterno;
        if (updatedDetails.genero !== userDetails?.genero && updatedDetails.genero !== undefined) updatesToSend.genero = updatedDetails.genero;

        const otherUpdatesToSend = Object.keys(updatesToSend).reduce((obj, key) => {
            if (key !== 'rfid' && key !== 'newPassword') obj[key] = updatesToSend[key];
            return obj;
        }, {});

        if ((Object.keys(otherUpdatesToSend).length > 0 || (updatedDetails.newPassword?.length > 0 && selectedRole === 'supervisor')) && rfidUpdateSuccessful) {
            const apiUrl = `${getApiUrl('updateUserDetails')}?action=updateUserDetailsByRole`;
            try {
                const payload = { id_empleado: employeeId, rol: selectedRole, ...otherUpdatesToSend };
                if (updatedDetails.newPassword) {
                    payload.newPassword = updatedDetails.newPassword;
                }
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error(`Error updating details: ${response.status}`);
                const data = await response.json();
                if (data?.message === 'User details updated successfully') {
                    setNotification('User details updated successfully!');
                    setNotificationType('success');
                    setIsEditing(false);
                    const fetchUserDetails = async () => {
                        setLoading(true);
                        setError(null);
                        try {
                            const apiUrl = `${getApiUrl('updateUserDetails')}?action=getEmployeeDetailsByRole`;
                            const response = await fetch(apiUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: `id_empleado=${employeeId}`,
                            });
                            if (!response.ok) throw new Error(`Error fetching details: ${response.status}`);
                            const data = await response.json();
                            if (data && !data.message) {
                                setUserDetails(data);
                                setUpdatedDetails(data);
                                setPreviousRfid(data.rfid);
                                setSelectedRole(data.rol);
                            } else {
                                setError(data?.message || 'Failed to fetch user details.');
                            }
                        } catch (err) {
                            setError(err.message);
                        } finally {
                            setLoading(false);
                        }
                    };
                    if (Object.keys(otherUpdatesToSend).length > 0 || (updatedDetails.newPassword?.length > 0 && selectedRole === 'supervisor')) fetchUserDetails();
                    else setIsEditing(false);
                } else {
                    setUpdateError(data?.message || 'Failed to update user details.');
                    setNotification(data?.message || 'Failed to update user details.');
                    setNotificationType('error');
                }
            } catch (err) {
                setUpdateError(err.message);
                setNotification(err.message);
                setNotificationType('error');
            } finally {
                setUpdateLoading(false);
            }
        } else if (!updateError && (updatedDetails.rfid === userDetails?.rfid) && Object.keys(otherUpdatesToSend).length === 0 && !(updatedDetails.newPassword?.length > 0 && selectedRole === 'supervisor')) {
            Alert.alert('Info', 'No changes to update.');
            setIsEditing(false);
            setUpdateLoading(false);
        } else if (!updateError && (updatedDetails.rfid !== userDetails?.rfid) && Object.keys(otherUpdatesToSend).length === 0 && !(updatedDetails.newPassword?.length > 0 && selectedRole === 'supervisor') && rfidUpdateSuccessful) {
            setIsEditing(false);
            setUpdateLoading(false);
        } else if (!updateError && updatedDetails.rfid === '0' && userDetails?.rfid && rfidUpdateSuccessful && Object.keys(otherUpdatesToSend).length === 0 && !(updatedDetails.newPassword?.length > 0 && selectedRole === 'supervisor')) {
            setIsEditing(false);
            setUpdateLoading(false);
        } else {
            setUpdateLoading(false);
        }
    };

    const translateRole = (rol) => {
        switch (rol) {
            case 'supervisor': return 'Supervisor';
            case 'guardia': return 'Guard';
            case 'empleado': return 'General Employee';
            case 'admin': return 'Administrator';
            default: return rol;
        }
    };

    const handleRfidSelect = (rfid) => {
        const textToShow = rfid === '0' ? 'Remove' : rfid;
        console.log("RFID seleccionado:", rfid);
        setUpdatedDetails(prev => ({ ...prev, rfid: rfid === '0' ? '0' : rfid, rfidText: textToShow }));
        setShowRfidModal(false); // Close the modal
    };

    if (loading) return <View style={styles.centeredContainer}><Text>Loading...</Text><ActivityIndicator /></View>;
    if (error) return <ScrollView style={styles.errorContainer}><TouchableOpacity onPress={() => navigation.goBack()}><Text>Back</Text></TouchableOpacity><Text>Error loading user details: {error}</Text></ScrollView>;
    if (!userDetails && !employeeId) return (
        <ScrollView contentContainerStyle={styles.centeredScrollViewContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#333" />
                <Text style={[styles.backText, { color: '#333' }]}>Back</Text>
            </TouchableOpacity>
            <View style={styles.headerContainer}>
                <HeaderTitleBox iconName="user-plus" text="CREATE USER" />
            </View>

            <View style={styles.formOuterBorder}>
            <View style={[styles.formContainer, { padding: 12 }]}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>ROLE</Text>
                            <TextInput
                                style={[styles.input, styles.readOnlyInput]}
                                value={translateRole(selectedRole)}
                                editable={false}
                                readOnly={true}
                                selectTextOnFocus={false}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>NAME</Text>
                            <TextInput
                                style={[styles.input, styles.readOnlyInput]}
                                value={updatedDetails.nombre || ''}
                                onChangeText={(text) => handleInputChange('nombre', text)}
                                editable={false}
                                readOnly={true}
                                selectTextOnFocus={false}
                            />
                        </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>LAST NAME</Text>
                    <TextInput
                        style={[styles.input, styles.readOnlyInput]}
                        value={updatedDetails.apellido_paterno || ''}
                        onChangeText={(text) => handleInputChange('apellido_paterno', text)}
                        editable={false}
                        readOnly={true}
                        selectTextOnFocus={false}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>GENDER</Text>
                    <TextInput
                        style={[styles.input, styles.readOnlyInput]}
                        value={updatedDetails.genero || ''}
                        onChangeText={(text) => handleInputChange('genero', text)}
                        editable={false}
                        readOnly={true}
                        selectTextOnFocus={false}
                    />
                </View>
                {selectedRole === 'supervisor' && (
                    <>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL</Text>
                            <TextInput
                                style={styles.input}
                                value={updatedDetails.correo || ''}
                                onChangeText={(text) => handleInputChange('correo', text)}
                                keyboardType="email-address"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>PASSWORD (Min. 8 characters)</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry
                                onChangeText={(text) => handleInputChange('newPassword', text)}
                            />
                            {contrasenaError && <Text style={styles.errorText}>{contrasenaError}</Text>}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>RFID</Text>
                            <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowRfidModal(true)}>
                                <Text style={styles.dropdownButtonText}>{updatedDetails.rfid === '0' ? 'Remove' : updatedDetails.rfid || 'Select RFID'}</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
                {(selectedRole === 'empleado' || selectedRole === 'guardia') && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PHONE</Text>
                        <TextInput
                            style={styles.input}
                            value={updatedDetails.telefono || ''}
                            onChangeText={(text) => handleInputChange('telefono', text)}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                        <Text style={styles.inputIndicator}>{telefonoLength}/10</Text>
                        {telefonoError && <Text style={styles.errorText}>{telefonoError}</Text>}
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.updateButton, { backgroundColor: '#155724', borderColor: '#155724' }]} onPress={handleUpdateDetails} disabled={updateLoading}>
                        <Text style={styles.buttonText}>{updateLoading ? 'Registering...' : 'Register'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        <Modal
            visible={showRfidModal}
            transparent={true}
            animationType="none"
        >
            <View style={styles.modalOverlay}>
                <View
                    style={[styles.modalContainer, { width: '60%', maxWidth: 300, maxHeight: '60%' }]}>
                    <Text style={styles.modalTitle}>Select RFID</Text>
                    <ScrollView style={styles.modalScrollView}>
                        {
                            loadingRfids ? (
                                <ActivityIndicator size="large" color="#007bff" />
                            ) : errorRfids ? (
                                <Text style={styles.errorText}>{errorRfids}</Text>
                            ) : (
                                availableRfids.map((rfid) => (
                                    <TouchableOpacity
                                        key={rfid.codigo_rfid}
                                        style={styles.modalItem}
                                        onPress={() => handleRfidSelect(rfid.codigo_rfid)}
                                    >
                                        <Text style={styles.modalItemText}>
                                            {rfid.codigo_rfid === '0' ? 'Remove RFID' : rfid.codigo_rfid}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            )
                        }
                    </ScrollView>
                    <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: '#a3916f' }]} onPress={() => setShowRfidModal(false)}>
                        <Text style={styles.modalCloseButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </ScrollView>
);

return (
    <ScrollView contentContainerStyle={styles.centeredScrollViewContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={[styles.backText, { color: '#333' }]}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContainer}>
            <HeaderTitleBox iconName="user-circle" text="USER DETAILS" />
        </View>
        {notification ? (
            <View style={[styles.notificationBanner, { backgroundColor: getNotificationBackgroundColor(notificationType) }]}>
                <Text style={styles.notificationText}>{notification}</Text>
            </View>
        ) : null}
        <View style={styles.formOuterBorder}>
            <View style={[styles.formContainer, { padding: 12 }]}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>ROLE</Text>
                    <TextInput
                        style={[styles.input, styles.readOnlyInput]}
                        value={translateRole(selectedRole)}
                        editable={false}
                        readOnly={true}
                        selectTextOnFocus={false}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>NAME</Text>
                    <TextInput
                        style={[styles.input, styles.readOnlyInput]}
                        value={userDetails?.nombre || ''}
                        editable={false}
                        readOnly={true}
                        selectTextOnFocus={false}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>LAST NAME</Text>
                    <TextInput
                        style={[styles.input, styles.readOnlyInput]}
                        value={userDetails?.apellido_paterno || ''}
                        editable={false}
                        readOnly={true}
                        selectTextOnFocus={false}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>GENDER</Text>
                    <TextInput
                        style={[styles.input, styles.readOnlyInput]}
                        value={userDetails?.genero || ''}
                        editable={false}
                        readOnly={true}
                        selectTextOnFocus={false}
                    />
                </View>
                {(selectedRole === 'supervisor' || selectedRole === 'empleado' || selectedRole === 'guardia') && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>RFID</Text>
                        {isEditing ? (
                            <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowRfidModal(true)}>
                                <Text style={styles.dropdownButtonText}>{updatedDetails.rfid === '0' ? 'Remove' : updatedDetails.rfid || userDetails.rfid || 'Select RFID'}</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={[styles.inputText, styles.readOnlyInput]}>
                                <Text>{userDetails.rfid || 'N/A'}</Text>
                            </View>
                        )}
                    </View>
                )}

                {selectedRole === 'supervisor' && (
                    <>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL</Text>
                            <TextInput
                                style={[styles.input, isEditing ? {} : styles.readOnlyInput]}
                                value={isEditing ? updatedDetails.correo : userDetails.correo}
                                onChangeText={(text) => isEditing && handleInputChange('correo', text)}
                                keyboardType="email-address"
                                editable={isEditing}
                                readOnly={!isEditing}
                                selectTextOnFocus={isEditing}
                            />
                        </View>
                        {isEditing && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>PASSWORD</Text>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry
                                    onChangeText={(text) => handleInputChange('newPassword', text)}
                                    editable={isEditing}
                                    selectTextOnFocus={isEditing}
                                />
                                {contrasenaError && <Text style={styles.errorText}>{contrasenaError}</Text>}
                            </View>
                        )}
                    </>
                )}
                {(selectedRole === 'empleado' || selectedRole === 'guardia') && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PHONE</Text>
                        <TextInput
                            style={[styles.input, isEditing ? {} : styles.readOnlyInput]}
                            value={isEditing ? updatedDetails.telefono : userDetails.telefono}
                            onChangeText={(text) => isEditing && handleInputChange('telefono', text)}
                            keyboardType="phone-pad"
                            editable={isEditing}
                            readOnly={!isEditing}
                            selectTextOnFocus={isEditing}
                            maxLength={10}
                        />
                        {isEditing && <Text style={styles.inputIndicator}>{telefonoLength}/10</Text>}
                        {telefonoError && <Text style={styles.errorText}>{telefonoError}</Text>}
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    {isEditing ? (
                        <>
                            <TouchableOpacity style={[styles.updateButton, { backgroundColor: '#155724', borderColor: '#155724', width: '60%' }]} onPress={handleUpdateDetails} disabled={updateLoading}>
                                <Text style={styles.buttonText}>{updateLoading ? 'Updating...' : 'UPDATE'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: '#8b0000', borderColor: '#8b0000', width: '60%' }]} onPress={handleCancelEdit}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity style={[styles.editButton, { backgroundColor: '#a3916f', width: '60%' }]} onPress={handleStartEdit}>
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>

        <Modal
            visible={showRfidModal}
            transparent={true}
            animationType="none"
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { width: '60%', maxWidth: 300, maxHeight: '60%' }]}>
                    <Text style={styles.modalTitle}>Select RFID</Text>
                    <ScrollView style={styles.modalScrollView}>
                        {loadingRfids ? (
                            <ActivityIndicator size="large" color="#007bff" />
                        ) : errorRfids ? (
                            <Text style={styles.errorText}>{errorRfids}</Text>
                        ) : (
                            availableRfids.map((rfid) => (
                                <TouchableOpacity
                                    key={rfid.codigo_rfid}
                                    style={styles.modalItem}
                                    onPress={() => handleRfidSelect(rfid.codigo_rfid)}
                                >
                                    <Text style={styles.modalItemText}>
                                        {rfid.codigo_rfid === '0' ? 'Remove RFID' : rfid.codigo_rfid}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                    <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: '#a3916f' }]} onPress={() => setShowRfidModal(false)}>
                        <Text style={styles.modalCloseButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </ScrollView>
);
};

const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6ddcc',
    },
    centeredScrollViewContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f8f8',
        width: '100%',
    },
    scrollView: {
        width: '100%',
        maxWidth: 300,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        position: "absolute",
        top: 16,
        left: 20,
        backgroundColor: "#ddd",
        borderRadius: 8,
        zIndex: 999,
    },
    backText: {
        marginLeft: 5,
        fontSize: 16,
        color: "black",
    },
    headerContainer: {
        width: '100%',
        paddingVertical: 20,
        alignItems: 'center',
    },
    formOuterBorder: {
        backgroundColor: '#e6ddcc',
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: '90%', // Un poco más pequeño
        maxWidth: 350, // Un poco más pequeño
        padding: 10,
    },
    formContainer: {
        padding: 12, // Un poco más pequeño
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    inputGroup: {
        marginBottom: 12, // Un poco más pequeño
    },
    label: {
        fontSize: 14, // Un poco más pequeño
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8, // Un poco más pequeño
        fontSize: 14, // Un poco más pequeño
        color: '#333',
        backgroundColor: '#fff',
    },
    readOnlyInput: {
        backgroundColor: '#ddd',
        color: '#777',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 15, // Un poco más pequeño
    },
    updateButton: {
        backgroundColor: '#155724',
        borderColor: '#155724',
        paddingVertical: 10, // Un poco más pequeño
        borderRadius: 5,
        alignItems: 'center',
        width: '60%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14, // Un poco más pequeño
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#a3916f',
        borderRadius: 5,
        paddingVertical: 10, // Un poco más pequeño
        alignItems: 'center',
        width: '60%',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 14, // Un poco más pequeño
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#8b0000',
        borderColor: '#8b0000',
        borderRadius: 5,
        paddingVertical: 10, // Un poco más pequeño
        alignItems: 'center',
        marginTop: 8, // Un poco más pequeño
        width: '60%',
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8, // Un poco más pequeño
        fontSize: 14, // Un poco más pequeño
        color: '#333',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    dropdownButtonText: {
        fontSize: 14,
        color: '#333',
    },
    inputText: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        fontSize: 14,
        color: '#777',
        backgroundColor: '#ddd',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    modalScrollView: {
        maxHeight: '70%',
        width: '100%',
        marginBottom: 15,
    },
    modalItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        width: '100%',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    modalCloseButton: {
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        width: '60%',
    },
    modalCloseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8d7da',
    },
    errorText: {
        color: '#721c24',
        fontSize: 16,
    },
    notificationContainerWeb: {
        position: 'absolute',
        top: 0,
        left: '50%', // Centrar horizontalmente
        transform: [{ translateX: '-50%' }], // Ajustar para el centrado real
        backgroundColor: '#1976D2',
        paddingVertical: 10,
        paddingHorizontal: 20, // Añadir un poco de padding horizontal
        borderRadius: 5, // Opcional: añadir bordes redondeados
        zIndex: 1000,
        maxWidth: '80%', // Hacerla menos ancha (ajusta este valor según necesites)
        alignItems: 'center', // Centrar el texto dentro del contenedor
        justifyContent: 'center', // Centrar el texto dentro del contenedor
    },
    notificationTextWeb: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center', // Asegurar que el texto esté centrado
    },
    notificationMobileTop: {
        marginTop: 0, // Adjust if needed to avoid overlap with other top elements
    },
    notificationTextMobile: {
        fontSize: 14,
    },
});

export default UserDetails;