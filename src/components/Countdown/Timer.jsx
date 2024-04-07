import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight} from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useTimer } from '../Context/TimerContext';
import { Picker } from '@react-native-picker/picker';
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Timer = () => {
  const { selectItems, setSelectItems, isStart, isTimeUp, TIMES, startTime, zeroPaddingNum, timeLimit, stopTime, resetTime, isSelectingTime } = useTimer();
  const [savedTimes, setSavedTimes] = useState([]);

     useEffect(() => {
       // アプリ起動時に保存された時間を読み込む
       const getSavedTimes = async () => {
         try {
           const jsonValue = await AsyncStorage.getItem('@saved_times');
           if (jsonValue !== null) {
             setSavedTimes(JSON.parse(jsonValue));
           }
         } catch (e) {
           console.error('Error reading saved times from AsyncStorage:', e);
         }
       };
   
       getSavedTimes();
     }, []);
   
     const saveSavedTimes = async (newSavedTimes) => {
       try {
         const jsonValue = JSON.stringify(newSavedTimes);
         await AsyncStorage.setItem('@saved_times', jsonValue);
       } catch (e) {
         console.error('Error saving saved times to AsyncStorage:', e);
       }
     };
   
     const calculateEstimatedEndTime = () => {
       const currentTime = new Date();
       const duration = timeLimit.hour * 60 * 60 * 1000 + timeLimit.min * 60 * 1000 + timeLimit.sec * 1000;
       const estimatedEndTime = new Date(currentTime.getTime() + duration);
       return `${zeroPaddingNum(estimatedEndTime.getHours())}:${zeroPaddingNum(estimatedEndTime.getMinutes())}:${zeroPaddingNum(estimatedEndTime.getSeconds())}`;
     };    
   
     const handleStartSavedTime = (item) => {
       // 選択された時間でタイマーを開始する
       setSelectItems({
         hour: item.hour,
         min: item.min,
         sec: item.sec
       });
       startTime();
     };

     const handleDelete = (index) => {
      const newSavedTimes = savedTimes.filter((_, i) => i !== index);
      setSavedTimes(newSavedTimes);
      saveSavedTimes(newSavedTimes);
    };
   
     const handleShortcut = () => {
       // 選択された時間を保存し、FlatListに追加
       const newSavedTimes = [...savedTimes, selectItems];
       setSavedTimes(newSavedTimes);
       saveSavedTimes(newSavedTimes);
     };

  const SelectTime = () => {
  return (
    <View style={{ marginTop: 20}}>
    <View style={{alignItems: 'center' }}>
     <Text style={{ fontSize: 60, fontFamily: 'Roboto-Regular' }}>
       {timeLimit.hour}:{timeLimit.min}:{timeLimit.sec}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 }}>
        <View style={{ alignItems: 'center' }}>
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
          <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: 'Roboto-Bold' }}>Hour</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
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
          <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: 'Roboto-Bold' }}>Min</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
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
          <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: 'Roboto-Bold' }}>Sec</Text>
        </View>
      </View>
      <PaperButton mode="contained"  onPress={startTime} disabled={isStart || isTimeUp}>
        Start
      </PaperButton>
      <View style={{ marginTop: 20, marginBottom:10, }}>
        <PaperButton mode="contained" onPress={handleShortcut}>
          Add Shortcut
        </PaperButton>
      </View>
      </View>
      <SwipeListView
        data={savedTimes.map((time, index) => ({ key: index.toString(), time: `${zeroPaddingNum(time.hour)}:${zeroPaddingNum(time.min)}:${zeroPaddingNum(time.sec)}`, hour: time.hour, min: time.min, sec: time.sec }))}
        renderItem={({ item, index }) => (
          <TouchableHighlight
            onPress={() => handleStartSavedTime(item)}
            style={{ alignItems: 'center', backgroundColor: 'white', borderBottomColor: 'black', borderBottomWidth: 1, justifyContent: 'center', height: 50 }}
            underlayColor="#DDDDDD"
          >
            <View>
              <Text>{item.time}</Text>
            </View>
          </TouchableHighlight>
        )}
        renderHiddenItem={({ item, index }) => (
          <View style={{ alignItems: 'center', backgroundColor: '#DDD', flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15 }}>
            <TouchableOpacity 
            style={{ alignItems: 'center', bottom: 0, justifyContent: 'center', position: 'absolute', top: 0, width: 75, backgroundColor: 'red', right: 0, }} 
            onPress={() => handleDelete(index)}>
              <Text style={{ color: 'white' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        leftOpenValue={0}
        rightOpenValue={-100}
        keyExtractor={(item) => item.key}
      />
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
          {calculateEstimatedEndTime()}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20  }}>
      <View style={{ marginRight: '10%' }}>
      {isStart ? (
      <PaperButton mode="contained" onPress={stopTime} disabled={!isStart || isTimeUp}>Stop</PaperButton>
      ) : (
      <PaperButton mode="contained" onPress={startTime} disabled={isStart || isTimeUp}>Start</PaperButton>
      )}
      </View>
        <View>
          <PaperButton mode="contained" onPress={resetTime} disabled={isStart} >Reset</PaperButton>
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
