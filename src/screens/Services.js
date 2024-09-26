import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Modal, Button, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const Services = ({ navigation }) => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

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

    // Function to format price (e.g., 500000 -> 500.000)
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Function to handle deleting the service
    const handleDeleteService = async () => {
        try {
            await firestore().collection('SERVICES').doc(selectedService.id).delete();
            setModalVisible(false); // Close the modal after deletion
        } catch (error) {
            console.error('Error deleting service: ', error);
        }
    };

    // Confirm delete action
    const confirmDelete = () => {
        Alert.alert(
            'Delete Service',
            `Are you sure you want to delete the service "${selectedService.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: handleDeleteService, style: 'destructive' },
            ]
        );
    };

    const handleLongPress = (service) => {
        setSelectedService(service);
        confirmDelete();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
            onLongPress={() => handleLongPress(item)} // Long press to delete service
        >
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{formatPrice(item.price)} đ</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <Image
                source={require('../asset/banner-spa.jpg')}
                style={styles.bannerImage}
            />
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Service List</Text>
                <IconButton
                    icon="plus-circle"
                    iconColor="red"
                    size={40}
                    onPress={() => navigation.navigate('AddNewService')}
                />
            </View>
            <FlatList
                data={services}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    bannerImage: {
        alignSelf: 'center',
        marginVertical: 30,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    itemPrice: {
        fontSize: 18,
        color: '#333',
    },
});

export default Services;
