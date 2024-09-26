import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const AddNewService = () => {
    const [service, setService] = useState({
        name: '',
        price: '',
    });
    const navigation = useNavigation();

    const handleAddService = async () => {
        try {
            // Add new service to Firestore
            await firestore().collection('SERVICES').add({
                name: service.name,
                price: service.price,
            });
            navigation.goBack(); // Navigate back to Services screen after adding
        } catch (error) {
            console.error('Error adding service: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Service</Text>
            <TextInput
                style={styles.input}
                placeholder="Service Name"
                value={service.name}
                onChangeText={(text) => setService({ ...service, name: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                value={service.price}
                onChangeText={(text) => setService({ ...service, price: text })}
                keyboardType="numeric"
            />
            <Button title="Add Service" onPress={handleAddService} />
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

export default AddNewService;
