import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, TextInput, ScrollView, Platform } from 'react-native';

const stylesMobile = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'column',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  filterGroup: {
    marginBottom: 10,
  },
  searchContainer: {
    marginBottom: 10,
  },
  filterLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
  },
  roleContainer: {
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 5,
  },
  filterButtonSelected: {
    backgroundColor: '#ccc',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  cardItemLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    width: 100, // Adjust width as needed
  },
  cardItemValue: {
    flex: 1,
  },
  moreButton: {
    backgroundColor: '#e6ddcc',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  moreButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

// ESTILOS PARA WEB (ESTILO 2)
const stylesWeb = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    width: '80%',
    marginVertical: 10,
    alignItems: 'center',
  },
  outerContainer: {
    backgroundColor: '#f5f1e6',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'black',
    width: '100%',
    height: 400,
  },
  container: {
    backgroundColor: "#f9f9f9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableBody: {
    flex: 1,
    height: 500,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  filterGroup: {
    flexDirection: 'row',
  },
  searchContainer: {
    flexDirection: 'column',
    marginRight: 10,
  },
  roleContainer: {
    flexDirection: 'column',
  },
  filterLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: 200,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  filterButtonSelected: {
    backgroundColor: '#ccc',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    alignItems: 'center',
  },
  headerCell: {
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    padding: 10,
    textAlign: 'center',
  },
  moreButton: {
    padding: 8,
    backgroundColor: '#e6ddcc',
    alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'center',
    height: 36,
  },
  moreButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
});

