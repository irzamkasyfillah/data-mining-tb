import L from "leaflet";
import {useEffect} from "react";

function Legend({map}) {
    console.log(map);
    useEffect(() => {
        if (map) {
            let content = (`
                    <div className="col-span-1" style={{
                            color: '#ff0074',
                            backgroundColor: '#ff0074',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>
                    </div>
                    Ini map legend
            `)

            const legend = L.control({position: "bottomright"});

            legend.onAdd = () => {
                const div = L.DomUtil.create("div", "info2 legend");
                div.innerHTML = content;
                return div;
            };

            legend.addTo(map);
        }
    }, [map]);
    return null;
}

export default Legend;