import Header from "./components/Header/Header";
import SubHeader from "./components/Header/SubHeader";
import Map from "./components/MapComponent/Map";
import { MapProvider } from "./components/MapContext";
import "./index.css";

function App() {
  return (
    <MapProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <SubHeader />
        <Map />
      </div>
    </MapProvider>
  );
}

export default App;
