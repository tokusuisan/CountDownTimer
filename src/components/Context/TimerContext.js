import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const TIMES = {
    hour: [...Array(25)].map((_, i) => i), // 0から24までの値を生成
    min: [...Array(60)].map((_, i) => i),
    sec: [...Array(60)].map((_, i) => i)
  };

  const [selectItems, setSelectItems] = useState(() => {
    const newItems = {};
    Object.keys(TIMES).forEach((name) => {
      newItems[name] = TIMES[name][0];
    });
    return newItems;
  });

  const [timeLimit, setTimeLimit] = useState(selectItems);
  const [isStart, setIsStart] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isReset, setIsReset] = useState(false);

  useEffect(() => {
    if (isTimeUp) {
      Alert.alert(
        "Time's up!",
        "The countdown has finished.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }
  }, [isTimeUp]);

  return (
    <TimerContext.Provider
      value={{
        selectItems,
        setSelectItems,
        timeLimit,
        setTimeLimit,
        isStart,
        setIsStart,
        isStop,
        setIsStop,
        isTimeUp,
        setIsTimeUp,
        isReset,
        setIsReset,
        TIMES
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

