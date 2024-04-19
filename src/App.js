import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider  } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import TimerScreen from './components/Screen/TimerScreen';
import AlarmScreen from './components/Screen/AlarmScreen';

const Tab = createBottomTabNavigator();

const App = () => {

  useEffect(() => {
    const getNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permission denied');
        // 通知の許可が得られない場合の処理をここに追加する
        Alert.alert('通知を受信するためには、通知の許可が必要です。アプリ設定から通知を有効にしてください。');
      }
    };

    getNotificationPermission();
  }, []);

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
        <Tab.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: "#111111",
           },
           headerTitleStyle: {
            color:'#F5F5F5'
          },
          tabBarStyle: {
            backgroundColor: "#111111",
          },
          tabBarLabelStyle: {
             color: '#F5F5F5' 
          },
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          tabBarInactiveTintColor: "#ffffff88",
          tabBarActiveTintColor: "#fff",
        }}>
          <Tab.Screen name="Countdown" component={TimerScreen} options={{ tabBarIcon: ({color, size}) => (<MaterialCommunityIcons name="timer-outline" color={color} size={size}/>)}}/>
          <Tab.Screen name="Alarm" component={AlarmScreen} options={{ tabBarIcon: ({color, size}) => (<MaterialCommunityIcons name="clock-outline" color={color} size={size}/>)}}/>
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;

