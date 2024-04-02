import React from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider  } from 'react-native-paper';
import { TimerProvider } from './components/Context/TimerContext';
import Timer from './components/Countdown/Timer';
import Alerm from './components/Alerm';

const Tab = createBottomTabNavigator();

const App = () => {
  const [loaded] = useFonts({
    'Roboto-Black': require('../assets/fonts/Roboto-Black.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Thin': require('../assets/fonts/Roboto-Thin.ttf'),
  });
  
  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <PaperProvider>
      <TimerProvider>
        <Tab.Navigator>
          <Tab.Screen name="Countdown" component={Timer}/>
          <Tab.Screen name="Alerm" component={Alerm}/>
        </Tab.Navigator>
      </TimerProvider>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;

