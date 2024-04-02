import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useTimer } from '../Context/TimerContext';
import { Picker } from '@react-native-picker/picker';

const Timer = () => {
  const { selectItems, setSelectItems, isStart, isTimeUp, TIMES, startTime, zeroPaddingNum, timeLimit, stopTime, resetTime, isSelectingTime} = useTimer();
  const calculateEstimatedEndTime = () => {
    const currentTime = new Date();
    const duration = timeLimit.hour * 60 * 60 * 1000 + timeLimit.min * 60 * 1000 + timeLimit.sec * 1000;
    const estimatedEndTime = new Date(currentTime.getTime() + duration);
    return `${zeroPaddingNum(estimatedEndTime.getHours())}:${zeroPaddingNum(estimatedEndTime.getMinutes())}:${zeroPaddingNum(estimatedEndTime.getSeconds())}`;
  }; 

  const SelectTime = () => {
  return (
    <View style={{ marginTop: 20, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: 'Roboto-Bold' }}>Hour</Text>
          <Picker
            selectedValue={selectItems.hour}
            onValueChange={(itemValue) =>
              setSelectItems((prevItems) => ({ ...prevItems, hour: itemValue }))
            }
            style={{ width: 100 }}
          >
            {TIMES.hour.map((hour) => (
              <Picker.Item key={hour} label={zeroPaddingNum(hour)} value={hour} />
            ))}
          </Picker>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: 'Roboto-Bold' }}>Min</Text>
          <Picker
            selectedValue={selectItems.min}
            onValueChange={(itemValue) =>
              setSelectItems((prevItems) => ({ ...prevItems, min: itemValue }))
            }
            style={{ width: 100 }}
          >
            {TIMES.min.map((min) => (
              <Picker.Item key={min} label={zeroPaddingNum(min)} value={min} />
            ))}
          </Picker>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: 'Roboto-Bold' }}>Sec</Text>
          <Picker
            selectedValue={selectItems.sec}
            onValueChange={(itemValue) =>
              setSelectItems((prevItems) => ({ ...prevItems, sec: itemValue }))
            }
            style={{ width: 100 }}
          >
            {TIMES.sec.map((sec) => (
              <Picker.Item key={sec} label={zeroPaddingNum(sec)} value={sec} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20  }}>
          <Button  mode="contained" onPress={startTime} disabled={isStart || isTimeUp}>
            Start
          </Button>
      </View>
      <View>
        {isTimeUp && <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 20 }}>Time's up!</Text>}
      </View>
    </View>
  );
 };

 const TimeRemainingScreen = () => {
  return (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontFamily: 'Roboto-Regular' }}>
          Time Remaining: {timeLimit.hour}:{timeLimit.min}:{timeLimit.sec}
        </Text>
        <Text style={{ fontSize: 20, marginTop: 10 }}>
          Estimated End Time: {calculateEstimatedEndTime()}
        </Text>
      </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20  }}>
            <View style={{ marginRight:'10%'}}>
              <Button mode="contained" onPress={stopTime} disabled={!isStart || isTimeUp} >Stop</Button>
            </View>
            <View>
              <Button mode="contained" onPress={resetTime} disabled={isStart} >Reset</Button>
            </View>
          </View>
          <View>
            {isTimeUp && <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 20 }}>Time's up!</Text>}
          </View>
        </View>
      );
};


return (
  <>
    {isSelectingTime ? (
      <SelectTime />
    ) : (
      <TimeRemainingScreen />
    )}
  </>
);
};


export default Timer;
