import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const AddCustomer = () => {
    const [newCustomer, setNewCustomer] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
    });
    const navigation = useNavigation();

    const handleAddCustomer = async () => {
        try {
            await firestore().collection('USERS').add({
                fullName: newCustomer.fullName,
                email: newCustomer.email,
                phone: newCustomer.phone,
                address: newCustomer.address,
                role: 'customer',
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error adding customer: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Customer</Text>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={newCustomer.fullName}
                onChangeText={(text) => setNewCustomer({ ...newCustomer, fullName: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={newCustomer.email}
                onChangeText={(text) => setNewCustomer({ ...newCustomer, email: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                value={newCustomer.phone}
                onChangeText={(text) => setNewCustomer({ ...newCustomer, phone: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={newCustomer.address}
                onChangeText={(text) => setNewCustomer({ ...newCustomer, address: text })}
            />
            <Button title="Add Customer" onPress={handleAddCustomer} />
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

export default AddCustomer;