import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useTimer } from '../Context/TimerContext';
import { Picker } from '@react-native-picker/picker';
import { SwipeListView } from 'react-native-swipe-list-view';
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectTimeStyles, timeRemainingStyles } from './style';

const Timer = () => {
  const { selectItems, setSelectItems, isStart, isTimeUp, TIMES, startTime, zeroPaddingNum, timeLimit, stopTime, resetTime, isSelectingTime, vibrationCount, setVibrationCount } = useTimer();
  const [savedTimes, setSavedTimes] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
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

     useEffect(() => {
      //00:00:00ではボタンを無効化する
      if (
        zeroPaddingNum(timeLimit.hour) === '00' &&
        zeroPaddingNum(timeLimit.min) === '00' &&
        zeroPaddingNum(timeLimit.sec) === '00'
        ) 
      {
        setDisableButton(true);
      } else {
        setDisableButton(false);
      }
      }, [timeLimit]);
   
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
       <StatusBar  style="light" />
      <View style={{alignItems: 'center' }}>
      <View style={selectTimeStyles.rowContainer}>
        <View style={selectTimeStyles.pickerContainer}>
          <Picker
            selectedValue={selectItems.hour}
            onValueChange={(itemValue) =>
              setSelectItems((prevItems) => ({ ...prevItems, hour: itemValue }))
            }
            style={{ width: 100 }}
            itemStyle={{color:'#CCCCCC'}}
          >
            {TIMES.hour.map((hour) => (
              <Picker.Item key={hour} label={zeroPaddingNum(hour)} value={hour}/>
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
            itemStyle={{color:'#CCCCCC'}}
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
            itemStyle={{color:'#CCCCCC'}}
          >
            {TIMES.sec.map((sec) => (
              <Picker.Item key={sec} label={zeroPaddingNum(sec)} value={sec} />
            ))}
          </Picker>
          <Text style={selectTimeStyles.pickerText}>Sec</Text>
        </View>
      </View>
      <View style={selectTimeStyles.rowContainer}>
      <Text style={{ fontSize: 16, fontFamily: 'Roboto-Bold', color:'#F5F5F5' }}>Vibration Count: </Text>
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
       <PaperButton 
       mode="outlined"  
       onPress={startTime} 
       disabled={disableButton || isStart || isTimeUp}
       labelStyle={{ textAlign: 'center', lineHeight: 30, color: disableButton || isStart || isTimeUp ? '#9E9E9E' : '#00B06B'}}
       >
         Start
       </PaperButton>
       <PaperButton
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="alarm-plus" size={size} color={color} />
        )} 
       mode="outlined" 
       onPress={handleShortcut} 
       disabled={disableButton || isStart || isTimeUp}
       labelStyle={{ textAlign: 'center', lineHeight: 30, color: disableButton || isStart || isTimeUp ? '#9E9E9E' : '#FFFFFF'}}
       >
          Add Shortcut
        </PaperButton>
      </View>
      <SwipeListView
        data={savedTimes.map((time, index) => ({ key: index.toString(), time: `${zeroPaddingNum(time.hour)}:${zeroPaddingNum(time.min)}:${zeroPaddingNum(time.sec)}`, hour: time.hour, min: time.min, sec: time.sec }))}
        renderItem={({ item, index }) => (
          <TouchableHighlight
            onPress={() => handleStartSavedTime(item)}
            style={selectTimeStyles.swipeItem}
          >
            <View>
              <Text  style={{ fontSize: 16, fontFamily: 'Roboto-Bold', color:'#F5F5F5' }}>{item.time}</Text>
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
      <View style={{ alignItems: 'center', marginBottom: 5 }}>
        <Text style={timeRemainingStyles.timeText}>
        {timeLimit.hour}:{timeLimit.min}:{timeLimit.sec}
        </Text>
      </View>
      <View style={{ alignItems: 'center', flexDirection:'row', justifyContent: "space-around", marginBottom: 20}}>
        <MaterialCommunityIcons name="bell" size={20} color='#9E9E9E' style={{marginRight:3, marginTop:3}} />
        <Text style={{ fontSize: 20, marginTop: 5, color:'#9E9E9E' }}>
          {calculateEstimatedEndTime()}
        </Text>
      </View>
      <View style={timeRemainingStyles.buttonContainer}>
        <View style={{ marginRight: '10%' }}>
          {isStart ? (
            <PaperButton
            mode="outlined"
            onPress={stopTime} 
            disabled={!isStart || isTimeUp } 
            labelStyle={{color:'#F6AA00'}}
            >
            Pause
            </PaperButton>
          ) : (
            <PaperButton 
            mode="outlined" 
            onPress={startTime} 
            disabled={isStart || isTimeUp }  
            labelStyle={{color:'#00B06B'}}
            >
            Resume
            </PaperButton>
          )}
        </View>
        <View>
          <PaperButton 
          mode="outlined" 
          onPress={resetTime} 
          disabled={isStart} 
          labelStyle={{color:'#9E9E9E'}}
          >
          Reset
          </PaperButton>
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
