import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

let DefaultIcon = L.icon({
    iconUrl: 'icons/marker-icon.png',
    shadowUrl: 'icons/marker-shadow.png'
});

L.Marker.prototype.options.icon = DefaultIcon;

// function GenerateMarkers(data) {
//     const result = data?.dict_kec_rules_location

//     return Object.keys(result)?.map(kec => {
//         const resultKec = result[kec]
//         const index = resultKec?.index
//         const marker = [resultKec?.lat, resultKec?.long]
//         const antecedent = resultKec?.antecedents?.join(', ')
//         const consequent = resultKec?.consequents?.join(', ')
        
//         return (
//             <Marker key={index} ref={el => markerRef.current[index] = el} position={marker}>
//                 <Popup>
//                     <p style={{fontWeight: "bold"}}>{kec}</p>
//                     <div>
//                         <p style={{margin: "10px 0"}}>{antecedent}</p>
//                         <p style={{margin: "10px 0"}}>{consequent}</p>
//                     </div>
//                 </Popup>
//             </Marker>
//         )
//     })
// }

// function Map(props) {
//     const {data, selectedData} = props
//     const [center, setCenter] = useState(null)
//     const markerRefs = []
//     const markerRef = useRef([])

//     useEffect(() => {
//         const center = [selectedData?.lat, selectedData?.long]
//         markerRef.current = markerRef.current.slice(0, data?.length);
//         setCenter(center)
//     }, [data])

//     const bindMarker = (ref, id) => {
//         markerRefs[id] = ref
//     }

//     return (
//         <MapContainer center={center || [-5.136143, 119.469370]} zoom={12} scrollWheelZoom={true} className={'mapid'}>
//             <TileLayer
//                 attribution='&copy; <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
            
//             <GenerateMarkers />
            
//         </MapContainer>
//     )
// }

function PointsList(props) {
    const { data, onItemClick } = props;
    const result = data?.dict_kec_rules_location

    return(
    <>
    {
      result && Object.keys(result)?.map((kec, index) => {
        const resultKec = result[kec]
        return (
          <div key={kec.index}>
            <ul>
                <li
                  onClick={e => {
                    onItemClick(kec);
                  }}
                >
                {kec}
                </li>
            </ul>
          </div>
        )    
        
      })
    
    }
    </>
    )
  }
  
  function PointsLayer(props) {
    const { data,selectedIndex } = props;
    const result = data?.dict_kec_rules_location
    return Object.keys(result)?.map((kec, index) => (
      <PointMarker
        key={kec.index}
        content={kec}
        center={{ lat: kec.lat, lng: kec.long }}
        openPopup={selectedIndex === index}
      />
    ));
  }
  
  function PointMarker(props) {
    const markerRef = useRef(null);
    const { center, content, openPopup } = props;
  
    useEffect(() => {
      if (openPopup) markerRef.current.leafletElement.openPopup();
    }, [openPopup]);
  
    return (
      <Marker ref={markerRef} center={center}>
        <Popup>{content}</Popup>
      </Marker>
    );
  }
  
  function Map(props) {
    const [selected, setSelected] = useState();
    const { zoom, center, data} = props;
  
    function handleItemClick(index) {
      setSelected(index);
    }
  
    return (
      <div>
        <PointsList data={data} onItemClick={handleItemClick} />
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className={'mapid'}>
        <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          <PointsLayer selectedIndex={selected} data={data}  />
        </MapContainer>
      </div>
    );
  }

export default Map
