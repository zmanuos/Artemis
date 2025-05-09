// RouteForm.styles.mobile.js
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingTop: Platform.OS === 'ios' ? 12 : 6, // Aún más reducido el padding top
    width: '100%',
  },
  outerContainer: {
    backgroundColor: "#e6ddcc",
    borderRadius: 8,
    padding: 12, // Reducir un poco el padding
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1,
    borderColor: "black",
    width: '92%', // Aumentar un poco más el ancho
    maxWidth: 340, // Aumentar un poco más el ancho máximo
        paddingVertical: 20,

  },
  card: {
    width: '100%',
    padding: 12, // Reducir un poco el padding
    backgroundColor: "white",
    borderRadius: 6,
    marginBottom: 8, // Reducir un poco el margen
    alignItems: 'center',
  },
  label: {
    fontSize: 11, // Reducir un poco el tamaño de la fuente
    marginBottom: 2, // Reducir un poco el margen
    fontWeight: 'bold',
    color: '#555',
    alignSelf: 'flex-start',
    width: '100%',
  },
  input: {
    height: 22, // Reducir la altura
    borderColor: "#bbb",
    borderWidth: 0.8,
    marginBottom: 5, // Reducir un poco el margen
    paddingHorizontal: 5, // Reducir el padding
    borderRadius: 4,
    fontSize: 9, // Reducir el tamaño de la fuente
    backgroundColor: "#f2f2f2",
    width: '100%',
  },
  sectorsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6, // Reducir un poco el margen
    position: "relative",
    width: '55%', // Reducir un poco el ancho
    aspectRatio: 1,
  },
  houseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    paddingVertical: 2, // Reducir el padding
    paddingHorizontal: 3, // Reducir el padding
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 0.5,
    elevation: 1,
  },
  checkbox: {
    width: 20, // Reducir el tamaño
    height: 20, // Reducir el tamaño
    borderWidth: 0.8, // Reducir el borde
    borderColor: '#333',
    borderRadius: 2,
    marginRight: 2, // Reducir el margen
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',

  },
  checkboxChecked: {
    backgroundColor: "#A5D6A7",
  },
  checkboxNumber: {
    fontSize: 7, // Reducir el tamaño
    fontWeight: 'bold',
  },
  topLeft: {
    top: '30%',
    right:  '150',
  },
  topRight: {
    top: '5%',
    right: '5%',
  },
  bottomLeft: {
    bottom: '0%',
    left: '%',
  },
  bottomRight: {
    bottom: '%',
    right: '-40%',
  },
  sectorName: {
    fontSize: 8, // Reducir el tamaño
  },
  pickerContainer: {
    borderColor: "#bbb",
    borderWidth: 0.8,
    borderRadius: 4,
    marginBottom: 6, // Reducir el margen
    backgroundColor: "#f2f2f2",
    width: '100%',
  },
  picker: {
    height: 22, // Reducir la altura
    width: "100%",
    fontSize: 9, // Reducir el tamaño de la fuente
    
  },
  dateContainer: {
    flexDirection: "column",
    marginBottom: 8, // Reducir el margen
    width: '100%',
  },
  dateTimeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4, // Reducir el margen
  },
  dateTimeLabel: {
    fontSize: 11, // Reducir el tamaño de la fuente
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 2,
    alignSelf: 'flex-start',
    width: '100%',
  },
  dateInput: {
    flex: 1,
    borderColor: "#bbb",
    borderWidth: 0.8,
    borderRadius: 4,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 5, // Reducir el padding
    height: 25, // Reducir la altura
    fontSize: 9, // Reducir el tamaño de la fuente
    marginRight: 3, // Reducir el espacio
    justifyContent: 'center',
  },
  timeInput: {
    flex: 1,
    borderColor: "#bbb",
    borderWidth: 0.8,
    borderRadius: 4,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 5, // Reducir el padding
    height: 25, // Reducir la altura
    fontSize: 9, // Reducir el tamaño de la fuente
    marginLeft: 3, // Reducir el espacio
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  finishButton: {
    backgroundColor: "#e6ddcc",
    paddingVertical: 5, // Reducir el padding
    paddingHorizontal: 8, // Reducir el padding
    borderRadius: 8, // Reducir el radio
    alignSelf: "center",
    marginTop: 6, // Reducir el margen
    borderColor: "black",
    borderWidth: 0.8,
  },
  finishButtonText: {
    fontSize: 9, // Reducir el tamaño de la fuente
    fontWeight: "bold",
    color: "black",
  },
  frequencyOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6, // Reducir el margen
    width: '100%',
  },
  frequencyOptionButton: {
    backgroundColor: '#ddd',
    paddingVertical: 5, // Reducir el padding
    paddingHorizontal: 6, // Reducir el padding
    borderRadius: 5, // Reducir el radio
    borderWidth: 0.8, // Reducir el borde
    borderColor: '#ccc',
  },
  frequencyOptionButtonActive: {
    backgroundColor: "#e6ddcc",
    borderColor: 'black',
  },
  frequencyOptionText: {
    fontSize: 9, // Reducir el tamaño de la fuente
    color: '#333',
  },
  frequencyOptionTextActive: {
    fontWeight: 'bold',
    color: 'black',
  },
});