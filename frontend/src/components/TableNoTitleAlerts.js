import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TextInput, Platform } from 'react-native';
import { Button, Provider } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { parse, format } from 'date-fns';

const TableNoTitle = React.memo(({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [pickerVisible, setPickerVisible] = useState(false);

  const [englishHeaders, setEnglishHeaders] = useState({});
  const previousHeaders = useRef(null);

  const headers = useMemo(() => {
    return data && data.length > 0 ? Object.keys(data[0]) : [];
  }, [data]);

  const screenWidth = Dimensions.get('window').width;
  const isMobile = Platform.OS !== 'web';

  const initialEnglishHeaders = {
    name: 'Name',
    lastname: 'Lastname',
    area: 'Area',
    fecha: 'Date',
    time: 'Time',
    role: 'Role',
    // Añade aquí cualquier otro encabezado que pueda aparecer en tus datos
  };

  useEffect(() => {
    const currentHeaders = JSON.stringify(headers);
    const prevHeaders = JSON.stringify(previousHeaders.current);

    if (currentHeaders !== prevHeaders) {
      const translatedHeaders = {};
      headers.forEach(header => {
        translatedHeaders[header] = initialEnglishHeaders[header] || header;
      });
      setEnglishHeaders(translatedHeaders);
      previousHeaders.current = headers;
    }
  }, [headers, initialEnglishHeaders]);

  const parseDate = dateString => {
    return parse(dateString, 'dd/MM/yyyy', new Date());
  };

  const filteredData = data.filter(item => {
    const searchText = searchTerm.toLowerCase();

    const nameMatch = item.name ? item.name.toLowerCase().includes(searchText) : false;
    const lastnameMatch = item["lastname"] ? item["lastname"].toLowerCase().includes(searchText) : false;
    const areaMatch = item.area ? item.area.toLowerCase().includes(searchText) : false;
    const roleMatch = item.role ? item.role.toLowerCase().includes(searchText) : false;

    const itemDate = parseDate(item.fecha);
    const startMatch = dateRange.startDate ? dateRange.startDate <= itemDate : true;
    const endMatch = dateRange.endDate ? dateRange.endDate >= itemDate : true;

    return (nameMatch || lastnameMatch || areaMatch || roleMatch) && startMatch && endMatch;
  });

  const handleDateRangeConfirm = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate });
    setPickerVisible(false);
  };

  const clearDateRange = () => setDateRange({ startDate: null, endDate: null });

  const formatDate = date => {
    if (!date) return null;
    return format(date, 'dd/MM/yyyy');
  };

  const formatTime = timeString => {
    if (!timeString) return null;
    return timeString;
  };

  const renderTableHeader = () => (
    <View style={styles.headerRow}>
      {headers.map(header => (
        <Text key={header} style={[styles.headerCell, { width: screenWidth / headers.length }]}>
          {(englishHeaders[header] || header).toUpperCase()}
        </Text>
      ))}
    </View>
  );

  const renderTableRow = ({ item }) => (
    <View style={styles.row}>
      {headers.map(header => (
        <Text key={header} style={[styles.cell, { width: screenWidth / headers.length }]}>
          {header === 'fecha' ? formatDate(parseDate(item[header])) : header === 'time' ? formatTime(item[header]) : item[header]}
        </Text>
      ))}
    </View>
  );

  const renderMobileCard = ({ item }) => (
    <View style={mobileStyles.card}>
      {headers.map(header => (
        <View key={header} style={mobileStyles.cardItem}>
          <Text style={mobileStyles.cardLabel}>{englishHeaders[header] || header}: </Text>
          <Text style={mobileStyles.cardValue}>
            {header === 'fecha' ? formatDate(parseDate(item[header])) : header === 'time' ? formatTime(item[header]) : item[header]}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <Provider>
      <View style={isMobile ? mobileStyles.mainContainer : styles.mainContainer}>
        <View style={isMobile ? mobileStyles.filterContainer : styles.filterContainer}>
          <View style={isMobile ? mobileStyles.searchContainer : styles.searchContainer}>
            <Text style={isMobile ? mobileStyles.filterLabel : styles.filterLabel}>Search</Text>
            <TextInput
              style={isMobile ? mobileStyles.searchInput : styles.searchInput}
              placeholder="Search by Name, Lastname, or Area"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          <View style={isMobile ? mobileStyles.dateContainer : styles.dateContainer}>
            <Text style={isMobile ? mobileStyles.filterLabel : styles.filterLabel}>Date Range</Text>
            <Button
              mode="contained"
              style={[
                isMobile ? mobileStyles.dateButtonMobile : styles.dateButton,
                { backgroundColor: '#f5f1e6', borderWidth: 2, borderColor: 'black', paddingVertical: 4, paddingHorizontal: 8 },
              ]}
              labelStyle={[isMobile && { fontSize: 12 }, { color: 'black' }]}
              onPress={() => setPickerVisible(true)}
            >
              {dateRange.startDate && dateRange.endDate
                ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
                : 'Select Date Range'}
            </Button>
            <DatePickerModal
              mode="range"
              visible={pickerVisible}
              onDismiss={() => setPickerVisible(false)}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onConfirm={handleDateRangeConfirm}
            />
            {(dateRange.startDate || dateRange.endDate) && (
              <Button mode="text" style={isMobile ? mobileStyles.clearButton : styles.clearButton} onPress={clearDateRange}>
                Clear
              </Button>
            )}
          </View>
        </View>

        <View style={isMobile ? mobileStyles.outerContainer : styles.outerContainer}>
          <View style={isMobile ? mobileStyles.scrollableContainer : styles.scrollableContainer}>
            <FlatList
              data={filteredData || []}
              renderItem={isMobile ? renderMobileCard : renderTableRow}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={!isMobile ? renderTableHeader : null}
              stickyHeaderIndices={!isMobile ? [0] : []}
              style={isMobile ? mobileStyles.flatList : styles.flatList}
            />
          </View>
        </View>
      </View>
    </Provider>
  );
});

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    width: '80%',
    marginVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  outerContainer: {
    backgroundColor: '#f5f1e6',
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    width: '100%',
  },
  scrollableContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    maxHeight: 360,
    overflow: 'hidden',
  },
  flatList: {
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  searchContainer: {
    flex: 1,
    marginRight: 15,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  filterLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  dateButton: {
    marginTop: 5,
    backgroundColor: '#faf9f9', // Este estilo ya no se aplicará directamente
  },
  clearButton: {
    marginTop: 5,
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
});

const mobileStyles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    width: '95%',
    marginVertical: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  outerContainer: {
    backgroundColor: '#f5f1e6',
    borderRadius: 8,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  scrollableContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    maxHeight: '100%',
    overflow: 'auto',
  },
  flatList: {
    marginTop: 5,
  },
  filterContainer: {
    flexDirection: 'column',
    marginBottom: 8,
    paddingHorizontal: 5,
    width: '100%',
  },
  searchContainer: {
    marginBottom: 10,
  },
  dateContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  filterLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 3,
    color: '#555',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    padding: 8,
    fontSize: 12,
    backgroundColor: '#fff',
  },
  dateButtonMobile: {
    marginTop: 3,
    backgroundColor: '#eee', // Este estilo ahora se aplica condicionalmente
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  clearButton: {
    marginTop: 3,
    fontSize: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 8,
  },
  cardItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  cardLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginRight: 5,
    width: 80,
  },
  cardValue: {
    fontSize: 14,
    color: '#555',
    flexShrink: 1,
  },
});

export default TableNoTitle;