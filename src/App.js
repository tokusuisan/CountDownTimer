import React from 'react';
import { SafeAreaView } from 'react-native';
import { TimerProvider } from './TimerContext';
import Timer from './Timer';

const App = () => {
  return (
    <SafeAreaView>
      <TimerProvider>
        <Timer />
      </TimerProvider>
    </SafeAreaView>
  );
};

export default App;

