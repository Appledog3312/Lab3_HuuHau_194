import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, TextInput, Modal, Button } from "react-native";
import { Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

    // Fetch services from Firestore
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Services')
            .onSnapshot(querySnapshot => {
                const servicesData = [];
                querySnapshot.forEach(documentSnapshot => {
                    servicesData.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setServices(servicesData);
            });

        return () => unsubscribe();
    }, []);

    // Fetch appointments from Firestore
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Appointments')
            .onSnapshot(querySnapshot => {
                const appointmentsData = [];
                querySnapshot.forEach(documentSnapshot => {
                    appointmentsData.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });

                setAppointments(appointmentsData);
            });

        return () => unsubscribe();
    }, []);

    const handleEditAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setSelectedServiceId(appointment.serviceId);
        setIsEditModalVisible(true);
    };

    const handleCancelAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setIsCancelModalVisible(true);
    };

    const handleSaveEdit = () => {
        // Save the edited appointment details to Firestore
        firestore()
            .collection('Appointments')
            .doc(selectedAppointment.id)
            .update({ ...selectedAppointment, serviceId: selectedServiceId })
            .then(() => {
                setIsEditModalVisible(false);
                setSelectedAppointment(null);
                // Update local state
                setAppointments(prevAppointments => prevAppointments.map(app => 
                    app.id === selectedAppointment.id ? { ...app, serviceId: selectedServiceId } : app
                ));
            });
    };

    const handleConfirmCancel = () => {
        // Update the appointment with the cancel reason in Firestore
        firestore()
            .collection('Appointments')
            .doc(selectedAppointment.id)
            .update({
                cancelReason: cancelReason,
                status: 'Cancelled'
            })
            .then(() => {
                setIsCancelModalVisible(false);
                setSelectedAppointment(null);
                setCancelReason('');
                // Update local state
                setAppointments(prevAppointments => prevAppointments.filter(app => app.id !== selectedAppointment.id));
            });
    };

    const renderItem = ({ item, index }) => {
        const service = services.find(service => service.id === item.serviceId);
        const appointmentDate = item.appointmentDate && item.appointmentDate.toDate 
            ? item.appointmentDate.toDate().toLocaleDateString() 
            : 'Unknown';

        return (
            <View style={{ margin: 10, padding: 15, borderRadius: 15, marginVertical: 5, backgroundColor: '#D9B3FF' }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>STT: {index + 1}</Text>
                <Text style={{ fontSize: 16 }}>Tên dịch vụ: {service ? service.title : 'Unknown'}</Text>
                <Text style={{ fontSize: 16 }}>Giá: {service ? service.price : 'Unknown'}</Text>
                <Text style={{ fontSize: 16 }}>Ngày hẹn: {appointmentDate}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <TouchableOpacity onPress={() => handleEditAppointment(item)}>
                        <Text style={{ color: 'blue', }}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCancelAppointment(item)}>
                        <Text style={{ color: 'red' }}>Hủy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <Text style={{ padding: 15, fontSize: 25, fontWeight: "bold" }}>Appointments</Text>
            <FlatList
                data={appointments}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <Modal
                visible={isEditModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding:5, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Chỉnh sửa lịch hẹn</Text>
                        <Picker
                            selectedValue={selectedServiceId}
                            onValueChange={(itemValue) => setSelectedServiceId(itemValue)}
                            style={{ height: 50, width: 250 }}
                        >
                            {services.map(service => (
                                <Picker.Item label={service.title} value={service.id} key={service.id} />
                            ))}
                        </Picker>
                        <Button title="Lưu" style={{marginBottom: 5, borderRadius:8}} onPress={handleSaveEdit} />
                        <Button title="Hủy" style={{margin: 5}} onPress={() => setIsEditModalVisible(false)} />
                    </View>
                </View>
            </Modal>
            <Modal
                visible={isCancelModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsCancelModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Lý do hủy</Text>
                        <TextInput
                            placeholder="Nhập lý do hủy"
                            value={cancelReason}
                            onChangeText={setCancelReason}
                            style={{ borderBottomWidth: 1, marginBottom: 20 }}
                        />
                        <Button title="Xác nhận hủy" onPress={handleConfirmCancel} />
                        <Button title="Quay lại" onPress={() => setIsCancelModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default Appointments;
