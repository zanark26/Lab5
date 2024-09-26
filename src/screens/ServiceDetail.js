import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ServiceDetail = ({ route, navigation }) => {
    const { serviceId } = route.params; // Get serviceId from navigation params
    const [service, setService] = useState(null);

    useEffect(() => {
        const fetchService = async () => {
            const serviceDoc = await firestore().collection('SERVICES').doc(serviceId).get();
            if (serviceDoc.exists) {
                setService(serviceDoc.data());
            }
        };

        fetchService();
    }, [serviceId]);

    const handleSaveChanges = async () => {
        try {
            await firestore().collection('SERVICES').doc(serviceId).update(service);
            navigation.goBack(); // Go back to the previous screen after saving
        } catch (error) {
            console.error('Error updating service: ', error);
        }
    };

    if (!service) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Service</Text>
            <TextInput
                style={styles.input}
                placeholder="Service Name"
                value={service.name}
                onChangeText={(text) => setService({ ...service, name: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Service Price"
                value={service.price.toString()}
                onChangeText={(text) => setService({ ...service, price: parseInt(text) })}
                keyboardType="numeric"
            />
            <Button title="Update" onPress={handleSaveChanges} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
});

export default ServiceDetail;
