import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Customer = () => {
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('SERVICES')
            .onSnapshot(querySnapshot => {
                const servicesList = [];
                querySnapshot.forEach(documentSnapshot => {
                    servicesList.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setServices(servicesList);
            });

        return () => unsubscribe();
    }, []);

    const handleSelectService = (service) => {
        if (selectedServices.includes(service.id)) {
            setSelectedServices(prev => prev.filter(id => id !== service.id));
        } else {
            setSelectedServices(prev => [...prev, service.id]);
        }
    };

    const handleCheckout = async () => {
        try {
            for (const serviceId of selectedServices) {
                await firestore().collection('SERVICES').doc(serviceId).delete();
                await firestore().collection('TRANSACTIONS').add({
                    serviceId: serviceId,
                    timestamp: firestore.FieldValue.serverTimestamp(),
                });
            }
            setSelectedServices([]);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Services selected and transactions recorded.'
            });
        } catch (error) {
            console.error('Error processing checkout: ', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to process checkout. Please try again.'
            });
        }
    };

    const renderService = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.servicePrice}>{item.price} đ</Text>
            </View>
            <TouchableOpacity onPress={() => handleSelectService(item)}>
                <Icon 
                    name={selectedServices.includes(item.id) ? "check-box" : "check-box-outline-blank"} 
                    size={30} 
                    color={selectedServices.includes(item.id) ? "green" : "gray"} 
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Available Services</Text>
            <FlatList
                data={services}
                renderItem={renderService}
                keyExtractor={item => item.id}
            />
            <Button
                title="Checkout"
                onPress={handleCheckout}
                disabled={selectedServices.length === 0}
            />
            {selectedServices.length > 0 && (
                <Text style={styles.selectedText}>
                    {selectedServices.length} service(s) selected.
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row', // Sắp xếp ngang
        justifyContent: 'space-between', // Căn giữa các phần tử
        alignItems: 'center', // Căn giữa theo chiều dọc
    },
    serviceDetails: {
        flex: 1, // Tăng chiều rộng để chiếm toàn bộ không gian còn lại
        marginRight: 10, // Khoảng cách giữa tên dịch vụ và dấu tích
    },
    serviceName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    servicePrice: {
        fontSize: 16,
        color: '#333',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    selectedText: {
        marginTop: 10,
        fontSize: 16,
        color: 'blue',
    },
});

export default Customer;
