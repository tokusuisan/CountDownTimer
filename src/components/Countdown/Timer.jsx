import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useTimer } from '../Context/TimerContext';
import { Picker } from '@react-native-picker/picker';
import { SwipeListView } from 'react-native-swipe-list-view';
import { StatusBar } from "expo-status-bar";
import SelectDropdown from 'react-native-select-dropdown'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectTimeStyles, timeRemainingStyles } from './style';

const Timer = () => {
  const { selectItems, setSelectItems, isStart, isTimeUp, TIMES, startTime, zeroPaddingNum, timeLimit, stopTime, resetTime, isSelectingTime, vibrationCount, setVibrationCount } = useTimer();
  const [savedTimes, setSavedTimes] = useState([]);
  const vibrationOptions = [10, 20, 30, 40, 50];


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
       return `${zeroPaddingNum(estimatedEndTime.getHours())}:${zeroPaddingNum(estimatedEndTime.getMinutes())}`;
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
    <View style={selectTimeStyles.container}>
       <StatusBar barStyle="dark-content" />
    <View style={{alignItems: 'center' }}>
      <View style={selectTimeStyles.rowContainer}>
        <View style={selectTimeStyles.pickerContainer}>
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
          <Text  style={selectTimeStyles.pickerText}>Hour</Text>
        </View>
        <Text style={selectTimeStyles.pickerKoron}>:</Text>
        <View style={selectTimeStyles.pickerContainer}>
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
          <Text style={selectTimeStyles.pickerText}>Min</Text>
        </View>
        <Text style={selectTimeStyles.pickerKoron}>:</Text>
        <View style={selectTimeStyles.pickerContainer}>
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
          <Text style={selectTimeStyles.pickerText}>Sec</Text>
        </View>
      </View>
      <View>
      </View>
      <View style={selectTimeStyles.rowContainer}>
      <Text style={{ fontSize: 16, fontFamily: 'Roboto-Bold' }}>Vibration Count:</Text>
      <SelectDropdown
        defaultValue={vibrationCount}
        data={vibrationOptions.map((value) => value.toString())} // 文字列の配列を生成
        onSelect={(value) => {
          setVibrationCount(parseInt(value)); // 数値に変換してセット
      }}
        renderButton={(selectedItem, isOpened) => {
      return (
      <View style={selectTimeStyles.dropdownButtonStyle}>
          <Text style={selectTimeStyles.dropdownButtonTxtStyle}> 
            {(selectedItem && selectedItem.toString()) || 'Select'}</Text> 
      </View>
      );
      }}
        renderItem={(item, index, isSelected) => (
        <View style={selectTimeStyles.dropdownItemStyle} key={index}>
          <Text style={selectTimeStyles.dropdownItemTxtStyle}>{item}</Text>
        </View>
      )}
      dropdownStyle={selectTimeStyles.dropdownMenuStyle}
       />
       </View>
       </View>
      <View style={selectTimeStyles.buttonContainer}>
       <PaperButton mode="contained"  onPress={startTime} disabled={isStart || isTimeUp} labelStyle={{ textAlign: 'center', lineHeight: 30 }}>
         Start
       </PaperButton>
       <PaperButton mode="contained" onPress={handleShortcut} labelStyle={{ textAlign: 'center', lineHeight: 30 }}>
          Add Shortcut
        </PaperButton>
      </View>
      <SwipeListView
        data={savedTimes.map((time, index) => ({ key: index.toString(), time: `${zeroPaddingNum(time.hour)}:${zeroPaddingNum(time.min)}:${zeroPaddingNum(time.sec)}`, hour: time.hour, min: time.min, sec: time.sec }))}
        renderItem={({ item, index }) => (
          <TouchableHighlight
            onPress={() => handleStartSavedTime(item)}
            style={selectTimeStyles.swipeItem}
            underlayColor="#DDDDDD"
          >
            <View>
              <Text>{item.time}</Text>
            </View>
          </TouchableHighlight>
        )}
        renderHiddenItem={({ item, index }) => (
          <View style={selectTimeStyles.deleteButtonContainer}>
            <TouchableOpacity 
            style={selectTimeStyles.deleteButton} 
            onPress={() => handleDelete(index)}>
              <Text style={selectTimeStyles.deleteText}>Delete</Text>
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
    <View style={timeRemainingStyles.container}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
      <Text style={timeRemainingStyles.timeText}>
       {timeLimit.hour}:{timeLimit.min}:{timeLimit.sec}
      </Text>
        <Text style={{ fontSize: 20, marginTop: 10 }}>
          {calculateEstimatedEndTime()}
        </Text>
      </View>
      <View style={timeRemainingStyles.buttonContainer}>
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
        {isTimeUp && <Text style={timeRemainingStyles.timeUpText}>Time's up!</Text>}
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
