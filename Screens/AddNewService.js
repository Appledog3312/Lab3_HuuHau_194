import React, { useState } from "react";
import { View, Image } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import ImagePicker from "react-native-image-crop-picker";
import { useMyContextProvider } from "../index";
import { showMessage, hideMessage } from "react-native-flash-message";

const AddNewService = ({ navigation }) => {
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    const [imagePath, setImagePath] = useState("");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const SERVICES = firestore().collection("Services");

    const handleAddNewService = async () => {
        try {
            const response = await SERVICES.add({
                title,
                price,
                create: userLogin.email
            });
            
            const refImage = storage().ref("/services/" + response.id + ".png");
            await refImage.putFile(imagePath);
            const link = await refImage.getDownloadURL();
            
            await SERVICES.doc(response.id).update({
                id: response.id, 
                image: link
            });

            showMessage({
                message: "Thêm dịch vụ thành công!",
                type: "success",
                duration: 2000,
                onHide: () => navigation.navigate("Services")
            });
        } catch (error) {
            console.error("Error adding service: ", error);
            showMessage({
                message: "Đã xảy ra lỗi khi thêm dịch vụ. Vui lòng thử lại sau.",
                type: "danger",
                duration: 2000
            });
        }
    };
        
    const handleUploadImage = () =>{
        ImagePicker.openPicker({
            mediaType: "photo",
            width: 400,
            height: 300
        })
        .then(image => setImagePath(image.path))
        .catch(error => console.error("Error picking image: ", error));
    };

    return (
        <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Service name *</Text>
            <Button textColor="black" buttonColor="pink" style={{margin: 10}} mode="contained" onPress={handleUploadImage}>
                Upload Image
            </Button>
            {imagePath !== "" && <Image source={{uri: imagePath}} style={{height: 300}} />}
            <TextInput
                placeholder="Input a service name"
                value={title}
                onChangeText={setTitle}
                style={{ marginBottom: 10, borderWidth: 1, borderColor: "#ccc" }}
            />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Price *</Text>
            <TextInput
                placeholder="0"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={{ marginBottom: 10, borderWidth: 1, borderColor: "#ccc" }}
            />
            <Button buttonColor="pink" textColor="black" mode="contained" onPress={handleAddNewService}>Add</Button>
        </View>
    );
};

export default AddNewService;
