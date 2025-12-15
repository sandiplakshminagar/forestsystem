import { createContext, useContext, useState } from "react";

const MapContext = createContext();

export function MapProvider({ children }) {
  const [selectedLayer, setSelectedLayer] = useState("forest-cover");
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  return (
    <MapContext.Provider
      value={{
        selectedLayer,
        setSelectedLayer,
        selectedYears,
        setSelectedYears,
        selectedDistrict,
        setSelectedDistrict,
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
