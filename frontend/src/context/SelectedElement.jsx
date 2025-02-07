import { createContext, useContext, useState } from "react";

const SelectedElementContext = createContext();

export const SelectedElementProvider = ({ children }) => {
  const [selectedElement, setSelectedElement] = useState("chat");

  return (
    <SelectedElementContext.Provider value={{ selectedElement, setSelectedElement }}>
      {children}
    </SelectedElementContext.Provider>
  );
};

export const useSelectedElement = () => {
  return useContext(SelectedElementContext);
};
