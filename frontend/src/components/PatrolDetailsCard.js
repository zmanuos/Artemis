import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const isWeb = Platform.OS === 'web';
const { width: screenWidth } = Dimensions.get('window');

const PatrolDetailsCard = ({ patrolData }) => {
  if (isWeb) {
    console.log('patrolData en PatrolDetailsCard (Web):', patrolData);
  } else {
    console.log('patrolData en PatrolDetailsCard (Mobile):', patrolData);
  }
  // Función para obtener el valor o 'N/A' si es undefined o null
  const getValue = (value) => (value !== undefined && value !== null ? String(value) : 'N/A');

  // Formatear el campo sectors con validación
  const formattedSectors = getValue(patrolData?.sectors)
    .split(' ')
    .map(sector => sector.trim())
    .filter(sector => sector !== '')
    .join(' -> ');

  // Estado local para la frecuencia
  const [localFrequency, setLocalFrequency] = useState(getValue(patrolData?.frequency));

  useEffect(() => {
    setLocalFrequency(getValue(patrolData?.frequency));
  }, [patrolData?.frequency]);

  const webStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    outerContainer: {
      backgroundColor: '#e6ddcc',
      borderRadius: 10,
      padding: 20,
      borderWidth: 2,
      borderColor: 'black',
    },
    card: {
      width: 800,
      padding: 30,
      backgroundColor: 'white',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    fieldContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    fieldIcon: {
      marginRight: 10,
      width: 24,
      alignItems: 'center',
    },
    fieldText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginRight: 10,
      width: 140,
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      paddingHorizontal: 8,
      borderRadius: 6,
      fontSize: 16,
      backgroundColor: '#f9f9f9',
    },
    dateTimeContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: 15,
    },
    dateTimeSubContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 30,
    },
    dateInput: {
      fontSize: 16,
      paddingHorizontal: 6,
      height: 35,
      width: 180,
    },
    endText: {
      marginRight: 10,
      width: 50,
    },
  });

  const mobileStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
      backgroundColor: '#f5f5f5',
      marginTop: 10,
      paddingHorizontal: 15,
    },
    outerContainer: {
      backgroundColor: '#e6ddcc',
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: 'black',
    },
    card: {
      width: '100%',
      padding: 12,
      backgroundColor: 'white',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    fieldContainer: {
      flexDirection: 'column',
      marginBottom: 10,
    },
    fieldIcon: {
      marginRight: 8,
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fieldText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    input: {
      height: 35,
      borderColor: '#ccc',
      borderWidth: 1,
      paddingHorizontal: 8,
      borderRadius: 6,
      fontSize: 16,
      backgroundColor: '#f9f9f9',
    },
    dateTimeContainer: {
      flexDirection: 'column',
      marginBottom: 10,
    },
    dateTimeSubContainer: {
      flexDirection: 'column',
      marginBottom: 8,
    },
    dateInput: {
      height: 35,
      borderColor: '#ccc',
      borderWidth: 1,
      paddingHorizontal: 8,
      borderRadius: 6,
      fontSize: 16,
      backgroundColor: '#f9f9f9',
    },
    endText: {
      fontWeight: 'bold',
      marginBottom: 5,
      fontSize: 16,
    },
    startText: {
      fontWeight: 'bold',
      marginBottom: 5,
      fontSize: 16,
    },
    dateTimeSeparator: {
      height: 0,
    },
  });

  const currentStyles = isWeb ? webStyles : mobileStyles;

  return (
    <View style={currentStyles.container}>
      <View style={currentStyles.outerContainer}>
        <View style={currentStyles.card}>
          <View style={currentStyles.fieldContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
              <Ionicons name="map" size={20} color="black" style={{ marginRight: 6 }} />
              <Text style={currentStyles.fieldText}>ROUTE NAME</Text>
            </View>
            <TextInput
              style={currentStyles.input}
              value={getValue(patrolData?.nombre)}
              editable={false}
            />
          </View>

          <View style={currentStyles.fieldContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
              <Ionicons name="person" size={20} color="black" style={{ marginRight: 6 }} />
              <Text style={currentStyles.fieldText}>GUARD</Text>
            </View>
            <TextInput
              style={currentStyles.input}
              value={getValue(patrolData?.guard)}
              editable={false}
            />
          </View>

          <View style={currentStyles.dateTimeContainer}>
            {isWeb ? (
              <>
                <View style={currentStyles.dateTimeSubContainer}>
                  <Ionicons name="time" size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={currentStyles.fieldText}>START</Text>
                  <TextInput
                    style={[currentStyles.input, currentStyles.dateInput]}
                    value={getValue(patrolData?.start)}
                    editable={false}
                  />
                </View>
                <View style={currentStyles.dateTimeSubContainer}>
                  <Text style={[currentStyles.fieldText, currentStyles.endText]}>END</Text>
                  <TextInput
                    style={[currentStyles.input, currentStyles.dateInput]}
                    value={getValue(patrolData?.end)}
                    editable={false}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={currentStyles.dateTimeSubContainer}>
                  <Text style={currentStyles.startText}>START</Text>
                  <TextInput
                    style={currentStyles.dateInput}
                    value={getValue(patrolData?.start)}
                    editable={false}
                  />
                </View>
                <View style={currentStyles.dateTimeSubContainer}>
                  <Text style={currentStyles.endText}>END</Text>
                  <TextInput
                    style={currentStyles.dateInput}
                    value={getValue(patrolData?.end)}
                    editable={false}
                  />
                </View>
              </>
            )}
          </View>

          <View style={currentStyles.fieldContainer} key={`frequency-${patrolData?.frequency}`}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
              <Ionicons name="refresh" size={20} color="black" style={{ marginRight: 6 }} />
              <Text style={currentStyles.fieldText}>FREQUENCY</Text>
            </View>
            <TextInput
              style={currentStyles.input}
              value={getValue(localFrequency)}
              editable={false}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PatrolDetailsCard;