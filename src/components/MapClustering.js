// import {MapContainer, Marker, Polygon, Popup, TileLayer, useMapEvents} from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
// import L from 'leaflet';
// import {useState, useEffect} from "react";
// // import Legend from "./Legend";
//
// let DefaultIcon = L.icon({
//     iconUrl: 'icons/marker-icon.png',
//     shadowUrl: 'icons/marker-shadow.png'
// });
//
// L.Marker.prototype.options.icon = DefaultIcon;
//
//
// const center = [-5.136143, 119.469370];
//
// function getColor(d) {
//     // return d > 1000 ? '#800026' :
//     //        d > 500  ? '#BD0026' :
//     //        d > 200  ? '#E31A1C' :
//     //        d > 100  ? '#FC4E2A' :
//     //        d > 50   ? '#FD8D3C' :
//     //        d > 20   ? '#FEB24C' :
//     //        d > 10   ? '#FED976' :
//     //                   '#FFEDA0';
//     return d > 100 ? '#800026' :
//         d > 50 ? '#BD0026' :
//             d > 20 ? '#E31A1C' :
//                 d > 10 ? '#FC4E2A' :
//                     d > 5 ? '#FD8D3C' :
//                         d > 2 ? '#FEB24C' :
//                             d > 1 ? '#FED976' :
//                                 '#FFEDA0';
// }
//
// function CreateInfo() {
//     return (
//         <div className={'info'}>
//             <h4>US Population Density</h4>
//         </div>
//     )
// }
//
// const MapClustering = () => {
//
//     function GetLatLong(props) {
//         const {data} = props;
//         const result = data?.data_coordinate
//     }
//
//     return (
//         <MapContainer center={center} zoom={12} scrollWheelZoom={true} className={'mapid'}>
//             <TileLayer
//                 attribution='&copy; <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             {/*<Marker position={[51.505, -0.09]}>*/}
//             {/*    <Popup>*/}
//             {/*        A pretty CSS3 popup. <br/> Easily customizable.*/}
//             {/*    </Popup>*/}
//             {/*</Marker>*/}
//             {/*<Legend />*/}
//
//
//             {
//                 statesData.features.map((state) => {
//                     let coordinates = [];
//                     if (state.geometry.type === 'MultiPolygon') {
//                         const array_polygon = [];
//
//                         for (const i in state.geometry.coordinates) {
//                             const coord = state.geometry.coordinates[i][0].map((item) => [item[1], item[0]]);
//                             array_polygon.push(coord);
//                         }
//                         coordinates = array_polygon;
//                     } else {
//                         coordinates = state.geometry.coordinates[0].map((item) => [item[1], item[0]]);
//                     }
//
//                     // eslint-disable-next-line react/jsx-key
//                     return (<Polygon
//                             pathOptions={{
//                                 fillColor: getColor(state.properties.Luas_KM2),
//                                 fillOpacity: 0.7,
//                                 weight: 2,
//                                 opacity: 1,
//                                 dashArray: 3,
//                                 color: 'white'
//                             }}
//                             positions={coordinates}
//                             eventHandlers={{
//                                 mouseover: (e) => {
//                                     const layer = e.target;
//                                     layer.setStyle({
//                                         dashArray: "",
//                                         fillColor: "#BD0026",
//                                         fillOpacity: 0.7,
//                                         weight: 2,
//                                         opacity: 1,
//                                         color: "white",
//                                     })
//                                 },
//                                 mouseout: (e) => {
//                                     const layer = e.target;
//                                     layer.setStyle({
//                                         fillOpacity: 0.7,
//                                         weight: 2,
//                                         dashArray: "3",
//                                         color: 'white',
//                                         fillColor: getColor(state.properties.Luas_KM2)
//                                     });
//                                 },
//                                 click: (e) => {
//
//                                 }
//                             }}
//                         />
//
//                     )
//                 })
//             }
//         </MapContainer>
//     )
// }
//
// export default MapClustering
import React from 'react';
import L from 'leaflet';
import {CircleMarker, MapContainer, Popup, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {Button} from 'react-bootstrap'
import LoadingOverlay from 'react-loading-overlay';
import Router from "next/router";

let DefaultIcon = L.icon({
    iconUrl: 'icons/marker-icon.png',
    shadowUrl: 'icons/marker-shadow.png'
});

L.Marker.prototype.options.icon = DefaultIcon;

function getRadius(d) {
    return (
        d > 25 ? 20 :
            d > 20 ? 15 :
                d > 15 ? 11 :
                    d > 9 ? 8 :
                        6
    );
}

function PointMarker(props) {
    const {data, selectedData, center} = props
    const coord = data?.data_kecamatan

    console.log(data)

    return Object.keys(coord)?.map((kec) => {
        const resultKec = coord[kec]
        // const index = resultKec?.index
        const position = [resultKec?.latitude, resultKec?.longitude]
        const kasus = resultKec?.Total
        const cluster = resultKec?.Segment
        const umur = Math.round(resultKec?.['Tahun (mean)'])
        const jenis_kelamin = resultKec?.['Jenis Kelamin']
        const pekerjaan = resultKec?.['Pekerjaan Ayah'] + ' & ' + resultKec?.['Pekerjaan Ibu']
        const pendapatan = resultKec?.['Pendapatan Orang Tua']
        const status_gizi = resultKec?.['Status Gizi']
        const luas_rumah = resultKec?.['luas rumah']
        const jumlah_kamar = Math.round(resultKec?.['jumlah kamar tidur (mean)'])
        const jumlah_orang = Math.round(resultKec?.['jumlah orang dalam rumah (mean)'])
        const sistem_ventilasi = resultKec?.['sistem ventilasi']
        const bcg = resultKec?.['riwayat vaksin BCG']

        // console.log(position)
        const redOptions = {color: 'red'}

        return (
            <CircleMarker
                center={position}
                pathOptions={redOptions}
                radius={getRadius(kasus)}
            >
                <Popup>
                    <h3 style={{textAlign: 'center'}}>
                        <b style={{color: 'darkslategray'}}>Kecamatan {kec}</b>
                    </h3>
                    <br/>
                    Cluster <pre style={{display: 'inline', marginLeft: '30%'}}> : </pre> {cluster} <br/>
                    Jumlah Kasus <pre style={{display: 'inline', marginLeft: '17.5%'}}> : </pre> {kasus} <br/>
                    Umur <pre style={{display: 'inline', marginLeft: '33%'}}> : </pre> {umur} <br/>
                    Jenis Kelamin <pre style={{display: 'inline', marginLeft: '18%'}}> : </pre> {jenis_kelamin}<br/>
                    Pekerjaan Orang Tua <pre style={{display: 'inline', marginLeft: '5%'}}> : </pre> {pekerjaan} <br/>
                    Pendapatan Orang Tua <pre style={{display: 'inline', marginLeft: '1.5%'}}> : </pre> {pendapatan}
                    <br/>
                    Status Gizi <pre style={{display: 'inline', marginLeft: '23.8%'}}> : </pre> {status_gizi} <br/>
                    Luas Rumah <pre style={{display: 'inline', marginLeft: '20.5%'}}> : </pre> {luas_rumah} <br/>
                    Jumlah Kamar <pre style={{display: 'inline', marginLeft: '17.5%'}}> : </pre> {jumlah_kamar} <br/>
                    Jumlah Orang <pre style={{display: 'inline', marginLeft: '18%'}}> : </pre> {jumlah_orang} <br/>
                    Sistem Ventilasi <pre style={{display: 'inline', marginLeft: '15%'}}> : </pre> {sistem_ventilasi}
                    <br/>
                    Vaksin BCG <pre style={{display: 'inline', marginLeft: '21.8%'}}> : </pre> {bcg} <br/>
                </Popup>
            </CircleMarker>
        )
    });
}

function ClusterModal() {

}

function Example(props) {
    const {data, selectedData, center, loading} = props
    const coord = data?.data_cluster
    let i = 0;

    return Object.keys(coord)?.map((clust) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [showModal, setShowModal] = React.useState(false);

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        const months = ["#800026", "#0C7C59", "#FC4E2A", "#28536B", "#C2948A", "#F6F0ED", "#D36135"];
        // let random = Math.floor(Math.random() * months.length);
        // console.log(random, months[random]);

        const resultClust = coord[clust]
        const kasus = resultClust?.Total
        const cluster = resultClust?.Segment
        const umur = Math.round(resultClust?.['Tahun (mean)'])
        const jenis_kelamin = resultClust?.['Jenis Kelamin']
        const pekerjaan = resultClust?.['Pekerjaan Ayah'] + ' & ' + resultClust?.['Pekerjaan Ibu']
        const pendapatan = resultClust?.['Pendapatan Orang Tua']
        const status_gizi = resultClust?.['Status Gizi']
        const luas_rumah = resultClust?.['luas rumah']
        const jumlah_kamar = Math.round(resultClust?.['jumlah kamar tidur (mean)'])
        const jumlah_orang = Math.round(resultClust?.['jumlah orang dalam rumah (mean)'])
        const sistem_ventilasi = resultClust?.['sistem ventilasi']
        const bcg = resultClust?.['riwayat vaksin BCG']
        return (
            <>
                <div className="inline">
                    <Button style={{backgroundColor:months[i]}} className="text-white font-bold py-2 px-4 rounded mx-3 d-inline-block"
                            variant="primary" onClick={() => setShowModal(true)}>
                        Cluster {resultClust?.Segment}
                    </Button>
                </div>
                <script>
                    {i++}
                </script>
                {showModal ? (
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] outline-none focus:outline-none"
                        >
                            <div className="relative w-auto my-6 mx-auto max-w-6xl">
                                {/*content*/}
                                <div
                                    className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div
                                        className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-3xl font-semibold">
                                            CLUSTER {resultClust?.Segment}
                                        </h3>
                                        <button
                                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <span
                                                className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                              ×
                                            </span>
                                        </button>
                                    </div>
                                    {/*body*/}
                                    <div className="relative p-6 flex-auto m-2">
                                        <table className="table-auto ">
                                            <thead>
                                            <tr>
                                                <th className="w-1/2 px-4 py-2">Total</th>
                                                <th className="w-1/4 px-4 py-2">Umur</th>
                                                <th className="w-1/4 px-4 py-2">JK</th>
                                                <th className="w-1/4 px-4 py-2">Pekerjaan</th>
                                                <th className="w-1/4 px-4 py-2">Pendapatan</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="border px-4 py-2">Total</td>
                                                <td className="border px-4 py-2">{kasus}</td>
                                                <td className="border px-4 py-2">{kasus}</td>
                                            </tr>
                                            <tr>
                                                <td className="border px-4 py-2">Umur</td>
                                                <td className="border px-4 py-2">{umur}</td>
                                                <td className="border px-4 py-2">{kasus}</td>
                                            </tr>
                                            <tr>
                                                <td className="border px-4 py-2">Jenis Kelamin</td>
                                                <td className="border px-4 py-2">{jenis_kelamin}</td>
                                            </tr>
                                            <tr>
                                                <td className="border px-4 py-2">Pekerjaan Orang Tua</td>
                                                <td className="border px-4 py-2">{pekerjaan}</td>
                                            </tr>
                                            <tr>
                                                <td className="border px-4 py-2">Pendapatan Orang Tua</td>
                                                <td className="border px-4 py-2">{pendapatan}</td>
                                            </tr>
                                            <tr>
                                                <td className="border px-4 py-2">Umur</td>
                                                <td className="border px-4 py-2">{umur}</td>
                                            </tr>
                                            </tbody>
                                        </table>


                                    </div>
                                    {/*footer*/}
                                    <div
                                        className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
            </>
        )
    });
}

const Map = (props) => {
    const {data, selectedData, center, loading, setReg} = props

    const kec = data?.data_kecamatan
    function reloadData() {
        setReg(true);
        Router.push({
          pathname: "/cluster",
          query: {generate: 1}
        })
        // Router.reload()
    }

    return (
        <>
            <div className="bg-[#343A40] h-screen">
                <LoadingOverlay
                    active={loading}
                    spinner
                    text='Building cluster, please wait...'>
                    <MapContainer center={center || [-5.136143, 119.469370]} zoom={12} scrollWheelZoom={true}
                                  className={'cluster-mapid'}>
                        <TileLayer
                            attribution='&copy; <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {
                            data && <PointMarker data={data}/>
                        }
                    </MapContainer>
                </LoadingOverlay>

                <br/>


                {
                    data &&
                    <div className="text-center">
                        <Example data={data} loading={loading}/>
                    </div>
                }
                <br/><br/>
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        variant="primary" onClick={() => reloadData()}>
                        REGENERATE DATA
                </Button>
            </div>
        </>
    )
}

export default Map


