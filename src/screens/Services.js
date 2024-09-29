import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const Services = ({ navigation }) => {
    const [services, setServices] = useState([]);

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

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleDeleteService = async (serviceId) => {
        try {
            await firestore().collection('SERVICES').doc(serviceId).delete();
        } catch (error) {
            console.error('Error deleting service: ', error);
        }
    };

    const confirmDelete = (service) => {
        Alert.alert(
            'Delete Service',
            `Are you sure you want to delete the service "${service.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => handleDeleteService(service.id), style: 'destructive' },
            ]
        );
    };

    const handleLongPress = (service) => {
        confirmDelete(service);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
            onLongPress={() => handleLongPress(item)}
        >
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
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
        alignItems: 'center',
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        flex: 1,
        marginRight: 10, // Khoảng cách giữa tên dịch vụ và giá
        overflow: 'hidden', // Ẩn phần văn bản không vừa
        textAlign: 'left', // Canh trái
    },
    itemPrice: {
        fontSize: 18,
        color: '#333',
    },
});

export default Services;
