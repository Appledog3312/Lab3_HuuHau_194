import {createStackNavigator} from "@react-navigation/stack"
import Login from "../Screens/Login"
import Register from "../Screens/Register"
import Admin from "../Screens/Admin"
import Customer from "../Screens/Customer"
import ForgotPassword from "../Screens/ForgotPassword"


const Stack = createStackNavigator()

const Router = () =>{
    return(
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Admin" component={Admin}/>
            <Stack.Screen name="Customer" component={Customer}/>
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
        </Stack.Navigator>
    )
}

export default Router;