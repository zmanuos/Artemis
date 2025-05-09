import React, { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Platform } from "react-native";

const isWeb = Platform.OS === 'web';
const { width: screenWidth } = Dimensions.get("window");

const GuardSelectionTable = ({ data, onGuardSelect, onContinue }) => {
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [filteredData, setFilteredData] = useState(data || []);

  useEffect(() => {
    console.log("GuardSelectionTable mounted");
    setFilteredData(data || []); // Inicializar filteredData con todos los datos
    return () => {
      console.log("GuardSelectionTable unmounted");
    };
  }, [data]);

  const headers = useMemo(
    () => (data && data.length > 0 ? Object.keys(data[0]).filter((header) => header !== "ROLE").map(header => {
      if (header === "nombre" || header === "Nombre" || header === "Name") return "Name";
      if (header === "apellido_paterno" || header === "Apellido Paterno" || header === "apellido paterna" || header === "LastName") return "Last Name";
      if (header === "apellido_materno" || header === "Apellido Materno" || header === "apellido materno" || header === "SecondLastName") return "Second Last Name";
      if (header === "ID") return "ID";
      return header;
    }) : []),
    [data]
  );

  const handleGuardSelect = (guard) => {
    setSelectedGuard(guard);
    onGuardSelect(guard);
  };

  const renderWebTable = () => (
    <>
      <View style={webStyles.headerRowWeb}>
        {headers.map((header) => (
          <Text key={header} style={[styles.headerCell, webStyles.headerCellWeb, { width: getCellWidthWeb() }]}>
            {header}
          </Text>
        ))}
      </View>
      <FlatList
        data={filteredData.length > 0 ? filteredData : [{ empty: true }]}
        renderItem={({ item }) => (item.empty ? renderEmptyList() : renderWebRow({ item }))}
        keyExtractor={(item, index) => (item.empty ? "empty" : index.toString())}
        style={webStyles.flatListWeb}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={11}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
        getItemLayout={(data, index) => ({
          length: 40,
          offset: 40 * index,
          index,
        })}
      />
    </>
  );

  const renderWebRow = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.row,
        webStyles.rowWeb,
        selectedGuard && selectedGuard.ID === item.ID && styles.selectedRow,
      ]}
      onPress={() => handleGuardSelect(item)}
    >
      {headers.map((header) => {
        let value;
        if (header === "Name") {
          value = item.nombre || item.Nombre || item.Name;
        } else if (header === "Last Name") {
          value = item["apellido_paterno"] || item["Apellido Paterno"] || item["apellido paterna"] || item.LastName;
        } else if (header === "Second Last Name") {
          value = item["apellido_materno"] || item["Apellido Materno"] || item["apellido materno"] || item.SecondLastName;
        } else {
          value = item[header];
        }
        return (
          <Text key={header} style={[styles.cell, webStyles.cellWeb, { width: getCellWidthWeb() }]}>
            {value}
          </Text>
        );
      })}
    </TouchableOpacity>
  );

  const getCellWidthWeb = () => {
    return screenWidth * 0.8 / headers.length;
  };

  const renderMobileCards = () => (
    <FlatList
      data={filteredData.length > 0 ? filteredData : [{ empty: true }]}
      renderItem={renderMobileCardItem}
      keyExtractor={(item, index) => (item.empty ? "empty" : index.toString())}
      ListEmptyComponent={renderEmptyList}
      keyboardShouldPersistTaps="handled"
    />
  );

  const renderMobileCardItem = ({ item }) => {
    if (item.empty) return null;
    return (
      <TouchableOpacity
        style={[mobileStyles.card, selectedGuard && selectedGuard.ID === item.ID && styles.selectedRow]}
        onPress={() => handleGuardSelect(item)}
      >
        {headers.map((header) => {
          let label;
          let value;
          if (header === "Name") {
            label = "Name";
            value = item.nombre || item.Nombre || item.Name;
          } else if (header === "Last Name") {
            label = "Last Name";
            value = item["apellido_paterno"] || item["Apellido Paterno"] || item["apellido paterna"] || item.LastName;
          } else if (header === "Second Last Name") {
            label = "Second Last Name";
            value = item["apellido_materno"] || item["Apellido Materno"] || item["apellido materno"] || item.SecondLastName;
          } else if (header === "ID") {
            label = "ID";
            value = item[header];
          } else {
            label = header;
            value = item[header];
          }
          return (
            <View key={header} style={mobileStyles.cardItem}>
              <Text style={mobileStyles.cardLabel}>{label}:</Text>
              <Text style={mobileStyles.cardValue}>{value}</Text>
            </View>
          );
        })}
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.noResultsText}>No matching results found.</Text>
    </View>
  );

  return (
    <View style={[styles.mainContainer, isWeb ? webStyles.mainContainerWeb : mobileStyles.mainContainerMobile]}>
      <View style={[styles.outerContainer, isWeb ? webStyles.outerContainerWeb : mobileStyles.outerContainerMobile]}>
        <View style={[styles.container, isWeb ? webStyles.containerWeb : mobileStyles.containerMobile]}>
          {isWeb ? renderWebTable() : renderMobileCards()}
        </View>
      </View>
      <TouchableOpacity
        style={[styles.continueButton, isWeb ? webStyles.continueButtonWeb : mobileStyles.continueButtonMobile]}
        onPress={() => {
          if (selectedGuard) {
            onContinue(selectedGuard);
          } else {
            console.error("No guard selected.");
          }
        }}
      >
        <Text style={[styles.continueButtonText, isWeb ? webStyles.continueButtonTextWeb : mobileStyles.continueButtonTextMobile]}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: "center",
    width: "70%",
    alignItems: "center",
    marginTop: 0,
  },
  outerContainer: {
    backgroundColor: "#f5f1e6",
    borderRadius: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginTop: 0,
  },
  container: {
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    height: 250,
    overflow: 'hidden',
    marginTop: 0,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  headerCell: {
    padding: 8,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  cell: {
    padding: 8,
    textAlign: "center",
    fontSize: 12,
  },
  flatList: {
    flexGrow: 1,
  },
  continueButton: {
    backgroundColor: "#e6ddcc",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: '50%',
    marginTop: 10,
  },
  continueButtonText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    textAlign: 'center',
  },
  selectedRow: {
    backgroundColor: "#e0e0e0",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 14,
    color: "gray",
  },
});

