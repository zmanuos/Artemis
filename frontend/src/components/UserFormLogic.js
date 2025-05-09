import React, { useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import { createEmpleado } from '../api/Empleados';
import * as Crypto from 'expo-crypto'; 

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const roleOptions = [
    { display: 'SUPERVISOR', value: 'supervisor', code: '702' },
    { display: 'GUARD', value: 'guardia', code: '701' },
    { display: 'EMPLOYEE', value: 'empleado', code: '703' },
];

const genderOptions = [
    { display: 'Gender', value: '' },
    { display: 'Male', value: 'Male' },
    { display: 'Female', value: 'Female' },
];

const validateName = (name) => {
    if (!name.trim()) {
        return 'Name is required';
    }
    return null;
};

const validateLastName = (lastName) => {
    if (!lastName.trim()) {
        return 'Last Name is required';
    }
    return null;
};

const validateSecondLastName = (secondLastName) => {
    return null; 
};

const validateEmail = (email) => {
    if (!email.trim()) {
        return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Invalid email format';
    }
    return null;
};

const validatePassword = (password) => {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    return null;
};

const useUserFormLogic = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        role: roleOptions[0].value,
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        genero: '',
        email: '',
        password: '',
        telefono: '',
        codigo_puesto: roleOptions[0].code,
    });
    const [errors, setErrors] = useState({});
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [telefonoLength, setTelefonoLength] = useState(0);

    const handleChange = (name, value) => {
        let newCodePuesto = formData.codigo_puesto;
        if (name === 'role') {
            const selectedRole = roleOptions.find(option => option.value === value);
            if (selectedRole) {
                newCodePuesto = selectedRole.code;
            }
            setFormData({ ...formData, [name]: value, codigo_puesto: newCodePuesto });
            setErrors({ ...errors, [name]: null });
            return;
        }

        let processedValue = value;

        switch (name) {
            case 'nombre':
            case 'apellido_paterno':
            case 'apellido_materno':
                if (!/^[a-zA-Z\s]*$/.test(value) && value !== '') return;
                break;
            case 'telefono':
                if (!/^[0-9]*$/.test(value) && value !== '') return;
                if (value.length <= 10) processedValue = value;
                else return;
                setTelefonoLength(processedValue.length);
                break;
            case 'email':
                break;
            case 'password':
                setShowPasswordError(false);
                break;
            case 'genero':
                setFormData({ ...formData, [name]: value });
                setErrors({ ...errors, [name]: null });
                return;
            default:
                break;
        }

        setFormData({ ...formData, [name]: processedValue });
        setErrors({ ...errors, [name]: null });
    };

    const validateForm = () => {
        const newErrors = {
            nombre: validateName(formData.nombre),
            apellido_paterno: validateLastName(formData.apellido_paterno),
            apellido_materno: validateSecondLastName(formData.apellido_materno),
            telefono: formData.telefono.trim() ? (/^\d{10}$/.test(formData.telefono) ? null : 'Phone number must be 10 digits') : null,
            genero: formData.genero ? null : 'Please select a gender',
        };

        if (formData.role === 'guardia' || formData.role === 'empleado') {
            if (!formData.telefono.trim()) {
                newErrors.telefono = 'Phone number is required';
            } else if (!/^\d{10}$/.test(formData.telefono)) {
                newErrors.telefono = 'Phone number must be 10 digits';
            }
        }

        const showEmailAndPassword = formData.role !== 'guardia' && formData.role !== 'empleado';
        if (showEmailAndPassword) {
            newErrors.email = validateEmail(formData.email);
            newErrors.password = validatePassword(formData.password);
        } else {
            newErrors.email = null;
            newErrors.password = null;
        }

        setErrors(newErrors);
        setShowPasswordError(!!newErrors.password);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const empleadoData = {
                    nombre: formData.nombre,
                    apellido_paterno: formData.apellido_paterno,
                    apellido_materno: formData.apellido_materno,
                    codigo_puesto: formData.codigo_puesto,
                    telefono: formData.telefono,
                    genero: formData.genero,
                    rol: formData.role,
                };

                const showEmailAndPassword = formData.role !== 'guardia' && formData.role !== 'empleado';
                if (showEmailAndPassword && formData.email && formData.password) {
                    const hashedPassword = await Crypto.digestStringAsync(
                        Crypto.CryptoDigestAlgorithm.SHA256,
                        formData.password
                    );
                    empleadoData.email = formData.email;
                    empleadoData.password = hashedPassword;
                }

                const response = await createEmpleado(empleadoData);

                if (response && response.message === "Empleado creado") {
                    const selectedRole = roleOptions.find(option => option.value === formData.role);
                    let roleDisplayName = selectedRole ? selectedRole.display : 'User';
                    if (roleDisplayName) {
                        roleDisplayName = roleDisplayName.charAt(0).toUpperCase() + roleDisplayName.slice(1).toLowerCase();
                    }

                    setNotification({ message: `${roleDisplayName} successfully registered`, type: 'success' });
                    setFormData({
                        role: roleOptions[0].value,
                        nombre: '',
                        apellido_paterno: '',
                        apellido_materno: '',
                        genero: '',
                        email: '',
                        password: '',
                        telefono: '',
                        codigo_puesto: roleOptions[0].code,
                    });
                    setTelefonoLength(0);
                    setErrors({});
                    setShowPasswordError(false);
                    if (onSubmit) {
                        onSubmit(formData);
                    }
                } else {
                    setNotification({ message: "Error creating employee", type: 'error' });
                }
            } catch (error) {
                console.error("Error in handleSubmit:", error);
                setNotification({ message: "Error creating employee", type: 'error' });
            }
        } else {
            setNotification({ message: "Please correct the form errors", type: 'error' });
        }
    };

    const handleCloseNotification = () => {
        setNotification({ message: '', type: '' });
    };

    const showEmailAndPassword = formData.role !== 'guardia' && formData.role !== 'empleado';
    const showPhoneNumber = formData.role !== 'administrator' && formData.role !== 'supervisor';

    return {
        formData,
        errors,
        showPasswordError,
        notification,
        telefonoLength,
        roleOptions,
        genderOptions,
        handleChange,
        handleSubmit,
        handleCloseNotification,
        showEmailAndPassword,
        showPhoneNumber,
    };
};

export default useUserFormLogic;