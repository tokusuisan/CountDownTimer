import React from 'react';
import { AlarmProvider } from '../Context/AlarmContext';
import Alarm from '../Alarm/Alarm';

const AlarmScreen = () => {
    return(
        <AlarmProvider>
           <Alarm/> 
        </AlarmProvider>
    )
}
export default AlarmScreen;