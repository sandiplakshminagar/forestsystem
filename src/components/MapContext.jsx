import { createContext, useContext, useState } from "react";

const MapContext = createContext();

export function MapProvider({ children }) {
  const [selectedLayer, setSelectedLayer] = useState("forest-cover");
  const [selectedYears, setSelectedYears] = useState([]);

  return (
    <MapContext.Provider
      value={{
        selectedLayer,
        setSelectedLayer,
        selectedYears,
        setSelectedYears,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

// Custom hook (declare only once)
export function useMapContext() {
  return useContext(MapContext);
}
