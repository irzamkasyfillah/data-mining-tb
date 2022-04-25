import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

let DefaultIcon = L.icon({
    iconUrl: 'icons/marker-icon.png',
    shadowUrl: 'icons/marker-shadow.png'
});

L.Marker.prototype.options.icon = DefaultIcon;

function PointsLayer(props) {
    const { data, selectedIndex } = props;

    const result = data?.dict_kec_rules_location
    return Object.keys(result)?.map((kec) => {
        const resultKec = result[kec]
        const index = resultKec?.index
        const position = [resultKec?.lat, resultKec?.long]
        const antecedent = resultKec?.antecedents?.join(', ')
        const consequent = resultKec?.consequents?.join(', ')
        return (
            <PointMarker
                key={index}
                content={(
                    <>
                        <p style={{fontWeight: "bold", fontSize: "16px"}}>{kec}</p>
                        <div>
                            <p style={{margin: "0px 0", fontSize: "13px"}}>Penyebab Tuberkulosis pada Anak adalah</p>
                            <p style={{margin: "0px 0", fontSize: "13px"}}>{antecedent}, {consequent}</p>
                            {/* <p style={{margin: "10px 0"}}>{consequent}</p> */}
                        </div>
                    </>
                )}
                position={position}
                openPopup={selectedIndex === index}
            />
        )
    });
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
    const {data, selectedData, center} = props

    return (
        <MapContainer center={center || [-5.136143, 119.469370]} zoom={12} scrollWheelZoom={true} className={'mapid'}>
            <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                data && <PointsLayer selectedIndex={selectedData?.index} data={data}  />
            }
        </MapContainer>
    )
}

export default Map
