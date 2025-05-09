import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const HeaderTitleBoxID = ({ iconName, id }) => {
  return (
    <View style={styles.container(id)}>
      <Icon name={iconName} size={30} color="black" style={styles.icon} />
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
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'black',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 2,
    width: 'auto',
    justifyContent: 'center',
    paddingHorizontal: 50,
  }),
  icon: {
    marginRight: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  reportNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default HeaderTitleBoxID;