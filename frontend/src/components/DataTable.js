import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, TextInput } from 'react-native';

const DataTable = ({ data, navigation, navigateTo, idKey }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];
  const screenWidth = Dimensions.get('window').width;
  const moreButtonWidth = 250;

  const filteredData = data.filter(item => {
    const fullName = `${item.NAME} ${item["LAST NAME"]}`.toLowerCase();
    const nameMatch = fullName.includes(searchTerm.toLowerCase());
    const roleMatch = selectedRole ? item.ROLE === selectedRole : true;
    return nameMatch && roleMatch;
  });

  const renderHeader = () => (
    <View style={styles.headerRow}>
      {headers.map((header) => (
        <Text key={header} style={[styles.headerCell, { width: (header === 'VIEW' ? moreButtonWidth : screenWidth / (headers.length + 1)), paddingRight: (header === 'ROLE' || header === 'VIEW' ? 30 : 10) }]}>
          {header}
        </Text>
      ))}
      {headers.length > 0 && (
        <Text style={[styles.headerCell, { width: moreButtonWidth, paddingRight: 30 }]}>VIEW</Text>
      )}
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      {headers.map((header) => (
        <Text key={header} style={[styles.cell, { width: (header === 'VIEW' ? moreButtonWidth : screenWidth / (headers.length + 1)) }]}>
          {item[header]}
        </Text>
      ))}
      {headers.length > 0 && (
        <TouchableOpacity style={[styles.moreButton, { width: moreButtonWidth }]} onPress={() => navigation.navigate(navigateTo, item)}>
          <Text style={styles.moreButtonText}>More</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.filterContainer}>
        <View style={styles.filterGroup}>
          <View style={styles.searchContainer}>
            <Text style={styles.filterLabel}>Search</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="SEARCH"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <View style={styles.roleContainer}>
            <Text style={styles.filterLabel}>Role</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity style={[styles.filterButton, selectedRole === null && styles.filterButtonSelected]} onPress={() => setSelectedRole(null)}>
                <Text>ALL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterButton, selectedRole === 'Supervisor' && styles.filterButtonSelected]} onPress={() => setSelectedRole('Supervisor')}>
                <Text>SUPERVISOR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterButton, selectedRole === 'Guard' && styles.filterButtonSelected]} onPress={() => setSelectedRole('Guard')}>
                <Text>GUARD</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterButton, selectedRole === 'Employee' && styles.filterButtonSelected]} onPress={() => setSelectedRole('Employee')}>
                <Text>EMPLOYEE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <FlatList
            data={filteredData || []}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={renderHeader}
            stickyHeaderIndices={[0]}
            style={styles.flatList}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    width: '80%',
    marginVertical: 10,
    alignItems: 'center',
  },
  outerContainer: {
    backgroundColor: '#f5f1e6',
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    width: '100%',
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
  container: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
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
  },
  moreButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  flatList: {
    marginTop: 10,
  },
});

export default DataTable;