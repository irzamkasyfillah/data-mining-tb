import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// class Legend extends MapControl {
//   createLeafletElement(props) {}

//   componentDidMount() {
//     // get color depending on population density value
//     const getColor = d => {
//       return d > 1000
//         ? "#800026"
//         : d > 500
//         ? "#BD0026"
//         : d > 200
//         ? "#E31A1C"
//         : d > 100
//         ? "#FC4E2A"
//         : d > 50
//         ? "#FD8D3C"
//         : d > 20
//         ? "#FEB24C"
//         : d > 10
//         ? "#FED976"
//         : "#FFEDA0";
//     };

//     const legend = L.control({ position: "bottomright" });

//     legend.onAdd = () => {
//       const div = L.DomUtil.create("div", "info legend");
//       const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
//       let labels = [];
//       let from;
//       let to;

//       for (let i = 0; i < grades.length; i++) {
//         from = grades[i];
//         to = grades[i + 1];

//         labels.push(
//           '<i style="background:' +
//             getColor(from + 1) +
//             '"></i> ' +
//             from +
//             (to ? "&ndash;" + to : "+")
//         );
//       }

//       div.innerHTML = labels.join("<br>");
//       return div;
//     };

//     const { map } = this.props.leaflet;
//     legend.addTo(map);
//   }
// }

// export default withLeaflet(Legend);

function Legend({ map, data}) {
  console.log(map);
  useEffect(() => {
    if (map) {
      const highest_kec_json = data?.highest_kec
      const highest_kec = JSON.parse(highest_kec_json)
      const list_antecedents = data?.list_antecedents_unique
      const list_consequents = data?.list_consequents_unique
      console.log("highest_kec",data);
      console.log("highest_kec",highest_kec);
      console.log("highest_kec",list_antecedents);
      console.log("highest_kec",list_consequents);

      let content = ""
      content += "<p>" + "Data tertinggi" + "</p>"
      Object.keys(highest_kec).map(kec => {
        content += "<p>" + kec + ": " + highest_kec[kec] + "</p>"
      })

      const str_list_antecedents = list_antecedents.join(", ")
      const str_list_consequents = list_consequents.join(", ")
      content += "</br>" 
      content += "Penyebab Tuberkulosis pada anak:" + "</br>"
      content += "<p>" + str_list_antecedents + "</p>"
      content += "<p>" + str_list_consequents + "</p>"

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