import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import AccessesNavigator from "./pages/Accesses";
import Patrols from "./pages/Patrols";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import VerifyOTP from "./VerifyOTP"; // Importa VerifyOTP
import LoginScreen from "./LoginScreen";
import RequestOTP from "./RequestOTP"; // Importa RequestOTP
import ResetPassword from "./ResetPassword"; // Importa VerifyOTP
import { SafeAreaView, View } from "react-native";
import { AuthProvider } from "./AuthContext"; // Importa el AuthProvider

const Stack = createStackNavigator();

const App = () => {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="LoginScreen" component={LoginScreenWrapper} />
                    <Stack.Screen name="Dashboard" component={DashboardWrapper} />
                    <Stack.Screen name="Accesses" component={AccessesWrapper} />
                    <Stack.Screen name="Patrols" component={PatrolsWrapper} />
                    <Stack.Screen name="Users" component={UsersWrapper} />
                    <Stack.Screen name="Settings" component={SettingsWrapper} />
                    {/* Agrega las nuevas pantallas aquí */}
                    <Stack.Screen name="RequestOTP" component={RequestOTP} options={{ title: 'Recuperar Contraseña', headerShown: true }} />
                    <Stack.Screen name="VerifyOTP" component={VerifyOTP} options={{ title: 'Verificar Código', headerShown: true }} />
                    <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: 'Reset Password', headerShown: true }} />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
};

// Wrappers:
const LoginScreenWrapper = () => {
    return (
        <View style={{ flex: 1 }}>
            <LoginScreen />
        </View>
    );
};

const DashboardWrapper = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header />
            <Dashboard />
        </SafeAreaView>
    );
};
const AccessesWrapper = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header />
            <AccessesNavigator />
        </SafeAreaView>
    );
};
const PatrolsWrapper = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header />
            <Patrols />
        </SafeAreaView>
    );
};
const UsersWrapper = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header />
            <Users />
        </SafeAreaView>
    );
};
const SettingsWrapper = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header />
            <Settings />
        </SafeAreaView>
    );
};

export default App;