const UsersDataTable = ({ data, navigation, navigateTo, idKey }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const flatListRef = useRef(null);
  const [isWeb, setIsWeb] = useState(false);

  useEffect(() => {
    setIsWeb(Platform.OS === 'web');
  }, []);

  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];
  const screenWidth = Dimensions.get('window').width;
  const moreButtonWidth = 250;

  const translateFilterRole = (role) => {
    switch (role) {
      case 'supervisor':
        return 'Supervisor';
      case 'guardia':
        return 'Guard';
      case 'empleado':
        return 'General Employee';
      default:
        return null;
    }
  };

  const filteredData = data.filter(item => {
    const fullName = `${item['Name'] || ''} ${item['Last Name'] || ''} ${item.apellido_materno ? item.apellido_materno : ''}`.toLowerCase().trim();
    const nameMatch = fullName.includes(searchTerm.toLowerCase());

    const translatedSelectedRole = selectedRole ? translateFilterRole(selectedRole) : null;
    const roleMatch = translatedSelectedRole ? item['Role'] === translatedSelectedRole : true;

    return nameMatch && roleMatch;
  });

  const renderItemMobile = ({ item }) => (
    <View style={stylesMobile.card}>
      {headers.map((header) => (
        <View key={header} style={stylesMobile.cardItem}>
          <Text style={stylesMobile.cardItemLabel}>{header}:</Text>
          <Text style={stylesMobile.cardItemValue}>{item[header]}</Text>
        </View>
      ))}
      <TouchableOpacity
        style={stylesMobile.moreButton}
        onPress={() => {
          const employeeId = item['Employee ID'];
          if (employeeId) {
            navigation.navigate(navigateTo, { employeeId: employeeId });
          } else {
            console.warn('Employee ID not found in data item:', item);
          }
        }}
      >
        <Text style={stylesMobile.moreButtonText}>More Details</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeaderWeb = () => (
    <View style={stylesWeb.headerRow}>
      {headers.map((header) => (
        <Text key={header} style={[stylesWeb.headerCell, { width: (header === 'VIEW' ? moreButtonWidth : screenWidth / (headers.length + 1)), paddingRight: (header === 'Role' || header === 'VIEW' ? 30 : 10) }]}>
          {header}
        </Text>
      ))}
      {headers.length > 0 && (
        <Text style={[stylesWeb.headerCell, { width: moreButtonWidth, paddingRight: 30 }]}>VIEW</Text>
      )}
    </View>
  );

  const renderItemWeb = ({ item }) => (
    <View style={stylesWeb.row}>
      {headers.map((header) => (
        <Text key={header} style={[stylesWeb.cell, { width: (header === 'VIEW' ? moreButtonWidth : screenWidth / (headers.length + 1)) }]}>
          {item[header]}
        </Text>
      ))}
      {headers.length > 0 && (
        <TouchableOpacity
          style={[stylesWeb.moreButton, { width: moreButtonWidth }]}
          onPress={() => {
            const employeeId = item['Employee ID'];
            if (employeeId) {
              navigation.navigate(navigateTo, { employeeId: employeeId });
            } else {
              console.warn('Employee ID not found in data item:', item);
            }
          }}
        >
          <Text style={stylesWeb.moreButtonText}>More</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isWeb) {
    return (
      <View style={stylesWeb.mainContainer}>
        <View style={stylesWeb.filterContainer}>
          <View style={stylesWeb.filterGroup}>
            <View style={stylesWeb.searchContainer}>
              <Text style={stylesWeb.filterLabel}>Search</Text>
              <TextInput
                style={stylesWeb.searchInput}
                placeholder="SEARCH"
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
            <View style={stylesWeb.roleContainer}>
              <Text style={stylesWeb.filterLabel}>Role</Text>
              <View style={stylesWeb.filterButtons}>
                <TouchableOpacity style={[stylesWeb.filterButton, selectedRole === null && stylesWeb.filterButtonSelected]} onPress={() => setSelectedRole(null)}>
                  <Text>ALL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[stylesWeb.filterButton, selectedRole === 'supervisor' && stylesWeb.filterButtonSelected]} onPress={() => setSelectedRole('supervisor')}>
                  <Text>SUPERVISOR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[stylesWeb.filterButton, selectedRole === 'guardia' && stylesWeb.filterButtonSelected]} onPress={() => setSelectedRole('guardia')}>
                  <Text>GUARD</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[stylesWeb.filterButton, selectedRole === 'empleado' && stylesWeb.filterButtonSelected]} onPress={() => setSelectedRole('empleado')}>
                  <Text>EMPLOYEE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={stylesWeb.outerContainer}>
          <View style={stylesWeb.container}>
            <View style={stylesWeb.tableHeader}>
              {renderHeaderWeb()}
            </View>
            <View style={stylesWeb.tableBody}>
              <FlatList
                ref={flatListRef}
                data={filteredData || []}
                renderItem={renderItemWeb}
                keyExtractor={(item, index) => index.toString()}
                style={stylesWeb.flatList}
                contentContainerStyle={stylesWeb.flatListContent}
                showsVerticalScrollIndicator={true}
                scrollEventThrottle={16}
                decelerationRate="fast"
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
              />
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={stylesMobile.mainContainer}>
        <View style={stylesMobile.filterContainer}>
          <View style={stylesMobile.filterGroup}>
            <View style={stylesMobile.searchContainer}>
              <Text style={stylesMobile.filterLabel}>Search</Text>
              <TextInput
                style={stylesMobile.searchInput}
                placeholder="SEARCH"
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
            <View style={stylesMobile.roleContainer}>
              <Text style={stylesMobile.filterLabel}>Role</Text>
              <View style={stylesMobile.filterButtons}>
                <TouchableOpacity style={[stylesMobile.filterButton, selectedRole === null && stylesMobile.filterButtonSelected]} onPress={() => setSelectedRole(null)}>
                  <Text>ALL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[stylesMobile.filterButton, selectedRole === 'supervisor' && stylesMobile.filterButtonSelected]} onPress={() => setSelectedRole('supervisor')}>
                  <Text>SUPERVISOR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[stylesMobile.filterButton, selectedRole === 'guardia' && stylesMobile.filterButtonSelected]} onPress={() => setSelectedRole('guardia')}>
                  <Text>GUARD</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[stylesMobile.filterButton, selectedRole === 'empleado' && stylesMobile.filterButtonSelected]} onPress={() => setSelectedRole('empleado')}>
                  <Text>EMPLOYEE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={filteredData || []}
          renderItem={renderItemMobile}
          keyExtractor={(item, index) => index.toString()}
          style={stylesMobile.flatList}
          contentContainerStyle={stylesMobile.flatListContent}
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
          decelerationRate="fast"
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={11}
        />
      </View>
    );
  }
};

export default UsersDataTable;