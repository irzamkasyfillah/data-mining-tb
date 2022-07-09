import L from "leaflet";
import {useEffect} from "react";

function Legend({map}) {
    console.log(map);
    useEffect(() => {
        if (map) {
            const getColor = d => {
                return  d > 25 ? '#800026' :
                        d > 20 ? '#BD0026' :
                        d > 15 ? '#E31A1C' :
                        d > 10 ? '#FC4E2A' :
                        d > 5 ? '#FD8D3C' :
                        '#FED976';
            };
            const legend = L.control({position: "bottomright"});

            legend.onAdd = () => {
                const div = L.DomUtil.create("div", "info2 legend color");

                const grades = [1, 5, 10, 15, 20, 25];
                let labels = [];
                let from;
                let to;
                labels.push('<span>Jumlah TB</span><br>')
                for (let i = 0; i < grades.length; i++) {
                    // from = i == 0 ? grades[i] : grades[i]+1;
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