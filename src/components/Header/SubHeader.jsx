import { Radio, RadioGroup, FormControlLabel, Checkbox } from "@mui/material";

import { useMapContext } from "../MapContext";

export default function SubHeader() {
  const { selectedLayer, setSelectedLayer, selectedYears, setSelectedYears } =
    useMapContext();

  const years = ["2020", "2021", "2022"];
  const handleLayerChange = (e) => {
    setSelectedLayer(e.target.value);
  };

  const toggleYear = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  return (
    <div className="bg-[#eff8f9] border-b shadow-sm">
      <div
        className="max-w-8xl mx-auto px-12 py-3 
                  flex flex-col md:flex-row md:items-center md:justify-between 
                  gap-4"
      >
        {/* RADIO + YEARS IN ROW */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <h2 className="text-[#0fa4af] font-semibold text-lg mb-1 md:mb-0">
            Select Layer
          </h2>

          <RadioGroup
            row
            value={selectedLayer}
            onChange={handleLayerChange}
            className="flex items-center gap-4 text-lg text-gray-700 whitespace-nowrap"
          >
            <FormControlLabel
              value="forest-cover"
              control={
                <Radio
                  sx={{
                    color: "#0fa4af",
                    "&.Mui-checked": { color: "#0fa4af" },
                  }}
                />
              }
              label="Forest Cover"
            />

            <FormControlLabel
              value="Encroachment"
              control={
                <Radio
                  sx={{
                    color: "#0fa4af",
                    "&.Mui-checked": { color: "#0fa4af" },
                  }}
                />
              }
              label="Encroachment"
            />

            <FormControlLabel
              value="Burned Forest"
              control={
                <Radio
                  sx={{
                    color: "#0fa4af",
                    "&.Mui-checked": { color: "#0fa4af" },
                  }}
                />
              }
              label="Fire Forest"
            />
          </RadioGroup>
        </div>

        {/* Horizontal Years */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <h2 className="text-[#0fa4af] font-semibold text-lg mb-1 md:mb-0">
            Select Year
          </h2>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            {years.map((year) => (
              <label
                key={year}
                className="flex items-center gap-1 text-lg text-gray-700 whitespace-nowrap"
              >
                <Checkbox
                  size="small"
                  checked={selectedYears.includes(year)}
                  onChange={() => toggleYear(year)}
                  sx={{
                    color: "#0fa4af",
                    "&.Mui-checked": { color: "#0fa4af" },
                  }}
                />
                {year}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
