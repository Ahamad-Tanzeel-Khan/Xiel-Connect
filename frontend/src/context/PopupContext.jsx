import React, { createContext, useContext, useState } from 'react';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState(null);
  
  const openPopup = (type) => {
    setPopupType(type);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPopupType(null);
  };

  return (
    <PopupContext.Provider value={{ isPopupVisible, popupType, openPopup, closePopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
