import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

function LegendClusterTop({ map, selectedKec}) {
  console.log(map);
  useEffect(() => {
    if (map) {
      // const highest_kec_json = data?.highest_kec
      // const highest_kec = JSON.parse(highest_kec_json)
      // const list_aturan = data?.list_aturan
      // console.log("highest_kec",data);
      // console.log("highest_kec",highest_kec);
      // console.log("list_aturan", list_aturan);
      let content = (`
                   <div>
                        Kecamatan ${selectedKec}                   
                   </div>
      `
      )
      // content += "<p>" + "Kecamatan dengan kasus terbanyak" + "</p>"
      // Object.keys(highest_kec).map(kec => {
      //   content += "<p>" + kec + ": " + highest_kec[kec] + "</p>"
      // })
      //
      // const str_list_aturan = list_aturan.join(", ")
      // content += "</br>"
      // content += "Penyebab Tuberkulosis pada anak:" + "</br>"
      // content += "<p>" + str_list_aturan + "</p>"

      const legend = L.control({ position: "topright" });

      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info2 legend");
        div.innerHTML = content;
        return div;
        // return (
        //     <>
        //         <div>
        //             halo
        //         </div>
        //     </>
        // );
      };

      legend.addTo(map);
    }
  }, [map]);
  return null;
}

export default LegendClusterTop;