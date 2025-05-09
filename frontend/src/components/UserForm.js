import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Keyboard, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Notification from './Notification';
import useUserFormLogic from './UserFormLogic';
import { styles } from './UserFormStyles';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { API_IP } from '../api/Config';
import axios from 'axios'; 
import useValidation from './Validations'; 

const isWeb = Platform.OS === 'web'; 

const UserForm = ({ onSubmit }) => { 
    const {
        formData,
        errors,
        showPasswordError,
        notification,
        telefonoLength,
        roleOptions,
        genderOptions,
        handleChange,
        handleSubmit: baseHandleSubmit,
        handleCloseNotification,
        showEmailAndPassword,
        showPhoneNumber,
    } = useUserFormLogic({ onSubmit });

    const {
        validateName,
        validatePhone: validatePhoneFormat,
        checkPhoneExists, 
        validateEmail: validateEmailFormat,
        checkEmailExists,
        validateGender,
        validatePassword,
    } = useValidation();

    const formRef = useRef(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState('');
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [phoneExistsError, setPhoneExistsError] = useState('');
    const [isCheckingPhone, setIsCheckingPhone] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const checkEmailAvailability = async (email) => {
        if (!email) {
            setEmailExistsError('');
            return;
        }
        setIsCheckingEmail(true);
        setEmailExistsError(''); 

        try {
            const response = await axios.post(`http://${API_IP}/Artemis/backend/login.php?action=checkEmail`, {
                correo: email,
            });

            if (response.data.exists) {
                setEmailExistsError('This email address is already registered.');
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setEmailExistsError('Connection error while checking email.');
        } finally {
            setIsCheckingEmail(false);
        }
    };

    const handleEmailChange = (text) => {
        handleChange('email', text);
        clearTimeout(emailCheckTimeout.current);
        emailCheckTimeout.current = setTimeout(() => {
            checkEmailAvailability(text);
        }, 500); 
    };

    const emailCheckTimeout = useRef(null);

    const checkPhoneAvailability = async (phone) => {
        if (!phone) {
            setPhoneExistsError('');
            return;
        }
        setIsCheckingPhone(true);
        setPhoneExistsError('');

        const isValidFormat = validatePhoneFormat(phone) === null;
        if (!isValidFormat) {
            setPhoneExistsError('Please enter a valid 10-digit phone number.');
            setIsCheckingPhone(false);
            return;
        }

        const exists = await checkPhoneExists(phone);

        if (exists === true) {
            setPhoneExistsError('This phone number is already registered.');
        } else if (exists === null) {
            setPhoneExistsError('Error checking phone number availability.');
        }
        setIsCheckingPhone(false);
    };

    const handlePhoneChange = (text) => {
        if (/^[0-9]*$/.test(text) && text.length <= 10) {
            handleChange('telefono', text);
            clearTimeout(phoneCheckTimeout.current);
            phoneCheckTimeout.current = setTimeout(() => {
                checkPhoneAvailability(text);
            }, 500);
        }
    };

    const phoneCheckTimeout = useRef(null);

    const handleSubmit = () => {
        if (emailExistsError) {
            Alert.alert('Error', 'This email address is already registered.');
            return;
        }
        if (phoneExistsError) {
            Alert.alert('Error', 'This phone number is already registered.');
            return;
        }
        baseHandleSubmit();
    };

    return (
        <View style={styles.container}>
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={handleCloseNotification}
            />
            <View style={styles.outerContainer}>
                <View style={styles.card}>
                    <View style={styles.roleContainer}>
                        {roleOptions.map((role) => (
                            <TouchableOpacity
                                key={role.value}
                                style={[
                                    styles.roleButton,
                                    formData.role === role.value && styles.roleButtonSelected,
                                ]}
                                onPress={() => handleChange('role', role.value)}
                            >
                                <Text style={styles.roleButtonText}>{role.display}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.fieldLabel}>Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaa"
                        value={formData.nombre}
                        onChangeText={(text) => handleChange('nombre', text)}
                    />
                    {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

                    <Text style={styles.fieldLabel}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaa"
                        value={formData.apellido_paterno}
                        onChangeText={(text) => handleChange('apellido_paterno', text)}
                    />
                    {errors.apellido_paterno && <Text style={styles.errorText}>{errors.apellido_paterno}</Text>}

                    <Text style={styles.fieldLabel}>Second Last Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.apellido_materno}
                        onChangeText={(text) => handleChange('apellido_materno', text)}
                    />
                    {errors.apellido_materno && <Text style={styles.errorText}>{errors.apellido_materno}</Text>}

                    <Text style={styles.fieldLabel}>Select Gender</Text>
                    {!isWeb ? (
                        <View style={styles.genderButtonContainer}>
                            {genderOptions.map((gender) => (
                                <TouchableOpacity
                                    key={gender.value}
                                    style={[
                                        styles.genderButton,
                                        formData.genero === gender.value && styles.genderButtonSelected,
                                    ]}
                                    onPress={() => handleChange('genero', gender.value)}
                                >
                                    <Text style={styles.genderButtonText}>{gender.display}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.genero}
                                style={styles.picker}
                                onValueChange={(itemValue) => handleChange('genero', itemValue)}
                            >
                                {genderOptions.map((gender) => (
                                    <Picker.Item key={gender.value} label={gender.display} value={gender.value} />
                                ))}
                            </Picker>
                        </View>
                    )}
                    {errors.genero && <Text style={styles.errorText}>{errors.genero}</Text>}

                    {showPhoneNumber ? (
                        <View style={{ marginBottom: errors.telefono || phoneExistsError ? 35 : 10 }}>
                            <Text style={styles.fieldLabel}>Phone number</Text>
                            <View style={mergedStyles.phoneInputContainer}>
                                <TextInput
                                    style={mergedStyles.phoneInput}
                                    value={formData.telefono}
                                    onChangeText={handlePhoneChange}
                                    keyboardType="phone-pad"
                                />
                                <Text style={mergedStyles.phoneLengthIndicator}>{telefonoLength}/10</Text>
                            </View>
                            {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
                            {phoneExistsError && <Text style={styles.errorText}>{phoneExistsError}</Text>}
                            {isCheckingPhone && <Text style={styles.infoText}>Verifying phone...</Text>}
                        </View>
                    ) : null}

                    {showEmailAndPassword ? (
                        <>
                            <Text style={styles.fieldLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="example@domain.com"
                                placeholderTextColor="#aaa"
                                value={formData.email}
                                onChangeText={handleEmailChange} 
                                keyboardType="email-address"
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            {emailExistsError && <Text style={styles.errorText}>{emailExistsError}</Text>}
                            {isCheckingEmail && <Text style={styles.infoText}>Verifying email...</Text>}

                            <Text style={styles.fieldLabel}>Password (Min. 8 characters)</Text>
                            <View style={mergedStyles.passwordContainer}>
                                <TextInput
                                    style={mergedStyles.passwordInput}
                                    value={formData.password}
                                    onChangeText={(text) => handleChange('password', text)}
                                    secureTextEntry={!isPasswordVisible}
                                />
                                <TouchableOpacity style={mergedStyles.eyeIcon} onPress={togglePasswordVisibility}>
                                <Icon name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                            {showPasswordError && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </>
                    ) : null}

                    <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const localStyles = StyleSheet.create({
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    phoneInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
        color: '#000',
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    phoneLengthIndicator: {
        position: 'absolute',
        right: 10,
        fontSize: 12,
        color: '#888',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#f9f9f9',
    },
    passwordInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        color: '#000',
        fontSize: 16,
    },
    infoText: {
        fontSize: 12,
        color: 'blue',
        marginTop: 5,
    },
});

const mergedStyles = StyleSheet.create({
    ...styles,
    ...localStyles,
});

export default UserForm;