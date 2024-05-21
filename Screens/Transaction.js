import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native'; 

const Transaction = () => {
    const [appointments, setAppointments] = useState([]);
    const navigation = useNavigation(); 

    useEffect(() => {
        const unsubscribe = firestore()
            .collection("Appointments")
            .onSnapshot((snapshot) => {
                const appointmentsList = [];
                snapshot.forEach((doc) => {
                    appointmentsList.push({ id: doc.id, ...doc.data() });
                });
                setAppointments(appointmentsList);
            });
        return () => unsubscribe();
    }, []);

    const handleUpdateAppointment = (id) => {
        
        navigation.navigate("UpdateAppointment", { appointmentId: id });
    };

    const handleAcceptAppointment = async (id) => {
        try {
            await firestore().collection("Appointments").doc(id).update({ state: "accepted" });
        } catch (error) {
            console.error("Error accepting appointment: ", error);
        }
    };

    const renderAppointmentItem = ({ item }) => (
        <View style={styles.appointmentItem}>
            <Text style={styles.itemText}>Email: {item.email}</Text>
            <Text style={styles.itemText}>Service ID: {item.serviceId}</Text>
            <Text style={styles.itemText}>Service Name: {item.title}</Text>
            <Text style={styles.itemText}>Datetime: {item.datetime.toDate().toLocaleString()}</Text>
            <Text style={styles.itemText}>State: {item.state}</Text>
            <Text style={styles.itemText}>Note:{item.note} </Text>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: "green" }]}
                onPress={() => handleAcceptAppointment(item.id)}
            >
                <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: "blue" }]}
                onPress={() => handleUpdateAppointment(item.id)}
            >
                <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Appointment List</Text>
            <FlatList
                data={appointments}
                renderItem={renderAppointmentItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
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
        fontWeight: "bold",
        marginBottom: 10,
    },
    list: {
        flexGrow: 1,
    },
    appointmentItem: {
        backgroundColor: "#f0f0f0",
        padding: 10,
        marginBottom: 10,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
    },
    button: {
        marginTop: 5,
        paddingVertical: 8,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});

export default Transaction;
