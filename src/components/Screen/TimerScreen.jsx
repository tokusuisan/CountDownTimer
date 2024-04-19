import React from 'react';
import { TimerProvider } from '../Context/TimerContext';
import Timer from '../Countdown/Timer';

const TimerScreen = () => {
    return(
        <TimerProvider>
        <Timer/>
        </TimerProvider>
    )
} 
export default TimerScreen;