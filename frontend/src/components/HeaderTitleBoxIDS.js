import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const HeaderTitleBoxIDS = ({ iconName, id }) => {
  return (
    <View style={styles.container(id)}>
      <Icon name={iconName} size={24} color="black" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>PATROL REPORT</Text>
        <Text style={styles.reportNumber}>#{id}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: (id) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: id === 1 ? '#e0f7fa' : '#f5f1e6',
    padding: 12, // Reduced padding
    borderRadius: 10, // Reduced borderRadius
    borderWidth: 1, // Reduced borderWidth
    borderColor: 'black',
    alignSelf: 'center',
    marginTop: 10, // Reduced marginTop
    marginBottom: 2,
    width: 'auto',
    justifyContent: 'center',
    paddingHorizontal: 20, // Reduced paddingHorizontal
    marginBottom: 20,
  }),
  icon: {
    marginRight: 10, // Reduced marginRight
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    fontSize: 16, // Reduced fontSize
    fontWeight: 'bold',
  },
  reportNumber: {
    fontSize: 14, // Reduced fontSize
    fontWeight: 'bold',
    marginTop: 3, // Reduced marginTop
  },
});

export default HeaderTitleBoxIDS;