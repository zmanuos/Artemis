import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const UserDetailsView = ({ userData }) => {
  return (
    <View style={styles.container}>
      <View style={styles.outerContainer}>
        <View style={styles.card}>
          {/* Mostrar los datos del usuario */}
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userData.NAME}</Text>

            <Text style={styles.label}>Last Name:</Text>
            <Text style={styles.value}>{userData["LAST NAME"]}</Text>

            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{userData.GENDER}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userData.EMAIL}</Text>

            <Text style={styles.label}>Password:</Text>
            <Text style={styles.value}>{userData.PASSWORD}</Text>

            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value}>{userData.ROLE}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#faf9f9',
    paddingTop: height * 0.05,
  },
  outerContainer: {
    backgroundColor: '#e6ddcc',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'black',
  },
  card: {
    width: width * 0.3,
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'black',
    marginBottom: 10,
  },
  detailContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default UserDetailsView;