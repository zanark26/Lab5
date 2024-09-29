import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('TRANSACTIONS')
            .onSnapshot(querySnapshot => {
                const transactionList = [];
                querySnapshot.forEach(documentSnapshot => {
                    transactionList.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setTransactions(transactionList);
            });

        return () => unsubscribe();
    }, []);

    const renderTransaction = ({ item }) => (
        <View style={styles.transactionContainer}>
            <Text>Customer ID: {item.customerId}</Text>
            <Text>Service ID: {item.serviceId}</Text>
            <Text>Date: {item.timestamp?.toDate().toLocaleString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transaction History</Text>
            <FlatList
                data={transactions}
                renderItem={renderTransaction}
                keyExtractor={item => item.id}
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
    },
    transactionContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default Transaction;
