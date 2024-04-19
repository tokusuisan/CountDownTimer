import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useAlarm } from '../Context/AlarmContext';
import { Picker } from '@react-native-picker/picker';
import { SwipeListView } from 'react-native-swipe-list-view';
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectTimeStyles, timeRemainingStyles } from './style';

const Alarm = () => {
    const { ALARMTIMES, selectAItems, setSelectAItems, timeALimit, AlarmStart, AlarmReset, isTimeUp, isSelectingTime, vibrationCount, setVibrationCount, zeroPaddingNum, countdownTime} = useAlarm();
    const [savedTimes, setSavedTimes] = useState([]);
    const vibrationOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        // アプリ起動時に保存された時間を読み込む
        const getSavedTimes = async () => {
          try {
            const jsonValue = await AsyncStorage.getItem('@alarm_saved_times'); // キー名を直接指定
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
          await AsyncStorage.setItem('@alarm_saved_times', jsonValue); // キー名を直接指定
        } catch (e) {
          console.error('Error saving times to AsyncStorage:', e);
        }
      };
    
      const handleStartSavedTime = (item) => {
        // 選択された時間でタイマーを開始する
        setSelectAItems({
          hour: item.hour,
          min: item.min,
        });
        Start();
      };
    
      const handleDelete = (index) => {
        const newSavedTimes = savedTimes.filter((_, i) => i !== index);
        setSavedTimes(newSavedTimes);
        saveSavedTimes(newSavedTimes);
      };
    
      const handleShortcut = () => {
        // 選択された時間を保存し、FlatListに追加
        const newSavedTimes = [...savedTimes, selectAItems];
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
                  selectedValue={selectAItems.hour}
                  onValueChange={(itemValue) =>
                    setSelectAItems((prevItems) => ({ ...prevItems, hour: itemValue }))
                  }
                  style={{ width: 100 }}
                  itemStyle={{color:'#CCCCCC'}}
                >
                  {ALARMTIMES.hour.map((hour) => (
                    <Picker.Item key={hour} label={zeroPaddingNum(hour)} value={hour}/>
                  ))}
                </Picker>
                <Text  style={selectTimeStyles.pickerText}>Hour</Text>
              </View>
              <Text style={selectTimeStyles.pickerKoron}>:</Text>
              <View style={selectTimeStyles.pickerContainer}>
                <Picker
                  selectedValue={selectAItems.min}
                  onValueChange={(itemValue) =>
                    setSelectAItems((prevItems) => ({ ...prevItems, min: itemValue }))
                  }
                  style={{ width: 100 }}
                  itemStyle={{color:'#CCCCCC'}}
                >
                  {ALARMTIMES.min.map((min) => (
                    <Picker.Item key={min} label={zeroPaddingNum(min)} value={min} />
                  ))}
                </Picker>
                <Text style={selectTimeStyles.pickerText}>Min</Text>
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
              renderButton={(selectedItem) => {
            return (
            <View style={selectTimeStyles.dropdownButtonStyle}>
                <Text style={selectTimeStyles.dropdownButtonTxtStyle}> 
                  {(selectedItem && selectedItem.toString()) || 'Select'}</Text> 
            </View>
            );
            }}
              renderItem={(item, index) => (
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
             onPress={AlarmStart} 
             labelStyle={{ textAlign: 'center', lineHeight: 30, color: '#00B06B'}}
             >
               Start
             </PaperButton>
             <PaperButton
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="alarm-plus" size={size} color={color} />
              )} 
             mode="outlined" 
             onPress={handleShortcut} 
             labelStyle={{ textAlign: 'center', lineHeight: 30, color: '#FFFFFF'}}
             >
                Add Shortcut
              </PaperButton>
            </View>
            <SwipeListView
              data={savedTimes.map((time, index) => ({ key: index.toString(), time: `${zeroPaddingNum(time.hour)}:${zeroPaddingNum(time.min)}`, hour: time.hour, min: time.min }))}
              renderItem={({ item }) => (
                <TouchableHighlight
                  onPress={() => handleStartSavedTime(item)}
                  style={selectTimeStyles.swipeItem}
                >
                  <View>
                    <Text  style={{ fontSize: 16, fontFamily: 'Roboto-Bold', color:'#F5F5F5' }}>{item.time}</Text>
                  </View>
                </TouchableHighlight>
              )}
              renderHiddenItem={({ index }) => (
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
              {countdownTime.hour}:{countdownTime.min}
              </Text>
            </View>
            <View style={{ alignItems: 'center', flexDirection:'row', justifyContent: "space-around", marginBottom: 20}}>
              <MaterialCommunityIcons name="bell" size={20} color='#9E9E9E' style={{marginRight:3, marginTop:3}} />
              <Text style={{ fontSize: 20, marginTop: 5, color:'#9E9E9E' }}>
              {timeALimit.hour}:{timeALimit.min}
              </Text>
            </View>
            <View style={timeRemainingStyles.buttonContainer}>
              <View>
                <PaperButton 
                mode="outlined" 
                onPress={AlarmReset} 
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
}
export default Alarm;