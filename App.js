import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MyContextControllerProvider } from './index';
import Router from './Router/Router';
import { MenuProvider } from 'react-native-popup-menu';
import Admin from './Screens/Admin';

const App = () => {
  return (
    <MyContextControllerProvider>
      <MenuProvider>
        <NavigationContainer>
          <Router/>
          {/* <Admin/> */}
        </NavigationContainer>
      </MenuProvider>
    </MyContextControllerProvider>
  );
}
export default App
