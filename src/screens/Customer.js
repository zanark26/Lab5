import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const subscriber = firestore()
            .collection('USERS')
            .where('role', '==', 'customer')
            .onSnapshot(querySnapshot => {
                const customers = [];
                querySnapshot.forEach(documentSnapshot => {
                    customers.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setCustomers(customers);
            });

        return () => subscriber();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.infoContainer}>
                <Text>Name: {item.fullName}</Text>
                <Text>Email: {item.email}</Text>
                <Text>Phone: {item.phone}</Text>
                <Text>Address: {item.address}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => editCustomer(item)} style={styles.iconButton}>
                    <Icon name="edit" size={30} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteCustomer(item.key)} style={styles.iconButton}>
                    <Icon name="delete" size={30} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const editCustomer = (customer) => {
        navigation.navigate('EditCustomer', { customer });
    };

    const deleteCustomer = async (id) => {
        try {
            await firestore().collection('USERS').doc(id).delete();
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Customer deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting customer: ', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete customer'
            });
        }
    };

    const handleSignOut = async () => {
        try {
            await auth().signOut();
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Signed out successfully'
            });
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error signing out: ', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to sign out. Please try again.'
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Customer List</Text>
                <FlatList data={customers}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
                />
            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
                    <Icon name="logout" size={50} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('AddCustomer')} style={styles.addButton}>
                    <Icon name="add" size={50} color="blue" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoContainer: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 10,
    },
    container: {
        flex: 1,
        padding: 10,
    },
    content: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    logoutButton: {
        marginRight: 10,
    },
    addButton: {
        marginLeft: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    iconButton: {
        marginRight: 15, // Space between buttons
    },
});

export default Customer;