import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

function Legend({ map, data}) {
  useEffect(() => {
    if (map) {
      const getColor = d => {
        return d > 25
          ? "#e50000"
          : d > 20
          ? "#ff0000"
          : d > 15
          ? "#ff3232"
          : d > 10
          ? "#ff4c4c"
          : d > 5
          ? "#ff6666"
          : "#ffb2b2";
      };

      const legend = L.control({ position: "bottomleft" });

      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend color");

        const grades = [1, 5, 10, 15, 20, 25];
        let labels = [];
        let from;
        let to;
        for (let i = 0; i < grades.length; i++) {
          from = grades[i];
          to = grades[i + 1];

          labels.push(
            '<i style="background:' +
              getColor(from + 1) +
              '"></i> ' +
              from +
              (to ? "&ndash;" + to : "+")
          );
        }

        div.innerHTML = labels.join("<br>");
        return div;
      };

      legend.addTo(map);
    }
  }, [map]);
  return null;
}

export default Legend;