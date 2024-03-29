import React, { createContext, useState, useContext } from 'react';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const TIMES = {
    hour: [...Array(24).keys()],
    min: [...Array(60).keys()],
    sec: [...Array(60).keys()]
  };

  const [selectItems, setSelectItems] = useState(() => {
    const newItems = {};
    Object.keys(TIMES).forEach((name, i) => {
      newItems[name] = TIMES[name][0];
    });
    return newItems;
  });

  const [timeLimit, setTimeLimit] = useState(selectItems);
  const [isStart, setIsStart] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isReset, setIsReset] = useState(false);

  return (
    <TimerContext.Provider value={{
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
      TIMES
    }}>
      {children}
    </TimerContext.Provider>
  );
};
