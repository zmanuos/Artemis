import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const HeaderTitleBox = ({ iconName, text }) => {
  return (
    <View style={styles.container}>
      <Icon name={iconName} size={30} color="black" style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f1e6',
    padding: 20, // Aumentamos el padding
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'black',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 2,
    width: 'auto',
    justifyContent: 'center',
    paddingHorizontal: 50, // Aumentamos el padding horizontal
  },
  icon: {
    marginRight: 20, // Aumentamos el margen derecho del icono
  },
  text: {
    fontSize: 20, // Aumentamos el tamaño de la fuente
    fontWeight: 'bold',
  },
});

export default HeaderTitleBox;