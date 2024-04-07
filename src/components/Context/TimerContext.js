import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';

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
  const [isSelectingTime, setIsSelectingTime] = useState(true);
  const notificationSent = useRef(false);
  const intervalID = useRef(null);
 
  const vibrate = useCallback(() => {
    intervalID.current = setInterval(() => {
      Vibration.vibrate(); // バイブレーションを開始
    }, 1000);
  }, []);

  useEffect(() => {
    let interval;
    if (isTimeUp && !notificationSent.current) {
      sendNotification();
      notificationSent.current = true; // 通知を送信したことを記録する
      vibrate(); // バイブレーションを開始
    } else {
      clearInterval(intervalID.current); // タイムアップでない場合はバイブレーションを停止
    }
    return () => clearInterval(interval);
  }, [isTimeUp, vibrate]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      Vibration.cancel(); // バイブレーションを停止
      resetTime(); // reset関数を呼び出す
    });

    return () => subscription.remove();
  }, []);

  const zeroPaddingNum = useCallback((num) => {
    return String(num).padStart(2, "0");
  }, []);


  const startTime = useCallback(() => {
    intervalID.current = setInterval(() => tick(), 1000);
    setIsSelectingTime(false);
    setIsStart(true);
    setIsStop(false);
    setIsTimeUp(false);
    setIsReset(false);
  }, []);

  const stopTime = useCallback(() => {
    clearInterval(intervalID.current);
    setIsStop(true);
    setIsStart(false);
  }, []);

  const tick = useCallback(() => {
    setTimeLimit((prevTimeLimit) => {
      let newTimeLimit = { ...prevTimeLimit };
      const { hour, min, sec } = newTimeLimit;

      if (hour <= 0 && min <= 0 && sec <= 0) {
        stopTime();
        setIsTimeUp(true);
        return newTimeLimit;
      }

      if (hour > 0 && min <= 0 && sec <= 0) {
        newTimeLimit.hour -= 1;
        newTimeLimit.min = 59;
        newTimeLimit.sec = 59;
      } else if (min > 0 && sec <= 0) {
        newTimeLimit.min -= 1;
        newTimeLimit.sec = 59;
      } else {
        newTimeLimit.sec -= 1;
      }

      return {
				hour: zeroPaddingNum(newTimeLimit.hour),
				min: zeroPaddingNum(newTimeLimit.min),
				sec: zeroPaddingNum(newTimeLimit.sec)
			};
    });
  });

  const resetTime = useCallback(() => {
    clearInterval(intervalID.current);
    setTimeLimit({
      hour: zeroPaddingNum(selectItems.hour),
      min: zeroPaddingNum(selectItems.min),
      sec: zeroPaddingNum(selectItems.sec)
    });
    setIsSelectingTime(true);
    setIsReset(true);
    setIsStart(false);
    setIsStop(false);
    setIsTimeUp(false);
    notificationSent.current = false;
  }, [zeroPaddingNum, selectItems]);

  useEffect(() => {
    setTimeLimit({
      hour: zeroPaddingNum(selectItems.hour),
      min: zeroPaddingNum(selectItems.min),
      sec: zeroPaddingNum(selectItems.sec)
    });
  }, [selectItems, setTimeLimit, zeroPaddingNum]);

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's up!",
        body: "The countdown has finished."
      },
      trigger: null // 今すぐ表示するため、triggerはnullに設定する
    });
  };
 
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
        TIMES,
        startTime,
        stopTime,
        resetTime,
        zeroPaddingNum,
        isSelectingTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

