import { createStackNavigator } from "@react-navigation/stack";
import ServicesCustomer from '../Screens/ServicesCustomer';
import { useMyContextProvider } from "../index";
import Appointment from "../Screens/Appointment";
import ProfileCustomer from "../Screens/ProfileCustomer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native";
import Settings from "../Screens/Settings";

const Stack = createStackNavigator();

const RouterServiceCustomer = ({ navigation }) => {
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;

    return (
        <Stack.Navigator
            initialRouteName="ServicesCustomer"
            screenOptions={{
                headerTitleAlign: "left",
                headerStyle: {
                    backgroundColor: "pink"
                },
                headerRight: (props) => (
                    <TouchableOpacity onPress={() => navigation.navigate("ProfileCustomer")}>
                      <Image source={require('../assets/account.png')} style={{ width: 30, height: 30, margin: 20 }} />
                    </TouchableOpacity>
                  ),
            }}
        >
            <Stack.Screen options={{headerLeft: null, title: (userLogin != null) && (userLogin.fullName)}} name="ServicesCustomer" component={ServicesCustomer} />
            <Stack.Screen name="Appointment" component={Appointment} />
            <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
    )
}

export default RouterServiceCustomer;
