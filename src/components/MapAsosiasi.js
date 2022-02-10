import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {MapContainer, Marker, Polygon, Popup, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

let DefaultIcon = L.icon({
    iconUrl: 'icons/marker-icon.png',
    shadowUrl: 'icons/marker-shadow.png'
});

L.Marker.prototype.options.icon = DefaultIcon;


const Map = (props) => {
    const {data, selectedData} = props
    const [center, setCenter] = useState(null)
    const markerRefs = []
    const markerRef = useRef([])

    useEffect(() => {
        const center = [selectedData?.lat, selectedData?.long]
        markerRef.current = markerRef.current.slice(0, data?.length);
        console.log("center", center, markerRef.current)
        setCenter(center)
    }, [data])

    const bindMarker = (ref, id) => {
        console.log("ref", markerRef, id)
        markerRefs[id] = ref
    }

    const generateMarkers = (data) => {
        const result = data?.dict_kec_rules_location

        console.log("data", data)
        return Object.keys(result)?.map(kec => {
            const resultKec = result[kec]
            const index = resultKec?.index
            const marker = [resultKec?.lat, resultKec?.long]
            const antecedent = resultKec?.antecedents?.join(', ')
            const consequent = resultKec?.consequents?.join(', ')
            
            return (
                <Marker key={index} ref={el => markerRef.current[index] = el} position={marker}>
                    <Popup>
                        <p style={{fontWeight: "bold"}}>{kec}</p>
                        <div>
                            <p style={{margin: "10px 0"}}>{antecedent}</p>
                            <p style={{margin: "10px 0"}}>{consequent}</p>
                        </div>
                    </Popup>
                </Marker>
            )
        })
    }

    return (
        <MapContainer center={center || [-5.136143, 119.469370]} zoom={12} scrollWheelZoom={true} className={'mapid'}>
            <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                generateMarkers(data)
            }
            
        </MapContainer>
    )
}

export default Map
