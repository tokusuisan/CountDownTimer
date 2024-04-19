import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';

const AlarmContext = createContext();

export const useAlarm = () => useContext(AlarmContext);

export const AlarmProvider = ({ children }) => {
    const ALARMTIMES = {
        hour: [...Array(24)].map((_, i) => i), // 0から23までの値を生成
        min: [...Array(60)].map((_, i) => i),
      };
      
      const [selectAItems, setSelectAItems] = useState(() => {
        const newItems = {};
        Object.keys(ALARMTIMES).forEach((name) => {
          newItems[name] = ALARMTIMES[name][0];
        });
        return newItems;
      });
       
  const [timeALimit, setTimeALimit] = useState(selectAItems);
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isSelectingTime, setIsSelectingTime] = useState(true);
  const [vibrationCount, setVibrationCount] = useState(10);
  const [countdownTime, setCountdownTime] = useState({ hour: "00", min: "00" });
  const intervalIdRef = useRef(null);
  const vibrationIntervalRef = useRef(null);
  const notificationSent = useRef(false);
  
  

  useEffect(() => {
    if (isTimeUp && !notificationSent.current) {
      sendNotification();
      notificationSent.current = true; // 通知を送信したことを記録する
      startVibration(); // バイブレーションを開始
    } else {
      clearInterval(vibrationIntervalRef.current); // タイムアップでない場合はバイブレーションを停止
    }
    return () => clearInterval(vibrationIntervalRef.current);
  }, [isTimeUp, startVibration, notificationSent]);

  
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      Vibration.cancel(); // バイブレーションを停止
      AlarmReset();
    });

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    return () => subscription.remove();
  }, []);
  
  useEffect(() => {
    setTimeALimit({
      hour: zeroPaddingNum(selectAItems.hour),
      min: zeroPaddingNum(selectAItems.min)
    });
  }, [selectAItems, setTimeALimit, zeroPaddingNum]);


  const zeroPaddingNum = useCallback((num) => {
    return String(num).padStart(2, "0");
  }, []);

  const startVibration = useCallback(() => {
    let count = 0;
    vibrationIntervalRef.current = setInterval(() => {
      Vibration.vibrate();
      count++;
      if (count === vibrationCount) {
        clearInterval(vibrationIntervalRef.current); // 指定回数バイブレーションを繰り返したら停止
      }
    }, 1000);
  }, [vibrationCount]);
  
  const AlarmStart = () => {
    startAlarm();
    intervalIdRef.current = setInterval(() => startAlarm(), 1000); 
    setIsAlarmSet(true);
    setIsTimeUp(false);
    setIsSelectingTime(false);
  };

  const AlarmStop = useCallback(() => {
    clearInterval(intervalIdRef.current);
    setIsAlarmSet(false);
  }, []);

  // reset関数内でインターバルをクリア
  const AlarmReset = () => {
    setIsAlarmSet(false);
    setIsSelectingTime(true);
    setIsTimeUp(false);
    clearInterval(intervalIdRef.current);
    notificationSent.current = false;
  };

  const startAlarm = useCallback(() => {
    const currentDate = new Date();
    const alarmTime = new Date();
    alarmTime.setHours(timeALimit.hour);
    alarmTime.setMinutes(timeALimit.min);
    alarmTime.setSeconds(0);

    // アラームの時刻が現在の時刻よりも前にあるかどうかを確認
    const isAlarmNextDay = alarmTime <= currentDate;

    let hourDiff;
    if (isAlarmNextDay) {
        // アラームの時刻が同じ日に設定されている場合、次の日に設定する
        alarmTime.setDate(alarmTime.getDate() + 1);
    } else if (Math.abs(alarmTime - currentDate) < 60000) {
        // アラームの時刻と現在時刻の差が一分未満の場合、次の日に設定する
        alarmTime.setMinutes(alarmTime.getMinutes() + 1);
    }

    hourDiff = (alarmTime.getTime() - currentDate.getTime()) / (1000 * 60 * 60);
  
    const countdownHour = Math.max(Math.floor(hourDiff), 0);
    const countdownMin = Math.max(Math.floor((hourDiff - countdownHour) * 60), 0);

    if (countdownHour === 24 && countdownMin === 0) {
      setCountdownTime({
        hour: zeroPaddingNum(0),
        min: zeroPaddingNum(0)
    });
        setIsTimeUp(true);
        AlarmStop();
    } else {
        setCountdownTime({
            hour: zeroPaddingNum(countdownHour),
            min: zeroPaddingNum(countdownMin)
        });
    }
}, [setCountdownTime, setIsTimeUp, timeALimit, zeroPaddingNum, AlarmStop]);
  

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
    <AlarmContext.Provider 
    value={{
    ALARMTIMES,
    selectAItems,
    setSelectAItems,
    timeALimit, 
    setTimeALimit,
    isAlarmSet,
    setIsAlarmSet,
    AlarmStart,
    AlarmReset,
    isTimeUp,
    setIsTimeUp,
    isSelectingTime,
    setIsSelectingTime,
    vibrationCount,
    setVibrationCount,
    zeroPaddingNum,
    countdownTime
    }}>
    {children}
    </AlarmContext.Provider>
  );
};


