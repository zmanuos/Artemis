import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';

const InfoTable = ({ title = "DEFAULT TITLE", data = [] }) => {
  const isMobile = Platform.OS !== "web";
  
  // Obtenemos las claves de los objetos para generar automáticamente los encabezados
  const tableHeaders = data.length > 0 ? Object.keys(data[0]) : [];

  const renderItem = ({ item }) => (
    <View style={isMobile ? styles.mobileRow : styles.row}>
      {tableHeaders.map((key, index) => (
        <Text key={index} style={isMobile ? styles.mobileCell : styles.cell}>{item[key]}</Text>
      ))}
    </View>
  );

  return (
    <View style={isMobile ? styles.mobileOuterContainer : styles.outerContainer}>
      <View style={isMobile ? styles.mobileContainer : styles.container}>
        <View style={isMobile ? styles.mobileTableHeader : styles.tableHeader}>
          {tableHeaders.map((header, index) => (
            <Text key={index} style={isMobile ? styles.mobileHeaderCell : styles.headerCell}>{header.toUpperCase()}</Text>
          ))}
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <Text style={isMobile ? styles.mobileTitle : styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: 700,
    height: 320,
    backgroundColor: "#f5f1e6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "black",
    paddingBottom: 20,
  },
  container: {
    width: 700,
    height: 270,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "black",
    elevation: 5,
    paddingTop: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
    marginBottom: 5,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 20,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
  },

  // Estilos para versión móvil
  mobileOuterContainer: {
    marginBottom: 30,
    width: 320,
    height: 230,
    backgroundColor: "#f5f1e6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    paddingBottom: 10,
  },
  mobileContainer: {
    width: 320,
    height: 210,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    elevation: 3,
  },
  mobileTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
  },
  mobileTableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 2,
    paddingTop: 2,
    marginBottom: 3,
  },
  mobileHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 10,
  },
  mobileRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  mobileCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
  },
});

export default InfoTable;
