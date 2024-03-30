import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TimerProvider } from './components/Context/TimerContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Timer from './components/Timer';
import Alerm from './components/Alerm';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <TimerProvider>
        <Tab.Navigator>
          <Tab.Screen name="Countdown" component={Timer}/>
          <Tab.Screen name="Alerm" component={Alerm}/>
        </Tab.Navigator>
      </TimerProvider>
    </NavigationContainer>
  );
};

export default App;

