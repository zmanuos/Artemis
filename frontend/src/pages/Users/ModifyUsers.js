import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import UsersDataTable from '../../components/UserDataTable'; 
import UserDetails from './UserDetails';
import { Ionicons } from "@expo/vector-icons";
import HeaderTitleBox from "../../components/HeaderTitleBox";
import { API_IP } from '../../api/Config';

const Stack = createStackNavigator();

const ModifyUsersScreen = ({ navigation }) => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://${API_IP}/Artemis/backend/api/models/empleados.php`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const message = `An error occurred: ${response.status}`;
          throw new Error(message);
        }

        const data = await response.json();
        const nonAdminUsers = data.filter(user => user.rol !== 'admin');
        setUsersData(nonAdminUsers);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const translateRole = (rol) => {
    switch (rol) {
      case 'supervisor':
        return 'Supervisor';
      case 'guardia':
        return 'Guard';
      case 'empleado':
        return 'General Employee';
      default:
        return rol; 
    }
  };

  const formattedUsersData = usersData.map(user => {
    return {
      'Employee ID': user.ID,
      'Name': user.nombre,
      'Last Name': user.apellido_paterno,
      'Role': translateRole(user.rol), 
    };
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading users: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <HeaderTitleBox iconName="user-edit" text="MANAGE USERS" />
      <UsersDataTable
        data={formattedUsersData}
        navigation={navigation}
        navigateTo="UserDetails"
        idKey="ID"
      />
    </View>
  );
};

const ModifyUsers = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UsersMain" component={ModifyUsersScreen} />
      <Stack.Screen
        name="UserDetails"
        component={UserDetails}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,

  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#ddd",
    borderRadius: 8,
    zIndex: 100,
    
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: "black",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ModifyUsers;