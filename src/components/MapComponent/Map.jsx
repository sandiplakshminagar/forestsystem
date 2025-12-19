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
  const { selectedLayer, selectedYears, selectedDistrict } = useMapContext();

  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [currentBaseLayer, setCurrentBaseLayer] = useState(null);
  // ---------------- DYNAMIC COLOR LEGEND COMPONENT ----------------
  const YEAR_COLORS = {
    2020: "",
    2021: "",
    2022: "",
  };

  // ---------------- Basemap Layers ----------------
  const baseURL = "https://mlinfomap.org/geoserver/ForestDashboard/wms";
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

        format: new GeoJSON({}),
      }),
      style: new Style({
        stroke: new Stroke({ color: "red", width: 2 }),
        // fill: new Fill({ color: "rgba(0, 119, 255, 0.3)" }),
      }),
    });

    const clickHighlightLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({ color: "orange", width: 2 }),
        fill: new Fill({ color: "yellow" }),
      }),
    });
    clickHighlightLayer.setZIndex(2100);
    const districtHighlightLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({ color: "blue", width: 4 }),
      }),
    });
    districtHighlightLayer.setZIndex(2000);

    // FOREST COVER
    // ---------------- FOREST COVER LOST VECTOR LAYERS ----------------
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
          url: "https://mlinfomap.org/geoserver/ForestDashboard/wms",
          params: {
            LAYERS: "ForestDashboard:ForestCoverLost2020",
            TILED: true,
            FORMAT: "image/png",
            TRANSPARENT: true,
          },
          serverType: "geoserver",
        }),
        visible: false,
        opacity: 0.7,
      }),

      // 2020: new VectorLayer({
      //   source: new VectorSource({
      //     url: `https://mlinfomap.org/geoserver/ForestDashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ForestDashboard:ForestCoverLost2020&outputFormat=application/json`,
      //     format: new GeoJSON(),
      //   }),
      //   visible: false,
      // }),

      2021: new VectorLayer({
        source: new VectorSource({
          url: "https://mlinfomap.org/geoserver/ForestDashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ForestDashboard:ForestCoverLost2021&outputFormat=application/json",

          format: new GeoJSON(),
        }),
        visible: false,
      }),

      2022: new VectorLayer({
        source: new VectorSource({
          url: "https://mlinfomap.org/geoserver/ForestDashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ForestDashboard:forestcoverlost2022&outputFormat=application/json",

          format: new GeoJSON(),
        }),
        visible: false,
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
            LAYERS: "ForestDashboard:ForestFire2020",
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
            LAYERS: "ForestDashboard:ForestFire2021",
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
            LAYERS: "ForestDashboard:ForestFire2022",
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

    // Boundary always on top
    boundary.setZIndex(999);

    //  Burned Forest (ordered by year)
    fire["2020"]?.setZIndex(130);
    fire["2021"]?.setZIndex(120);
    fire["2022"]?.setZIndex(110);

    //  Encroachment (below burned, ordered)
    encroachment["2020"]?.setZIndex(150);
    encroachment["2021"]?.setZIndex(140);
    encroachment["2022"]?.setZIndex(160);

    //  Human layers
    fire.pressure.setZIndex(10);
    fire.frequency.setZIndex(20);

    //  Forest cover (bottom-most, ordered)
    forest["2000"]?.setZIndex(100);
    forest["2020"]?.setZIndex(130);
    forest["2021"]?.setZIndex(120);
    forest["2022"]?.setZIndex(110);

    // Return layers
    return {
      districtHighlightLayer,
      clickHighlightLayer,
      boundary,
      forest,
      encroachment,
      fire,
    };
  }, []);



  // this pop for vactor layer also highlight the working//
  useEffect(() => {
    if (!map || !layers) return;
    const popupEl = document.getElementById("map-popup");
    const handleClick = (evt) => {
      let clickedFeature = null;
      let clickedLayer = null;
      map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        clickedFeature = feature;
        clickedLayer = layer;
        return true;
      });

      // Clicked empty space
      if (!clickedFeature) {
        popupEl.classList.add("hidden");
        layers.clickHighlightLayer.getSource().clear();
        return;
      }

      // Show ONLY forest loss layers
      if (
        clickedLayer !== layers.forest[2020] &&
        clickedLayer !== layers.forest[2021] &&
        clickedLayer !== layers.forest[2022]
      ) {
        return;
      }

      const props = clickedFeature.getProperties();

      // ----------  HIGHLIGHT ----------
      layers.clickHighlightLayer.getSource().clear();

      const clone = clickedFeature.clone();
      clone.setGeometry(clickedFeature.getGeometry().clone());

      layers.clickHighlightLayer.getSource().addFeature(clone);

      // ----------  FORMAT VALUES ----------

      // Area → 3 digits after decimal
      const areaFormatted =
        props.Area !== undefined ? Number(props.Area).toFixed(3) : "N/A";

      // Date → readable format
      const dateFormatted = props.DateOfObse
        ? new Date(props.DateOfObse).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A";

      // ---------- POPUP ----------
      popupEl.innerHTML = `
      <b>District:</b> ${props.district || "N/A"}<br/>
      <b>Area:</b> ${areaFormatted} km² <br/>
      <b>Date:</b> ${dateFormatted}
    `;

      popupEl.style.left = evt.pixel[0] + "px";
      popupEl.style.top = evt.pixel[1] - 10 + "px";
      popupEl.classList.remove("hidden");
    };

    map.on("singleclick", handleClick);

    return () => {
      map.un("singleclick", handleClick);
    };
  }, [map, layers]);


  // this is for pop vactor to wms layer but doesn't highlight only show infomation //
  useEffect(() => {
    if (!map || !layers) return;

    const popupEl = document.getElementById("map-popup");

    const handleClick = (evt) => {
      popupEl.classList.add("hidden");

      // ONLY for ForestCoverLost2020
      if (!layers.forest[2020].getVisible()) return;

      const view = map.getView();
      const viewResolution = view.getResolution();

      const wmsSource = layers.forest[2020].getSource();

      const url = wmsSource.getFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        view.getProjection(),
        {
          INFO_FORMAT: "application/json", // 
          QUERY_LAYERS: "ForestDashboard:ForestCoverLost2020",
        }
      );

      if (!url) return;

      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          if (!json.features || json.features.length === 0) return;

          const props = json.features[0].properties;

          popupEl.innerHTML = `
          <b>District:</b> ${props.district || "N/A"}<br/>
          <b>Area:</b> ${
            props.Area !== undefined ? Number(props.Area).toFixed(3) : "N/A"
          } km² <br/>
          <b>Date:</b> ${
            props.DateOfObse
              ? new Date(props.DateOfObse).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"
          }
        `;

          popupEl.style.left = evt.pixel[0] + "px";
          popupEl.style.top = evt.pixel[1] - 10 + "px";
          popupEl.classList.remove("hidden");
        });
    };

    map.on("singleclick", handleClick);
    return () => map.un("singleclick", handleClick);
  }, [map, layers]);


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
        layers.districtHighlightLayer,
        layers.clickHighlightLayer,
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
  // ---------------- FIRE YEAR LAYERS ANIMATION ----------------
  // useEffect(() => {
  //   if (!map || !layers) return;

  //   let opacity = 0.4; // start opacity
  //   let increasing = true;
  //   let animationId;

  //   const animateFireYears = () => {
  //     // Control pulse range
  //     opacity = increasing ? opacity + 0.03 : opacity - 0.03;
  //     if (opacity >= 0.8) increasing = false;
  //     if (opacity <= 0.3) increasing = true;

  //     //  Animate ONLY year-based fire layers
  //     [2020, 2021, 2022].forEach((year) => {
  //       const layer = layers.fire[year];
  //       if (layer && layer.getVisible()) {
  //         layer.setOpacity(opacity);
  //       }
  //     });

  //     animationId = requestAnimationFrame(animateFireYears);
  //   };

  //   animateFireYears();

  //   // Cleanup on unmount
  //   return () => {
  //     if (animationId) cancelAnimationFrame(animationId);
  //   };
  // }, [map, layers]);

  // ---------------- Apply Layer Visibility ----------------
  useEffect(() => {
    if (!map || !layers) return;

    // ---------------- Layer Visibility  default for legend on map ----------------
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

    // Forest Cover
    if (selectedLayer === "forest-cover") {
      selectedYears.forEach((y) => {
        if (y !== "2000") layers.forest[y]?.setVisible(true);
      });
    }

    // Encroachment
    if (selectedLayer === "Encroachment") {
      selectedYears.forEach((y) => layers.encroachment[y]?.setVisible(true));
    }

    // Burned Forest
    if (selectedLayer === "Burned Forest") {
      selectedYears.forEach((y) => layers.fire[y]?.setVisible(true));
    }

    // ----------------Highlight + Zoom ----------------
  }, [selectedLayer, selectedYears, selectedDistrict, map, layers]);
  // District highlight + zoom (ONLY when district changes)
  useEffect(() => {
    if (!map || !layers || !selectedDistrict) return;
    
    const features = layers.boundary.getSource().getFeatures();
    const match = features.find((f) => f.get("district") === selectedDistrict);
    layers.districtHighlightLayer.getSource().clear();


    if (match) {
      const clone = match.clone();
      clone.setGeometry(match.getGeometry().clone());
      layers.districtHighlightLayer.getSource().addFeature(clone);
      layers.clickHighlightLayer.getSource().clear();
      
      //  ZOOM happens ONLY here
      map.getView().fit(match.getGeometry().getExtent(), {
        duration: 800,
      });
    }
  }, [selectedDistrict, map, layers]);
  // this for making legend on the map  based on the selected layer

  function LayerLegend({ selectedLayer, selectedYears }) {
    if (!selectedLayer || !selectedYears?.length) return null;

    let heading = "";
    if (selectedLayer === "forest-cover") heading = "Forest Cover";
    if (selectedLayer === "Encroachment") heading = "Encroachment";
    if (selectedLayer === "Burned Forest") heading = "Fire Forest";

    return (
      <div className="bg-white rounded shadow-md p-1 w-30">
        {/* Legend Heading */}
        <h3 className="text-sm font-semibold text-gray-800 mb-2">{heading}</h3>

        {/* Year-wise color legend */}
        {selectedYears.map((year) => (
          <div
            key={year}
            className="flex items-center gap-2 mb-1 text-sm text-gray-700"
          >
            <span
              className="w-4 h-4 rounded-sm border"
              style={{ backgroundColor: YEAR_COLORS[year] }}
            />
            <span>{year}</span>
          </div>
        ))}
      </div>
    );
  }

  // ---------------- Basemap Switcher ----------------
  function switchBasemap(name) {

    if (!map) return;
    const newBase = baseLayers[name]();
    map.removeLayer(currentBaseLayer);
    map.getLayers().insertAt(0, newBase);
    setCurrentBaseLayer(newBase);
  }

  return (
    //--------------------- this is map container -------------------------------------------/
    <div className="relative w-full h-[calc(100vh-159px)]">
      {/*  this is the basemap switcher code */}
      <div className="absolute right-6 top-40 z-10 text-sm bg-[#eff8f9] px-1 py-1 rounded shadow">
        <select
          onChange={(e) => switchBasemap(e.target.value)}
          className="bg-[#eff8f9] text-gray-900 px-3 py-1 rounded
           border border-[#eff8f9] outline-none cursor-pointer
           focus:ring-2 focus:ring-[#eff8f9]"
        >
          <option value="osm">OSM Standard</option>
          <option value="satellite">Satellite</option>
          <option value="terrain">Terrain</option>
          <option value="dark">Dark</option>
          <option value="white">white</option>
        </select>
      </div>
      {/* LAYER PANEL to show the layer mark on the map (Top-Right) */}
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
      {/* Dynamic Color Legend */}
      <div className="absolute left-4 bottom-20 z-30">
        <LayerLegend
          selectedLayer={selectedLayer}
          selectedYears={selectedYears}
        />
      </div>
      {/* Popup */}
      <div
        id="map-popup"
        className="absolute bg-white rounded shadow-md p-2 text-xs z-50 hidden"
      ></div>

      {/** this is map ref for shwoing the map  */}
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
}



/**https://github.com/sandiplakshminagar/forestsystem.git */

// ForestDashboard: ForestFire2020;
// ForestDashboard: ForestFire2021;
// ForestDashboard: ForestFire2022;

// new layers of forect cover to show attributes

/**New Vector layers for attribute and highlight the region
  * 
ForestDashboard:ForestCoverLost2020		
ForestDashboard:ForestCoverLost2021		
ForestDashboard:forestcoverlost2022
  * 
  */
