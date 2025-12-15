import { useState, useEffect } from "react";
import { useMapContext } from "../MapContext";
import fire_data from "../../assets/fire_data.json";
import MLLogo from "../../assets/MLLogoSmall.png";


export default function Header() {
  const {
    selectedDistrict,
    setSelectedDistrict,
    selectedLayer,
    selectedYears,
  } = useMapContext();

  // Record for meters

  const [record, setSelectedRecord] = useState(null);

  const districts = [...new Set(fire_data.map((d) => d.district))];

  const years = selectedDistrict
    ? [
        ...new Set(
          fire_data
            .filter((d) => d.district === selectedDistrict)
            .map((d) => d.year)
        ),
      ]
    : [];

  useEffect(() => {
    if (!selectedDistrict || selectedYears.length === 0) {
      setSelectedRecord(null);
      return;
    }

    const records = fire_data.filter(
      (d) =>
        d.district === selectedDistrict &&
        selectedYears.includes(String(d.year))
    );

    const safeAdd = (a, b, precision = 2) => Number((a + b).toFixed(precision));
    const summedRecord = records.reduce(
      (acc, curr) => ({
        burned_km2: safeAdd(acc.burned_km2, curr.burned_km2 || 0),
        encroach_km2: safeAdd(acc.encroach_km2, curr.encroach_km2 || 0),
        fire_bio_km2: safeAdd(acc.fire_bio_km2, curr.fire_bio_km2 || 0),
        fire_risk_km2: safeAdd(acc.fire_risk_km2, curr.fire_risk_km2 || 0),
      }),
      {
        burned_km2: 0,
        encroach_km2: 0,
        fire_bio_km2: 0,
        fire_risk_km2: 0,
      }
    );
    setSelectedRecord(summedRecord);
  }, [selectedDistrict, selectedYears]);

  return (
    <header className="bg-[#0fa4af] text-white shadow">
      <div className="mx-auto py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between ml-12 mr-10">
        {/* LEFT SIDE TITLE */}
      {/* LEFT SIDE TITLE */}
<div className="flex items-center gap-7">
  <img
    src={MLLogo}
    alt="Logo"
    className="h-15 w-15 object-contain"
  />

  <h1 className="text-4xl font-bold tracking-wide leading-tight">
    Forest Monitoring Dashboard
  </h1>
</div>


        {/* DIGITAL METERS ROW (4 Meters) */}
        <div className="flex gap-4 mt-3 sm:mt-0">
          {/* Burned – only for Burned Forest layer */}
          <div className="flex flex-col items-center">
            <label className="text-white text-sm mb-1 font-semibold">
              Burned (km²)
            </label>
            <div
              className="flex justify-center items-center bg-[#024950] text-white font-mono 
                         text-xl px-4 py-2 rounded tracking-widest"
              style={{ width: "110px" }}
            >
              {selectedLayer === "Burned Forest"
                ? String(record?.burned_km2 ?? "0").padStart(4, "0")
                : "0000"}
            </div>
          </div>

          {/* Encroachment – only for Encroachment layer */}
          <div className="flex flex-col items-center">
            <label className="text-white text-sm mb-1 font-semibold">
              Encroachment (km²)
            </label>
            <div
              className="flex justify-center items-center bg-[#024950] text-white font-mono 
      text-xl px-4 py-2 rounded tracking-widest"
              style={{ width: "110px" }}
            >
              {selectedLayer === "Encroachment"
                ? String(record?.encroach_km2 ?? "0").padStart(4, "0")
                : "0000"}
            </div>
          </div>

          {/* Fire Bio – only for Burned Forest */}
          <div className="flex flex-col items-center">
            <label className="text-white text-sm mb-1 font-semibold">
              Fire Bio (km²)
            </label>
            <div
              className="flex justify-center items-center bg-[#024950] text-white font-mono 
      text-xl px-4 py-2 rounded tracking-widest"
              style={{ width: "110px" }}
            >
              {selectedLayer === "Burned Forest"
                ? String(record?.fire_bio_km2 ?? "0").padStart(4, "0")
                : "0000"}
            </div>
          </div>

          {/* Fire Risk – only for Burned Forest */}
          <div className="flex flex-col items-center">
            <label className="text-white text-sm mb-1 font-semibold">
              Fire Risk (km²)
            </label>
            <div
              className="flex justify-center items-center bg-[#024950] text-white font-mono 
      text-xl px-4 py-2 rounded tracking-widest"
              style={{ width: "110px" }}
            >
              {selectedLayer === "Burned Forest"
                ? String(record?.fire_risk_km2 ?? "0").padStart(4, "0")
                : "0000"}
            </div>
          </div>
        </div>

        {/*  DROPDOWNS */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0  p-2 rounded">
          {/* District */}
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
            }}
            className="bg-[#eff8f9] text-black px-3 py-1 rounded mt-4
             border border-[#eff8f9] outline-none
             focus:ring-2 focus:ring-[#057179]"
          >
            <option value="" className="bg-[#eff8f9] text-gray-700">
              Select District
            </option>
            {districts.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

/*1. highlighted the region based on the district selection of  the forest
2. make a digital meter on the headder part to show the value 
3.make the div dynamic to show the value after selction of the  district and year 
4. */
