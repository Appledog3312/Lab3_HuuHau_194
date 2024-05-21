import React, { useState, useEffect } from "react";
import { Image, View, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { SearchBar } from 'react-native-elements';
import currencyFormatter from "currency-formatter";

const ServicesCustomer = ({ navigation }) => {
    const [initialServices, setInitialServices] = useState([]);
    const [services, setServices] = useState([]);
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Services')
            .onSnapshot(querySnapshot => {
                const services = [];
                querySnapshot.forEach(documentSnapshot => {
                    services.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setServices(services);
                setInitialServices(services);
            });

        return () => unsubscribe();
    }, []);

    const [name, setName] = useState('')
    const renderItem = ({ item }) => (
        <TouchableOpacity style={{ margin: 10,padding: 15, borderRadius: 15, marginVertical: 5, backgroundColor: '#e0e0e0' }}>
            <Menu>
                <MenuTrigger>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}>
                        <Text style={{fontSize: 18, fontWeight: "bold"}}>{item.title}</Text>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                            {currencyFormatter.format(item.price, { code: "VND" })}
                        </Text>
                    </View>
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => handleAppointment(item)}><Text>Appointment</Text></MenuOption>
                    <MenuOption onSelect={() => handleDetail(item)}><Text>Detail</Text></MenuOption>
                </MenuOptions>
            </Menu>
        </TouchableOpacity>
    );
    

    const handleAppointment = (service) => {
        navigation.navigate("Appointment", { service });
    }
    const handleDetail = (service) => {
        navigation.navigate("Service Detail", { service });
    }

    return (
        <View style={{ flex: 1 }}>
            <Image source={require("../assets/logolab3.png")}
                style={{
                    alignSelf: "center",
                    marginVertical: 50
                }}
            />
            <View style={styles.Searchbar}>
            <SearchBar
                placeholder="Search by name"
                onChangeText={(text) => {
                    setName(text);
                    const result = initialServices.filter(service =>
                        service.title.toLowerCase().includes(text.toLowerCase())
                    );
                    setServices(result);
                }}
                value={name}
                containerStyle={styles.searchContainer}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                lightTheme
            />
        </View>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <Text style={{
                    padding: 15,
                    fontSize: 25,
                    fontWeight: "bold",
                }}>
                    Danh sách dịch vụ</Text>
            </View>
            <FlatList
                data={services}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

export default ServicesCustomer;

const styles = StyleSheet.create({
    Searchbar: {
        justifyContent: 'center',
    },
    searchContainer: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    inputContainer: {
        backgroundColor: '#fff', 
        borderRadius: 10,
    },
    input: {
        color: '#000',
    }
});
