import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTimer } from './TimerContext';
import { Picker } from '@react-native-picker/picker';

const Timer = () => {
  const { selectItems, setSelectItems, timeLimit, setTimeLimit, isStart, setIsStart, isStop, setIsStop, isTimeUp, setIsTimeUp, isReset, setIsReset, TIMES } = useTimer();

  const zeroPaddingNum = useCallback((num) => {
    return String(num).padStart(2, "0");
  }, []);

  const intervalID = useRef(null);

  const startTime = useCallback(() => {
    intervalID.current = setInterval(() => tick(), 1000);
    setIsStart(true);
    setIsStop(false);
    setIsTimeUp(false);
    setIsReset(false);
  }, [tick]);

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

      return newTimeLimit;
    });
  }, [setTimeLimit, stopTime, setIsTimeUp]);

  const resetTime = useCallback(() => {
    clearInterval(intervalID.current);
    setTimeLimit({
      hour: zeroPaddingNum(selectItems.hour),
      min: zeroPaddingNum(selectItems.min),
      sec: zeroPaddingNum(selectItems.sec)
    });
    setIsReset(true);
    setIsStart(false);
    setIsStop(false);
    setIsTimeUp(false);
  }, [setTimeLimit, zeroPaddingNum, selectItems, setIsReset, setIsStart, setIsStop, setIsTimeUp]);

  useEffect(() => {
    setTimeLimit({
      hour: zeroPaddingNum(selectItems.hour),
      min: zeroPaddingNum(selectItems.min),
      sec: zeroPaddingNum(selectItems.sec)
    });
  }, [selectItems, setTimeLimit, zeroPaddingNum]);

  return (
    <View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectItems.hour}
          onValueChange={(itemValue) =>
            setSelectItems((prevItems) => ({ ...prevItems, hour: itemValue }))
          }
          style={styles.picker}
        >
          {TIMES.hour.map((hour) => (
            <Picker.Item key={hour} label={zeroPaddingNum(hour)} value={hour} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectItems.min}
          onValueChange={(itemValue) =>
            setSelectItems((prevItems) => ({ ...prevItems, min: itemValue }))
          }
          style={styles.picker}
        >
          {TIMES.min.map((min) => (
            <Picker.Item key={min} label={zeroPaddingNum(min)} value={min} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectItems.sec}
          onValueChange={(itemValue) =>
            setSelectItems((prevItems) => ({ ...prevItems, sec: itemValue }))
          }
          style={styles.picker}
        >
          {TIMES.sec.map((sec) => (
            <Picker.Item key={sec} label={zeroPaddingNum(sec)} value={sec} />
          ))}
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Start" onPress={startTime} disabled={isStart || isTimeUp} />
        <Button title="Stop" onPress={stopTime} disabled={!isStart || isTimeUp} />
        <Button title="Reset" onPress={resetTime} disabled={isStart} />
      </View>
      <View>
        <Text>Time Remaining: {timeLimit.hour}:{timeLimit.min}:{timeLimit.sec}</Text>
        {isTimeUp && <Text>Time's up!</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  picker: {
    width: '30%'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20
  }
});

export default Timer;

