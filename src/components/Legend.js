import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

function Legend({ map, data}) {
  console.log(map);
  useEffect(() => {
    if (map) {
      const highest_kec_json = data?.highest_kec
      const highest_kec = JSON.parse(highest_kec_json)
      const list_aturan = data?.list_aturan
      let content = ""
      content += "<p>" + "Kecamatan dengan kasus terbanyak" + "</p>"
      Object.keys(highest_kec).map(kec => {
        content += "<p>" + kec + ": " + highest_kec[kec] + "</p>"
      })

      const str_list_aturan = list_aturan.join(", ")
      content += "</br>" 
      content += "Variabel yang berkaitan terhadapat Tuberkulosis anak:" + "</br>"
      content += "<p>" + str_list_aturan + "</p>"

      const legend = L.control({ position: "bottomright" });

      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        div.innerHTML = content;
        return div;
      };
      legend.addTo(map);
    }
  }, [map]);
  return null;
}

export default Legend;