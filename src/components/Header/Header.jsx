import { useState } from "react";

const fireData = [
  {
    district: "Bhandara",
    year: 2020,
    burned_km2: 0,
    encroach_km2: 0.096,
    fire_bio_km2: 0,
    fire_risk_km2: 0,
  },
  {
    district: "Chandrapur",
    year: 2020,
    burned_km2: 8.18,
    encroach_km2: 0,
    fire_bio_km2: 16.36,
    fire_risk_km2: 3.75,
  },
  {
    district: "Gadchiroli",
    year: 2020,
    burned_km2: 336.38,
    encroach_km2: 49.49,
    fire_bio_km2: 353.7,
    fire_risk_km2: 96.17,
  },

  {
    district: "Bhandara",
    year: 2021,
    burned_km2: 14.82,
    encroach_km2: 0.096,
    fire_bio_km2: 29.64,
    fire_risk_km2: 5.02,
  },
  {
    district: "Chandrapur",
    year: 2021,
    burned_km2: 763.49,
    encroach_km2: 0,
    fire_bio_km2: 1518.87,
    fire_risk_km2: 289.49,
  },
  {
    district: "Gadchiroli",
    year: 2021,
    burned_km2: 2417.79,
    encroach_km2: 44.28,
    fire_bio_km2: 3470.19,
    fire_risk_km2: 744.83,
  },

  {
    district: "Bhandara",
    year: 2022,
    burned_km2: 11.37,
    encroach_km2: 0.096,
    fire_bio_km2: 22.74,
    fire_risk_km2: 4.17,
  },
  {
    district: "Chandrapur",
    year: 2022,
    burned_km2: 338.91,
    encroach_km2: 0,
    fire_bio_km2: 667.45,
    fire_risk_km2: 126.96,
  },
  {
    district: "Gadchiroli",
    year: 2022,
    burned_km2: 1304.02,
    encroach_km2: 38.14,
    fire_bio_km2: 1851.45,
    fire_risk_km2: 390.52,
  },
];

export default function Header() {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Extract unique districts
  const districts = [...new Set(fireData.map((d) => d.district))];

  // Available years based on chosen district
  const years = selectedDistrict
    ? [
        ...new Set(
          fireData
            .filter((d) => d.district === selectedDistrict)
            .map((d) => d.year)
        ),
      ]
    : [];

  // Filtered record (city + year)
  const record =
    selectedDistrict && selectedYear
      ? fireData.find(
          (d) =>
            d.district === selectedDistrict && d.year === Number(selectedYear)
        )
      : null;

  return (
    <header className="bg-[#0fa4af] text-white shadow">
      <div className="mx-auto py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between ml-12 mr-6">
        {/* LEFT SIDE */}
        <div>
          <h1 className="text-4xl font-bold tracking-wide leading-tight">
            Forest Monitoring System
          </h1>
          <p className="text-[20px] text-green-100 mt-0.5 leading-tight">
            Welcome to Forest Monitoring Dashboard
          </p>
        </div>

        {/* RIGHT SIDE - Dependent Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
          {/* DISTRICT DROPDOWN */}
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedYear(""); // reset year
            }}
            className="text-black px-3 py-1 rounded"
          >
            <option value="">Select District</option>
            {districts.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* YEAR DROPDOWN (depends on district) */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={!selectedDistrict}
            className="text-black px-3 py-1 rounded disabled:bg-gray-300"
          >
            <option value="">Select Year</option>
            {years.map((y, i) => (
              <option key={i} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* SHOW FILTERED DATA INSIDE A SMALL DROPDOWN STYLE BOX */}
          {record && (
            <div className="bg-white text-black px-4 py-2 rounded shadow">
              <div>
                <b>
                  {record.district} ({record.year})
                </b>
              </div>
              <div>Burned: {record.burned_km2} km²</div>
              <div>Encroach: {record.encroach_km2} km²</div>
              <div>Fire Bio: {record.fire_bio_km2} km²</div>
              <div>Risk: {record.fire_risk_km2} km²</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
