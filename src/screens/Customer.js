import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import Firebase auth
import { useNavigation } from '@react-navigation/native'; // Import useNavigation for navigation
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [newCustomer, setNewCustomer] = useState({
        id: '',
        fullName: '',
        email: '',
        phone: '',
        address: '',
        role: 'customer'
    });
    const navigation = useNavigation(); // Use navigation for routing

    useEffect(() => {
        const subscriber = firestore()
            .collection('USERS')
            .where('role', '==', 'customer')
            .onSnapshot(querySnapshot => {
                const customers = [];
                querySnapshot.forEach(documentSnapshot => {
                    customers.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id, // Setting the document ID as 'key'
                    });
                });
                setCustomers(customers);
            });

        return () => subscriber();
    }, []);

    const addOrUpdateCustomer = async () => {
        if (!newCustomer.fullName || !newCustomer.email) {
            Alert.alert('Error', 'Please fill in at least the name and email');
            return;
        }

        try {
            if (newCustomer.id) {
                // Update existing customer
                await firestore().collection('USERS').doc(newCustomer.id).update(newCustomer);
                Alert.alert('Success', 'Customer updated successfully');
            } else {
                // Add new customer
                await firestore().collection('USERS').add(newCustomer);
                Alert.alert('Success', 'New customer added successfully');
            }
            resetForm(); // Clear the form after adding or updating
        } catch (error) {
            console.error('Error saving customer: ', error);
            Alert.alert('Error', 'Failed to save customer');
        }
    };

    const resetForm = () => {
        setNewCustomer({ id: '', fullName: '', email: '', phone: '', address: '', role: 'customer' });
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text>Name: {item.fullName}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Phone: {item.phone}</Text>
            <Text>Address: {item.address}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Edit" onPress={() => editCustomer(item)} />
                <Button title="Delete" onPress={() => deleteCustomer(item.key)} />
            </View>
        </View>
    );

    const editCustomer = (customer) => {
        setNewCustomer({ ...customer, id: customer.key });
    };

    const deleteCustomer = async (id) => {
        try {
            await firestore().collection('USERS').doc(id).delete();
            Alert.alert('Success', 'Customer deleted successfully');
        } catch (error) {
            console.error('Error deleting customer: ', error);
            Alert.alert('Error', 'Failed to delete customer');
        }
    };

    // Function to handle sign out
    const handleSignOut = async () => {
        try {
            await auth().signOut();
            Alert.alert('Success', 'Signed out successfully');
            navigation.navigate('Login'); // Navigate to login screen
        } catch (error) {
            console.error('Error signing out: ', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
        }
    };
   

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Customer List</Text>
            
            {/* Nút đăng xuất */}
            <Button title="Logout" onPress={handleSignOut} color="red" />

            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={newCustomer.fullName}
                    onChangeText={(text) => setNewCustomer({...newCustomer, fullName: text})}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={newCustomer.email}
                    onChangeText={(text) => setNewCustomer({...newCustomer, email: text})}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    value={newCustomer.phone}
                    onChangeText={(text) => setNewCustomer({...newCustomer, phone: text})}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={newCustomer.address}
                    onChangeText={(text) => setNewCustomer({...newCustomer, address: text})}
                />
                {/* This button changes dynamically based on whether we're adding or updating a customer */}
                <Button 
                    title={newCustomer.id ? "Update Customer" : "Add Customer"} 
                    onPress={addOrUpdateCustomer} 
                />
                {/* Add a cancel/reset button when editing */}
                {newCustomer.id && <Button title="Cancel Edit" onPress={resetForm} />}
            </View>
            <FlatList
                data={customers}
                renderItem={renderItem}
                keyExtractor={item => item.key}
            />
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
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default Customer;