const webStyles = StyleSheet.create({
  mainContainerWeb: {
    width: '50%',
    marginTop: 0,
  },
  outerContainerWeb: {
    borderRadius: 10,
    padding: 10,
    marginTop: 0,
  },
  containerWeb: {
    height: 300,
    padding: 10,
    borderRadius: 8,
    marginTop: 0,
  },
  headerRowWeb: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  rowWeb: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  headerCellWeb: {
    padding: 10,
    fontSize: 14,
  },
  cellWeb: {
    padding: 10,
    fontSize: 13,
  },
  flatListWeb: {
    flexGrow: 1,
  },
  continueButtonWeb: {
    paddingVertical: 10,
    borderRadius: 15,
    marginTop: 15,
    width: '30%',
    borderWidth: 1,
    borderColor: "black",
  },
  continueButtonTextWeb: {
    fontSize: 16,
  },
});

const mobileStyles = StyleSheet.create({
  mainContainerMobile: {
    width: '95%',
    marginTop: 15,
  },
  outerContainerMobile: {
    borderRadius: 8,
    padding: 10,
    minHeight: 400,
  },
  searchInputMobile: {
    padding: 8,
    width: '250', // Increased width for mobile search input
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  containerMobile: {
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    overflow: 'visible',
    minHeight: 380, // Increased minimum height for the container of guard items
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  cardLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 16,
  },
  cardValue: {
    flex: 1,
    fontSize: 16,
  },
  continueButtonMobile: {
    backgroundColor: "#e6ddcc",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    width: '50%',
    borderWidth: 1,
    borderColor: "black",
  },
  continueButtonTextMobile: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    textAlign: 'center',
  },
});

export default GuardSelectionTable;