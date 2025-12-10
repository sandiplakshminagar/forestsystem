import { useEffect, useRef, useState, useMemo } from "react";
import { useMapContext } from "../MapContext";

import Map from "ol/Map.js";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import OSM from "ol/source/OSM.js";
import XYZ from "ol/source/XYZ.js";
import TileWMS from "ol/source/TileWMS.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { Style, Stroke, Fill } from "ol/style.js";
import { fromLonLat } from "ol/proj.js";
import { defaults as defaultControls, Zoom } from "ol/control";

export default function MapComponent() {
  const { selectedLayer, selectedYears } = useMapContext();

  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [currentBaseLayer, setCurrentBaseLayer] = useState(null);

  const baseURL = "https://mlinfomap.org/geoserver/ForestDashboard/wms";

  // ---------------- Basemap Layers ----------------
  const baseLayers = {
    osm: () =>
      new TileLayer({
        source: new OSM({
          attributions: [],
        }),
      }),

    satellite: () =>
      new TileLayer({
        source: new XYZ({
          url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        }),
      }),

    terrain: () =>
      new TileLayer({
        source: new XYZ({
          url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
        }),
      }),

    dark: () =>
      new TileLayer({
        source: new XYZ({
          url: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        }),
      }),
    white: () =>
      new TileLayer({
        source: new XYZ({
          url: "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        }),
      }),
  };
  //---------------- Create ALL layers ONCE using useMemo ----------------
  const layers = useMemo(() => {
    // District boundary layer
    const boundary = new VectorLayer({
      source: new VectorSource({
        url: "https://mlinfomap.org/geoserver/ForestDashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ForestDashboard:4District&outputFormat=application/json",
        format: new GeoJSON(),
      }),
      style: new Style({
        stroke: new Stroke({ color: "red", width: 2 }),
        // fill: new Fill({ color: "rgba(0, 119, 255, 0.3)" }),
      }),
    });

    // FOREST COVER
    const forest = {
      2000: Object.assign(
        new TileLayer({
          source: new TileWMS({
            url: baseURL,
            params: {
              LAYERS: "ForestDashboard:ForestCover_2000",
              TILED: true,
              FORMAT: "image/png",
              TRANSPARENT: true,
            },
            serverType: "geoserver",
          }),
          opacity: 0.7,
        }),
        {
          legendTitle: "Forest Cover (2000)",
          legendUrl:
            baseURL +
            "?service=WMS&request=GetLegendGraphic&format=image/png&layer=ForestDashboard:ForestCover_2000",
        }
      ),

      2020: new TileLayer({
        source: new TileWMS({
          url: baseURL,
          params: {
            LAYERS: "ForestDashboard:ForestCover_2020",
            TILED: true,
            FORMAT: "image/png",
            TRANSPARENT: true,
          },
          serverType: "geoserver",
        }),
        opacity: 0.7,
      }),

      2021: new TileLayer({
        source: new TileWMS({
          url: baseURL,
          params: {
            LAYERS: "ForestDashboard:ForestCover_2021",
            TILED: true,
            FORMAT: "image/png",
            TRANSPARENT: true,
          },
          serverType: "geoserver",
        }),
        opacity: 0.7,
      }),

      2022: new TileLayer({
        source: new TileWMS({
          url: baseURL,
          params: {
            LAYERS: "ForestDashboard:ForestCover_2022",
            TILED: true,
            FORMAT: "image/png",
            TRANSPARENT: true,
          },
          serverType: "geoserver",
        }),
        opacity: 0.7,
      }),
    };
    // TREE ENCROACHMENT
    const encroachment = {
      2020: new TileLayer({
        source: new TileWMS({
          url: baseURL,
          params: {
            LAYERS: "ForestDashboard:MH4Dist_Encroachment_2020",
            TILED: true,
            FORMAT: "image/png",
            TRANSPARENT: true,
          },
          serverType: "geoserver",
        }),
        opacity: 0.7,
      }),

      2021: new TileLayer({
        source: new TileWMS({
          url: baseURL,
          params: {
            LAYERS: "ForestDashboard:MH4Dist_Encroachment_2021",
            TILED: true,
            FORMAT: "image/png",
            TRANSPARENT: true,
          },
          serverType: "geoserver",
        }),
        opacity: 0.7,
      }),

      2022: new TileLayer({
        source: new TileWMS({
          url: baseURL,
          params: {
            LAYERS: "ForestDashboard:MH4Dist_Encroachment_2022",
            TILED: true,
            FORMAT: "image/png",
            TRANSPARENT: true,
          },
          serverType: "geoserver",
        }),
        opacity: 0.7,
      }),
    };
    // FOREST FIRE
    const fire = {
      2020: new TileLayer({
        source: new TileWMS({
          url: baseURL,
          params: {
            LAYERS: "ForestDashboard:MH4Dist_burned_forest_2020",
            TILED: true,
            FORMAT: "image/png",
            TRANSPARENT: true,
          },
          serverType: "geoserver",
        }),
        opacity: 0.7,
      }),

      2021: new TileLayer({
        source: new TileWMS({
          url: baseURL,
          params: {
            LAYERS: "ForestDashboard:MH4Dist_burned_forest_2021",
            TILED: true,
            FORMAT: "image/png",
            TRANSPARENT: true,
          },
          serverType: "geoserver",
        }),
        opacity: 0.7,
      }),

      2022: new TileLayer({
        source: new TileWMS({
          url: baseURL,
          params: {
            TILED: true,
            FORMAT: "image/png",
            TRANSPARENT: true,
          },
          serverType: "geoserver",
        }),
        opacity: 0.7,
      }),

      frequency: new TileLayer({
        source: new TileWMS({
          url: baseURL,
          params: {
            LAYERS: "ForestDashboard:MH_4Dist_FireFrequency_2019_2023",
            TILED: true,
            FORMAT: "image/png",
            TRANSPARENT: true,
          },
          serverType: "geoserver",
        }),

        visible: false,
      }),

      pressure: new TileLayer({
        source: new TileWMS({
          url: baseURL,
          params: {
            LAYERS: "ForestDashboard:MH_4Dist_HumanPressure_gHM",
            TILED: true,
            FORMAT: "image/png",
            TRANSPARENT: true,
          },
          serverType: "geoserver",
        }),

        visible: false,
      }),
    };

    boundary.setZIndex(999);
    // Burned forest layers (high)
    Object.keys(fire).forEach((key) => {
      if (["2020", "2021", "2022"].includes(key)) {
        fire[key].setZIndex(400);
      }
    });
    // Encroachment below burned
    Object.values(encroachment).forEach((layer) => layer.setZIndex(300));

    // Human Pressure (third)
    fire.pressure.setZIndex(250);

    // Fire Frequency (second last)
    fire.frequency.setZIndex(200);

    // Forest layers (bottom)
    Object.values(forest).forEach((layer) => layer.setZIndex(100));

    // Return layers
    return { boundary, forest, encroachment, fire };
  }, []);
  // ---------------- Initialize map ONLY ONCE ----------------
  useEffect(() => {
    if (!mapRef.current || mapRef.current._initialized) return;
    mapRef.current._initialized = true;
    const base = baseLayers.osm();
    const mapObj = new Map({
      target: mapRef.current,
      controls: defaultControls({
        zoom: false, // remove default zoom
        rotate: false, // remove rotate icon (⇧)
      }).extend([
        new Zoom({
          className: "custom-zoom-control", // your custom zoom
        }),
      ]),
      layers: [
        base,
        layers.boundary,
        ...Object.values(layers.forest),
        ...Object.values(layers.encroachment),
        ...Object.values(layers.fire),
      ],
      view: new View({
        center: fromLonLat([78.9629, 20.5937]),
        zoom: 7,
      }),
    });
    const extend = layers.boundary.getSource();
    extend.once("featuresloadend", () => {
      const extent = extend.getExtent();
      mapObj.getView().fit(extent, {
        padding: [30, 20, 30, 20],
      });
    });

    setCurrentBaseLayer(base);
    setMap(mapObj);
  }, [map, layers]);

  // ---------------- Apply Layer Visibility ----------------
  useEffect(() => {
    if (!map) return;

    // Hide all years EXCEPT manual panel layers
    Object.entries(layers.forest).forEach(([year, layer]) => {
      if (year !== "2000") layer.setVisible(false);
    });

    Object.entries(layers.encroachment).forEach(([year, layer]) => {
      layer.setVisible(false);
    });

    Object.entries(layers.fire).forEach(([key, layer]) => {
      if (key !== "frequency" && key !== "pressure") {
        layer.setVisible(false);
      }
    });

    // --- Forest Cover selection ---
    if (selectedLayer === "forest-cover") {
      selectedYears.forEach((y) => {
        if (y !== "2000") layers.forest[y]?.setVisible(true);
      });
    }

    // --- Encroachment ---
    if (selectedLayer === "Encroachment") {
      selectedYears.forEach((y) => layers.encroachment[y]?.setVisible(true));
    }

    // --- Burned Forest ---
    if (selectedLayer === "Burned Forest") {
      selectedYears.forEach((y) => {
        layers.fire[y]?.setVisible(true);
      });
    }
  }, [selectedLayer, selectedYears, map, layers]);

  // ---------------- Basemap Switcher ----------------
  function switchBasemap(name) {
    if (!map) return;
    const newBase = baseLayers[name]();
    map.removeLayer(currentBaseLayer);
    map.getLayers().insertAt(0, newBase);
    setCurrentBaseLayer(newBase);
  }

  return (
    <div className="relative w-full h-[calc(100vh-163px)]">
      <div className="absolute right-6 top-40 z-10 text-sm bg-[#eff8f9] px-1 py-1 rounded shadow">
        <select
          onChange={(e) => switchBasemap(e.target.value)}
          className="bg-[#eff8f9] text-gray-900 px-3 py-1 rounded
        border border-[#eff8f9] outline-none cursor-pointer
        focus:ring-2 focus:ring-[#eff8f9]"
        >
          <option className="bg-[#eff8f9] text-gray-900" value="osm">
            OSM Standard
          </option>
          <option className="bg-[#eff8f9] text-gray-900" value="satellite">
            Satellite
          </option>
          <option className="bg-[#eff8f9] text-gray-900" value="terrain">
            Terrain
          </option>
          <option className="bg-[#eff8f9] text-gray-900" value="dark">
            Dark
          </option>
          <option value="white">white</option>
        </select>
      </div>

      {/* LAYER PANEL (Top-Right) */}
      <div className="absolute right-7 top-10 z-30 bg-[#eff8f9] p-3 rounded shadow-md w-35">
        <strong className="block mb-1">Map Layers</strong>

        {/* Forest Cover 2000 */}
        <label className="flex items-center gap-2 text-xs mb-1 ">
          <input
            type="checkbox"
            defaultChecked={true}
            onChange={(e) => layers.forest["2000"].setVisible(e.target.checked)}
          />
          Forest 2000
        </label>

        {/* Fire Frequency */}
        <label className="flex items-center gap-2 text-xs mb-1">
          <input
            type="checkbox"
            defaultChecked={false}
            onChange={(e) => {
              layers.fire.frequency.setVisible(e.target.checked);
            }}
          />
          Fire Frequency
        </label>

        {/* Human Pressure */}
        <label className="flex items-center gap-2 text-xs mb-1">
          <input
            type="checkbox"
            defaultChecked={false}
            onChange={(e) => {
              layers.fire.pressure.setVisible(e.target.checked);
            }}
          />
          Human Pressure
        </label>
      </div>
      {/* Footer Text (Powered by ML Infomap) */}
      <div
        className="
    absolute bottom-0 left-1/2 -translate-x-1/2
    text-[16px] font-medium text-white
    bg-[#0fa4af]
    px-5 py-1
    rounded-t-[15px]
    z-10 pointer-events-none
    shadow-md
  "
      >
        Powered by ML Infomap
      </div>

      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
}
