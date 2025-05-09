import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { getLoginUrl } from './Config'; // Importa la función

const LoginScreen = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleLogin = async () => {
    try {
      const loginUrl = getLoginUrl(); // Obtiene la URL de login desde config.js

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();

      if (data.message === 'Inicio de sesión exitoso') {
        if (data.rol === 'admin') {
          navigation.navigate('AdminScreen');
        } else if (data.rol === 'empleado') {
          navigation.navigate('EmpleadoScreen');
        } else {
          navigation.navigate('DefaultScreen');
        }
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error en el login:', error);
      Alert.alert('Error', 'Error al iniciar sesión');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;