import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {MapContainer, Marker, Polygon, Popup, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Legend from "./Legend"
import Legend2 from "./Legend2"

let DefaultIcon = L.icon({
    iconUrl: 'icons/marker-icon.png',
    shadowUrl: 'icons/marker-shadow.png'
});

L.Marker.prototype.options.icon = DefaultIcon;

function PointsLayer(props) {
    const { data, selectedIndex } = props;
    const result = data?.dict_kec_rules_location
    const highest_kec_json = data?.highest_kec
    const highest_kec = JSON.parse(highest_kec_json)
    const opacities = [0.9, 0.75, 0.6, 0.45, 0.3, 0.15]
    let current_opacities_index = 0

    return Object.keys(result)?.map((kec) => {
        const resultKec = result[kec]
        const index = resultKec?.index
        let polygon = resultKec?.polygons?.coordinates
        if (resultKec?.polygons?.type === "Polygon" && polygon?.length === 1) {
            polygon = polygon[0]
        } else if (resultKec?.polygons?.type === "MultiPolygon") {
            let polygon2 = []
            polygon.forEach(value => polygon2 = [...polygon2, ...value[0]])
            polygon = polygon2
        } else if (resultKec?.polygons?.type === "Point") {
            polygon = [polygon]
        }
        polygon = polygon.map(value => [value[1], value[0]])
        const position = [resultKec?.lat, resultKec?.long]

        const antecedent = resultKec?.antecedents?.join(', ')
        const consequent = resultKec?.consequents?.join(', ')

        
        const fillOpacities = { 
            Rappocini: 0.8, 
            Tamalate: 0.6, 
            Panakkukang: 0.6, 
            Manggala: 0.4, 
            Tamalanrea: 0.2 
        }

        let fillOpacity = 0.1
        if (Object.keys(fillOpacities).includes(kec)) {
            fillOpacity = fillOpacities[kec]
        }   
        const pathOptions = { fillColor: 'red', fillOpacity: fillOpacity }

        return (
            <PolygonMarker className={`polygon-marker ${index} hidden`} pathOptions={pathOptions} positions={polygon} 
                content={(
                    <>
                        <p style={{fontWeight: "bold", fontSize: "16px"}}>{kec}</p>
                        <div>
                            <p style={{margin: "0px 0", fontSize: "16px"}}>Variabel yang berkaitan terhadapat Tuberkulosis anak:</p>
                            <p style={{margin: "0px 0", fontSize: "16px"}}>{antecedent}, berhubungan dengan {consequent}</p>
                        </div>
                    </>
                )}
                openPopup={selectedIndex === index}
                selectedItem={selectedIndex}
            />
        )
    });
}


function PolygonMarker(props) {
    const markerRef = useRef(null);
    const { pathOptions, positions, content, openPopup, className } = props;
  
    useEffect(() => {
        if (openPopup) markerRef.current.openPopup();
    }, [openPopup]);
  
    return (
        <Polygon ref={markerRef} pathOptions={pathOptions} positions={positions} className={className}>
            <Popup>{content}</Popup>
        </Polygon>
    );
}

function PointMarker(props) {
    const markerRef = useRef(null);
    const { position, content, openPopup } = props;
  
    useEffect(() => {
        if (openPopup) markerRef.current.openPopup();
    }, [openPopup]);
  
    return (
      <Marker ref={markerRef} position={position}>
        <Popup>{content}</Popup>
      </Marker>
    );
}

const Map = (props) => {
    const {data, selectedData, center} = props;
    const [map, setMap] = useState(null);

    const onClickItem = (query) => {
        let elements = document.querySelectorAll('.polygon-marker')
        for (let i = 0; i < elements.length; i++) {
            if (query !== '' && !elements[i].classList.contains(query)) {
                elements[i].classList.remove('visible')
                elements[i].classList.add('hidden')
            } else if (query === '' && elements[i].classList.contains('hidden')) {
                elements[i].classList.remove('hidden')
                elements[i].classList.add('visible')
            } else {
                elements[i].classList.remove('hidden')
                elements[i].classList.add('visible')
            }
        }
    }

    return (
        <MapContainer center={center || [-5.136143, 119.469370]} zoom={14} scrollWheelZoom={true} className={'mapid'} whenCreated={setMap}>
            <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {
                data && <PointsLayer selectedIndex={selectedData?.index} data={data} />
            }
            {
                data && onClickItem(selectedData?.index) 
            }
            {
                data && <Legend map={map} data={data} />
            }
            {
                data && <Legend2 map={map} data={data} />
            }
             
        </MapContainer>
    )
}

export default Map
