import React, { useState, useEffect } from "react";
import { Image, View, FlatList, TouchableOpacity, Alert,StyleSheet } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SearchBar } from 'react-native-elements';
import currencyFormatter from "currency-formatter";

const Services = ({ navigation }) => {
    const [initialServices, setInitialServices] = useState([]);
    const [services, setServices] = useState([]);
    const [name, setName] = useState('');

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

    const renderItem = ({ item }) => (
        <TouchableOpacity style={{ margin: 10,padding: 15, borderRadius: 15, marginVertical: 5, backgroundColor: 'white' }}>
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
                    <MenuOption onSelect={() => handleUpdate(item)}><Text>Update</Text></MenuOption>
                    <MenuOption onSelect={() => handleDelete(item)}><Text>Delete</Text></MenuOption>
                    <MenuOption onSelect={() => handleDetail(item)}><Text>Detail</Text></MenuOption>
                </MenuOptions>
            </Menu>
        </TouchableOpacity>
    );
    

    const handleUpdate = async (service) => {
        try {
            navigation.navigate("Service Update", { service });
        } catch (error) {
            console.error("Lỗi khi cập nhật dịch vụ:", error);
        }
    }
    

    const handleDelete = (service) => {
        Alert.alert(
            "Warning",
            "Are you sure you want to delete this service? This operation cannot be returned",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        firestore()
                            .collection('Services')
                            .doc(service.id)
                            .delete()
                            .then(() => {
                                console.log("Dịch vụ đã được xóa thành công!");
                                navigation.navigate("Services");
                            })
                            .catch(error => {
                                console.error("Lỗi khi xóa dịch vụ:", error);
                            });
                    },
                    style: "default"
                }
            ]
        )
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
                    List of services</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Add New Service")}>
                      <Image source={require('../assets/add.png')} style={{ width: 30, height: 30, margin: 20 }} />
                    </TouchableOpacity>
            </View>
            <FlatList
                data={services}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

export default Services;

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
