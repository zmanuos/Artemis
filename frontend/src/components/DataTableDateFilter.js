import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions,
    TextInput, Modal, TouchableWithoutFeedback, Platform
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const isMobile = Platform.OS !== 'web';

const DataTableDateFilter = ({ data, navigation, navigateTo }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const flatListRef = useRef(null);

    const headers = data && data.length > 0 ? Object.keys(data[0]) : [];

    const filteredData = data.filter(item => {
        const nameMatch = item.NAME ? item.NAME.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const dateMatch = filterDate ? item.DATE === filterDate : true;
        return nameMatch && dateMatch;
    });

    const handleDateSelect = (day) => {
        const formattedDate = moment(day.dateString).format('DD/MM/YYYY');
        setFilterDate(formattedDate);
        setShowCalendar(false);
    };

    const dismissModal = () => {
        setShowCalendar(false);
    };

    const calculateColumnWidth = (header) => {
        if (header === 'VIEW') {
            return 100; // Menos ancho para la columna VIEW
        }
        const baseWidth = (windowWidth * 0.6) / (headers.length + 1); // Contenedor menos ancho
        return Math.max(baseWidth, 80);
    };

    const renderHeader = () => (
        <View style={styles.headerRow}>
            {headers.map((header) => (
                <Text key={header} style={[styles.headerCell, { width: calculateColumnWidth(header), fontSize: 13 }]}>
                    {header}
                </Text>
            ))}
            {headers.length > 0 && (
                <Text style={[styles.headerCell, { width: 100, fontSize: 13 }]}>VIEW</Text>
            )}
        </View>
    );

    const renderItemWeb = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.row}>
                {headers.map((header) => (
                    <Text key={header} style={[styles.cell, { width: calculateColumnWidth(header), fontSize: 13, textAlign: 'center' }]}>
                        {item[header]}
                    </Text>
                ))}
                {headers.length > 0 && (
                    // Versión Web (renderItemWeb)
                    <TouchableOpacity style={[styles.moreButton, { width: 100 }]} onPress={() => {
                        console.log("ID being passed (Web):", item.codigo); // <--- LOG AÑADIDO AQUÍ (WEB)
                        navigation.navigate(navigateTo, { id: item.codigo });
                    }}>
                        <Text style={[styles.moreButtonText, { fontSize: 13 }]}>More</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderItemMobile = ({ item }) => (
        <View style={mobileStyles.card}>
            {headers.map((header) => (
                <View key={header} style={mobileStyles.cardItem}>
                    <Text style={mobileStyles.cardLabel}>{header}:</Text>
                    <Text style={mobileStyles.cardValue}>{item[header]}</Text>
                </View>
            ))}
            <TouchableOpacity style={mobileStyles.moreButton} onPress={() => {
                console.log("ID being passed (Mobile):", item.codigo); // <--- LOG AÑADIDO AQUÍ (MOBILE)
                navigation.navigate(navigateTo, { id: item.codigo });
            }}>
                <Text style={mobileStyles.moreButtonText}>Details</Text>
            </TouchableOpacity>
        </View>
    );

    const renderMobileLayout = () => (
        <View style={mobileStyles.container}>
            <View style={mobileStyles.filterContainer}>
                <View style={mobileStyles.searchContainer}>
                    <Text style={mobileStyles.filterLabel}>Search</Text>
                    <TextInput
                        style={mobileStyles.searchInput}
                        placeholder="SEARCH"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>
                <View style={mobileStyles.dateContainer}>
                    <Text style={mobileStyles.filterLabel}>Filter Date</Text>
                    <TouchableOpacity style={mobileStyles.dateInput} onPress={() => setShowCalendar(true)}>
                        <Text>{filterDate || 'Select Date'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredData || []}
                renderItem={renderItemMobile}
                keyExtractor={(item, index) => index.toString()}
            />

            <Modal visible={showCalendar} transparent={true} onRequestClose={dismissModal}>
                <TouchableWithoutFeedback onPress={dismissModal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.calendarContainer}>
                            <Calendar
                                onDayPress={handleDateSelect}
                                hideExtraDays
                                style={styles.calendar}
                                theme={{
                                    todayTextColor: '#81694e',
                                    todayTextStyle: { fontWeight: 'bold' },
                                    selectedDayTextColor: '#ffffff',
                                    selectedDayBackgroundColor: '#bfa182',
                                    arrowColor: '#bfa182',
                                    arrowStyle: { padding: 10 },
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );

    const renderWebLayout = () => (
        <View style={webStyles.container}>
            <View style={webStyles.contentWrapper}>
                <View style={webStyles.filterContainer}>
                    <View style={webStyles.filterGroup}>
                        <View style={webStyles.searchContainer}>
                            <Text style={webStyles.filterLabel}>Search</Text>
                            <TextInput
                                style={webStyles.searchInput}
                                placeholder="SEARCH"
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                            />
                        </View>
                        <View style={webStyles.dateContainer}>
                            <Text style={webStyles.filterLabel}>Filter</Text>
                            <TouchableOpacity style={webStyles.dateInput} onPress={() => setShowCalendar(true)}>
                                <Text>{filterDate || 'Select Date'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.outerContainer}>
                    <View style={[styles.tableContainer, { maxHeight: windowHeight * 0.4, width: '100%' }]}>
                        <FlatList
                            ref={flatListRef}
                            data={filteredData || []}
                            renderItem={renderItemWeb}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={renderHeader}
                            stickyHeaderIndices={[0]}
                            style={styles.flatList}
                        />
                    </View>
                </View>

                <Modal visible={showCalendar} transparent={true}>
                    <TouchableWithoutFeedback onPress={dismissModal}>
                        <View style={styles.modalContainer}>
                            <View style={styles.calendarContainer}>
                                <Calendar
                                    onDayPress={handleDateSelect}
                                    hideExtraDays
                                    style={styles.calendar}
                                    theme={{
                                        todayTextColor: '#81694e',
                                        todayTextStyle: { fontWeight: 'bold' },
                                        selectedDayTextColor: '#ffffff',
                                        selectedDayBackgroundColor: '#bfa182',
                                        arrowColor: '#bfa182',
                                        arrowStyle: { padding: 10 },
                                    }}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </View>
    );

    return isMobile ? renderMobileLayout() : renderWebLayout();
};

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
        paddingHorizontal: 0,
        width: '100%',
    },
    filterGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'column',
        marginRight: 15,
    },
    dateContainer: {
        flexDirection: 'column',
    },
    filterLabel: {
        fontWeight: 'bold',
        marginBottom: 3,
        fontSize: 12,
        textAlign: 'left',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        width: 110,
        borderRadius: 3,
        fontSize: 12,
        textAlign: 'left',
    },
    dateInput: {
        width: 90,
        height: 25,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        paddingHorizontal: 5,
        borderRadius: 3,
        fontSize: 12,
        textAlign: 'left',
    },
    outerContainer: {
        backgroundColor: '#f5f1e6',
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        width: '100%',
    },
    tableContainer: {
        backgroundColor: "#f9f9f9",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        overflowY: 'auto',
        maxHeight: windowHeight * 0.4,
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 3,
        borderRadius: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 1,
        backgroundColor: 'white',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 6,
        alignItems: 'center',
    },
    headerCell: {
        padding: 6,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 13,
    },
    cell: {
        padding: 6,
        fontSize: 13,
        textAlign: 'center',
    },
    moreButton: {
        padding: 4,
        backgroundColor: '#e6ddcc',
        alignItems: 'center',
        borderRadius: 3,
    },
    moreButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 13,
    },
    flatList: {
        marginTop: 6,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    calendarContainer: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
    },
    calendar: {
        width: '100%',
    },
});

const mobileStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    searchContainer: {
        marginBottom: 0,
        flexDirection: 'column',
        width: '45%',
    },
    dateContainer: {
        marginBottom: 0,
        flexDirection: 'column',
        width: '45%',
    },
    filterLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'left',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        fontSize: 14,
    },
    dateInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        paddingHorizontal: 12,
        borderRadius: 5,
        fontSize: 14,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    cardItem: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    cardLabel: {
        fontWeight: 'bold',
        marginRight: 8,
        width: 90,
        fontSize: 14,
    },
    cardValue: {
        flex: 1,
        fontSize: 14,
    },
    moreButton: {
        backgroundColor: '#bfa182',
        paddingVertical: 8,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 8,
    },
    moreButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

const webStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    contentWrapper: {
        width: '80%',
        maxWidth: 1000,
        alignItems: 'flex-start',
    },
    filterContainer: {
        marginBottom: 10,
    },
    filterGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'column',
        marginRight: 15,
    },
    dateContainer: {
        flexDirection: 'column',
    },
    filterLabel: {
        fontWeight: 'bold',
        marginBottom: 3,
        fontSize: 12,
        textAlign: 'left',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        width: 110,
        borderRadius: 3,
        fontSize: 12,
        textAlign: 'left',
    },
    dateInput: {
        width: 90,
        height: 25,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        paddingHorizontal: 5,
        borderRadius: 3,
        fontSize: 12,
        textAlign: 'left',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    calendarContainer: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
    },
    calendar: {
        width: '100%',
    },
});

export default DataTableDateFilter;