import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const EditCustomer = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { customer } = route.params;
    const [newCustomer, setNewCustomer] = useState(customer);

    const handleEditCustomer = async () => {
        try {
            await firestore().collection('USERS').doc(customer.key).update({
                fullName: newCustomer.fullName,
                email: newCustomer.email,
                phone: newCustomer.phone,
                address: newCustomer.address,
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error editing customer: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Customer</Text>
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
            <Button title="Save Changes" onPress={handleEditCustomer} />
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

export default EditCustomer;