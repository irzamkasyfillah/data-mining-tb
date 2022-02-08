import {MapContainer, Marker, Polygon, Popup, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'


const center = [-5.136143, 119.469370];

const Map = () => {
    return (
        <MapContainer center={center} zoom={12} scrollWheelZoom={true} className={'mapid'}>
            <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                    A pretty CSS3 popup. <br/> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map
