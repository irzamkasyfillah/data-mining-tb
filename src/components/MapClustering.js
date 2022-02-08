import {MapContainer, Marker, Polygon, Popup, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {statesData} from '../data_coordinate_mks'


const center = [-5.136143, 119.469370];

const MapClustering = () => {
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

            {
                statesData.features.map((state) => {
                    let coordinates = [];
                    if (state.geometry.type === 'MultiPolygon') {
                        const array_polygon = [];

                        for (const i in state.geometry.coordinates) {
                            const coord = state.geometry.coordinates[i][0].map((item) => [item[1], item[0]]);
                            array_polygon.push(coord);
                        }
                        coordinates = array_polygon;
                    } else {
                        coordinates = state.geometry.coordinates[0].map((item) => [item[1], item[0]]);
                    }

                    // eslint-disable-next-line react/jsx-key
                    return (<Polygon
                            pathOptions={{
                                fillColor: '#FD8D3C',
                                fillOpacity: 0.7,
                                weight: 2,
                                opacity: 1,
                                dashArray: 3,
                                color: 'white'
                            }}
                            positions={coordinates}
                            eventHandlers={{
                                mouseover: (e) => {
                                    const layer = e.target;
                                    layer.setStyle({
                                        dashArray: "",
                                        fillColor: "#BD0026",
                                        fillOpacity: 0.7,
                                        weight: 2,
                                        opacity: 1,
                                        color: "white",
                                    })
                                },
                                mouseout: (e) => {
                                    const layer = e.target;
                                    layer.setStyle({
                                        fillOpacity: 0.7,
                                        weight: 2,
                                        dashArray: "3",
                                        color: 'white',
                                        fillColor: '#FD8D3C'
                                    });
                                },
                                click: (e) => {

                                }
                            }}
                        />

                    )
                })
            }
        </MapContainer>
    )
}

export default MapClustering
