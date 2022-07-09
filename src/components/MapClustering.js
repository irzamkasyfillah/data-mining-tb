import React, {useState} from 'react';
import L from 'leaflet';
import {CircleMarker, MapContainer, Polygon, Popup, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {Button} from 'react-bootstrap'
import LoadingOverlay from 'react-loading-overlay';
import Router from "next/router";
import {statesData} from './data_kecamatan'
import Legend from "./LegendCluster"
import {inter} from './data_interpretasi'
import {InterpretasiCluster} from './InterpretasiCluster'


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
    const {data, selectedData, selectedColor, center} = props

    const coord1 = data?.cluster1_df
    const coord2 = data?.cluster2_df
    const coord3 = data?.cluster3_df
    const coord4 = data?.cluster4_df
    const coord5 = data?.cluster5_df

    const res1 = data?.cluster1_result
    const res2 = data?.cluster2_result
    const res3 = data?.cluster3_result
    const res4 = data?.cluster4_result
    const res5 = data?.cluster5_result

    console.log(inter, 'ini interpretasi')
    // console.log(data)
    return Object.keys(coord1)?.map((kec) => {
        console.log("selectedData", selectedData, selectedData == kec.split(' (')[0])
        if (!selectedData || (selectedData && selectedData == kec.split(' (')[0])) {
            const [showModal, setShowModal] = React.useState(false);
            const handleClose = () => setShow(false);
            const handleShow = () => setShow(true);

            const resultKec1 = coord1[kec]
            const resultKec2 = coord2[kec]
            const resultKec3 = coord3[kec]
            const resultKec4 = coord4[kec]
            const resultKec5 = coord5[kec]

            let color_cluster1 = ''
            const all_color_cluster1 = ['#E31A1C', '#ff7400', '#ff7b7b']
            switch (resultKec1['Total']) {
                case 0:
                    color_cluster1 = all_color_cluster1[0];
                    break
                case 1:
                    color_cluster1 = all_color_cluster1[1];
                    break
                case 2:
                    color_cluster1 = all_color_cluster1[2];
                    break
                default :
                    color_cluster1 = all_color_cluster1[0];
                    break
            }

            let color_cluster2 = ''
            const all_color_cluster2 = ['#0f5e9c', '#9D5C0D', '#800026']
            switch (resultKec2['Total']) {
                case 0:
                    color_cluster2 = all_color_cluster2[0];
                    break
                case 1:
                    color_cluster2 = all_color_cluster2[1];
                    break
                case 2:
                    color_cluster2 = all_color_cluster2[2];
                    break
                default :
                    color_cluster2 = all_color_cluster2[0];
                    break
            }

            let color_cluster3 = ''
            const all_color_cluster3 = ['#063b00', '#854442', '#089000', '#be9b7b', '#0eff00']
            switch (resultKec3['Total']) {
                case 0:
                    color_cluster3 = all_color_cluster3[0];
                    break
                case 1:
                    color_cluster3 = all_color_cluster3[1];
                    break
                case 2:
                    color_cluster3 = all_color_cluster3[2];
                    break
                case 3:
                    color_cluster3 = all_color_cluster3[3];
                    break
                case 4:
                    color_cluster3 = all_color_cluster3[4];
                    break
                default :
                    color_cluster3 = all_color_cluster3[0];
                    break
            }

            let color_cluster4 = ''
            const all_color_cluster4 = ['#a98600', '#535353', '#e9d700', '#f8ed62', '#fff9ae']
            switch (resultKec4['Total']) {
                case 0:
                    color_cluster4 = all_color_cluster4[0];
                    break
                case 1:
                    color_cluster4 = all_color_cluster4[1];
                    break
                case 2:
                    color_cluster4 = all_color_cluster4[2];
                    break
                case 3:
                    color_cluster4 = all_color_cluster4[3];
                    break
                case 4:
                    color_cluster4 = all_color_cluster4[4];
                    break
                default :
                    color_cluster4 = all_color_cluster4[0];
                    break
            }

            let color_cluster5 = ''
            const all_color_cluster5 = ['#660066', '#00ffff', '#8E3200', '#ff0074']
            switch (resultKec5['Total']) {
                case 0:
                    color_cluster5 = all_color_cluster5[0];
                    break
                case 1:
                    color_cluster5 = all_color_cluster5[1];
                    break
                case 2:
                    color_cluster5 = all_color_cluster5[2];
                    break
                case 3:
                    color_cluster5 = all_color_cluster5[3];
                    break
                default :
                    color_cluster5 = all_color_cluster5[0];
                    break
            }

            const position1 = resultKec1?.coord
            const position2 = resultKec2?.coord
            const position3 = resultKec3?.coord
            const position4 = resultKec4?.coord
            const position5 = resultKec5?.coord

            const ket_cluster1 = {
                0: 'Rata-rata jumlah TB = ' + Math.round(res1['First']['(\'Jumlah TB\', \'mean\')']) + '\nUsia = ' + Math.round(res1['First']['(\'Usia (mean)\', \'mean\')']) + ' tahun',
                1: 'Rata-rata jumlah TB = ' + Math.round(res1['Second']['(\'Jumlah TB\', \'mean\')']) + '\nUsia = ' + Math.round(res1['Second']['(\'Usia (mean)\', \'mean\')']) + ' tahun',
                2: 'Rata-rata jumlah TB = ' + Math.round(res1['Third']['(\'Jumlah TB\', \'mean\')']) + '\nUsia = ' + Math.round(res1['Third']['(\'Usia (mean)\', \'mean\')']) + ' tahun'
            }

            const ket_cluster2 = {
                0: 'Rata-rata gizi baik = ' + Math.round(res2['First']['(\'Persentase anak gizi baik\', \'mean\')']) + '%\ngizi lebih = ' + Math.round(res2['First']['(\'Persentase anak gizi lebih\', \'mean\')']) + '%',
                1: 'Rata-rata gizi kurang = ' + Math.round(res2['Second']['(\'Persentase anak gizi kurang\', \'mean\')']) + '%\ngizi baik = ' + Math.round(res2['Second']['(\'Persentase anak gizi baik\', \'mean\')']) + '%',
                2: 'Rata-rata gizi lebih = ' + Math.round(res2['Third']['(\'Persentase anak gizi lebih\', \'mean\')']) + '%'
            }

            const ket_cluster3 = {
                0: 'Rata-rata pendapatan 5 - 10 juta = ' + Math.round(res3['First']['(\'Pendapatan ( 5.000.001 - 10.000.000 )\', \'mean\')']) + '%',
                1: 'Rata-rata pendapatan 2.5 - 5 juta = ' + Math.round(res3['Second']['(\'Pendapatan ( 2.500.000 - 5.000.000 )\', \'mean\')']) + '%',
                2: 'Rata-rata pendapatan > 10 juta = ' + Math.round(res3['Third']['(\'Pendapatan ( > 10.000.000 )\', \'mean\')']) + '%\n5 - 10 juta = ' + Math.round(res3['Third']['(\'Pendapatan ( 5.000.001 - 10.000.000 )\', \'mean\')']) + '%',
                3: 'Rata-rata pendapatan < 2.5 juta = ' + Math.round(res3['Fourth']['(\'Pendapatan ( < 2.500.000 )\', \'mean\')']) + '%\n5 - 10 juta = ' + Math.round(res3['Fourth']['(\'Pendapatan ( 5.000.001 - 10.000.000 )\', \'mean\')']) + '%',
                4: 'Rata-rata pendapatan 2.5 - 5 juta = ' + Math.round(res3['Fifth']['(\'Pendapatan ( 2.500.000 - 5.000.000 )\', \'mean\')']) + '%',
            }

            const ket_cluster4 = {
                0: 'Rata-rata luas rumah < 36 m^2 = ' + Math.round(res4['First']['(\'Luas rumah ( < 36 m^2 )\', \'mean\')']) + '%\n54 - 120 m^2 = ' + Math.round(res4['First']['(\'Luas rumah ( 54 - 120 m^2 )\', \'mean\')']) + '%',
                1: 'Rata-rata luas rumah 54 - 120 m^2 = ' + Math.round(res4['Second']['(\'Luas rumah ( 54 - 120 m^2 )\', \'mean\')']) + '%',
                2: 'Rata-rata luas rumah 36 - 54 m^2 = ' + Math.round(res4['Third']['(\'Luas rumah ( 36 - 54 m^2 )\', \'mean\')']) + '%',
                3: 'Rata-rata luas rumah 54 - 120 m^2 = ' + Math.round(res4['Fourth']['(\'Luas rumah ( 54 - 120 m^2 )\', \'mean\')']) + '%',
                4: 'Rata-rata luas rumah > 120 m^2 = ' + Math.round(res4['Fifth']['(\'Luas rumah ( > 120 m^2 )\', \'mean\')']) + '%',
            }

            const ket_cluster5 = {
                0: 'Rata-rata telah BCG = ' + Math.round(res5['First']['(\'Persentase anak telah BCG\', \'mean\')']) + '%\nkeluarga diabetes = ' + Math.round(res5['First']['(\'Persentase kasus dengan keluarga menderita diabetes\', \'mean\')']) + '%\nTB serumah = ' + Math.round(res5['First']['(\'Persentase kasus dengan riwayat TB serumah\', \'mean\')']) + '%\nASI eksklusif = ' + Math.round(res5['First']['(\'Persentase anak dengan ASI eksklusif\', \'mean\')']) + '%\nanak diabetes = ' + Math.round(res5['First']['(\'Persentase anak menderita diabetes\', \'mean\')']) + '%',
                1: 'Rata-rata telah BCG = ' + Math.round(res5['Second']['(\'Persentase anak telah BCG\', \'mean\')']) + '%\nASI eksklusif = ' + Math.round(res5['Second']['(\'Persentase anak dengan ASI eksklusif\', \'mean\')']) + '%\nTB serumah = ' + Math.round(res5['Second']['(\'Persentase kasus dengan riwayat TB serumah\', \'mean\')']) + '%',
                2: 'Rata-rata anak diabetes = ' + Math.round(res5['Third']['(\'Persentase anak menderita diabetes\', \'mean\')']) + '%\nTB serumah = ' + Math.round(res5['Third']['(\'Persentase kasus dengan riwayat TB serumah\', \'mean\')']) + '%\ntelah BCG = ' + Math.round(res5['Third']['(\'Persentase anak telah BCG\', \'mean\')']) + '%',
                3: 'Rata-rata telah BCG = ' + Math.round(res5['Fourth']['(\'Persentase anak telah BCG\', \'mean\')']) + '%\nASI Eksklusif = ' + Math.round(res5['Fourth']['(\'Persentase anak dengan ASI eksklusif\', \'mean\')']) + '%\nkeluarga diabetes = ' + Math.round(res5['Fourth']['(\'Persentase kasus dengan keluarga menderita diabetes\', \'mean\')']) + '%',
            }

            const result1 = ket_cluster1[resultKec1.Total].split('\n').map(e => `${e}<br/>`).join('')
            const result2 = ket_cluster2[resultKec2.Total].split('\n').map(e => `${e}<br/>`).join('')
            const result3 = ket_cluster3[resultKec3.Total].split('\n').map(e => `${e}<br/>`).join('')
            const result4 = ket_cluster4[resultKec4.Total].split('\n').map(e => `${e}<br/>`).join('')
            const result5 = ket_cluster5[resultKec5.Total].split('\n').map(e => `${e}<br/>`).join('')

            return (
                <div className="text-lg">
                    <CircleMarker
                        key={kec}
                        center={position1}
                        className={`circle-marker visible ${color_cluster1} ${kec.split(' (')[0].replace(' ', '-')}`}
                        pathOptions={{color: color_cluster1}}
                        radius={8}
                        fillOpacity={1.0}
                    >
                        <Popup>
                            <h3 style={{textAlign: 'center'}}>
                                <b style={{color: 'darkslategray', fontSize : '14px'}} >Kecamatan {kec}</b>
                            </h3>
                            <br/>

                            <div className="text-right" style={{fontSize : '14px'}}>
                                <div dangerouslySetInnerHTML={{__html: result1}}></div>
                                <br/><br/>
                                Jumlah TB anak = {resultKec1['Jumlah TB']}
                            </div>

                        </Popup>
                    </CircleMarker>,

                    <CircleMarker
                        key={kec}
                        center={position2}
                        pathOptions={{color: color_cluster2}}
                        className={`circle-marker visible ${color_cluster2} ${kec.split(' (')[0].replace(' ', '-')}`}
                        radius={8}
                        fillOpacity={1.0}
                    >
                        <Popup>
                            <h3 style={{textAlign: 'center'}}>
                                <b style={{color: 'darkslategray', fontSize : '14px'}}>Kecamatan {kec}</b>
                            </h3>
                            <br/>

                            <div className="text-right" style={{fontSize : '14px'}}>
                                <div dangerouslySetInnerHTML={{__html: result2}} ></div>
                                {/*{ket_cluster2[resultKec2.Total]}*/}
                                <br/><br/>
                                Jumlah TB anak = {resultKec1['Jumlah TB']}
                            </div>

                        </Popup>
                    </CircleMarker>
                    <CircleMarker
                        key={kec}
                        center={position3}
                        pathOptions={{color: color_cluster3}}
                        className={`circle-marker visible ${color_cluster3} ${kec.split(' (')[0].replace(' ', '-')}`}
                        radius={8}
                        fillOpacity={1.0}
                    >
                        <Popup>
                            <h3 style={{textAlign: 'center'}}>
                                <b style={{color: 'darkslategray', fontSize : '14px'}}>Kecamatan {kec}</b>
                            </h3>
                            <br/>

                            <div className="text-right" style={{fontSize : '14px'}}>
                                <div dangerouslySetInnerHTML={{__html: result3}}></div>
                                {/*{ket_cluster3[resultKec3.Total]}*/}
                                <br/><br/>
                                Jumlah TB anak = {resultKec1['Jumlah TB']}
                            </div>

                        </Popup>
                    </CircleMarker>
                    <CircleMarker
                        key={kec}
                        center={position4}
                        pathOptions={{color: color_cluster4}}
                        className={`circle-marker visible ${color_cluster4} ${kec.split(' (')[0].replace(' ', '-')}`}
                        radius={8}
                        fillOpacity={1.0}
                    >
                        <Popup>
                            <h3 style={{textAlign: 'center'}} >
                                <b style={{color: 'darkslategray', fontSize : '14px'}} >Kecamatan {kec}</b>
                            </h3>
                            <br/>

                            <div className="text-right" style={{fontSize : '14px'}}>
                                <div dangerouslySetInnerHTML={{__html: result4}}></div>
                                {/*{ket_cluster4[resultKec4.Total]}*/}
                                <br/><br/>
                                Jumlah TB anak = {resultKec1['Jumlah TB']}
                            </div>

                        </Popup>
                    </CircleMarker>
                    <CircleMarker
                        key={kec}
                        center={position5}
                        pathOptions={{color: color_cluster5}}
                        className={`circle-marker visible ${color_cluster5} ${kec.split(' (')[0].replace(' ', '-')}`}
                        radius={8}
                        fillOpacity={1.0}
                    >
                        <Popup>
                            <h3 style={{textAlign: 'center'}}>
                                <b style={{color: 'darkslategray', fontSize : '14px'}}>Kecamatan {kec}</b>
                            </h3>
                            <br/>

                            <div className="text-right" style={{fontSize : '14px'}}>
                                <div dangerouslySetInnerHTML={{__html: result5}}></div>
                                {/*{ket_cluster5[resultKec5.Total]}*/}
                                <br/><br/>
                                Jumlah TB anak = {resultKec1['Jumlah TB']}
                            </div>

                        </Popup>
                    </CircleMarker>
                </div>
            )
        }
    });
}


const Map = (props) => {
    const {data, selectedData, center, loading, setReg} = props

    const [selectedColor, setSelectedColor] = useState('')
    const [map, setMap] = useState(null);
    const [selectedKec, setSelectedKec] = useState(null);
    const [showLegend, setShowLegend] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const onClickColor = (color) => {
        let pink = document.querySelectorAll('.circle-marker')
        for (let i = 0; i < pink.length; i++) {
            if (color !== '' && !pink[i].classList.contains(color)) {
                pink[i].classList.remove('visible')
                pink[i].classList.add('hidden')
            } else if (color === '' && pink[i].classList.contains('hidden')) {
                pink[i].classList.remove('hidden')
                pink[i].classList.add('visible')
            } else {
                pink[i].classList.remove('hidden')
                pink[i].classList.add('visible')
            }
        }
        setSelectedColor(color)
    }
    const kec = data?.cluster1_df

    const warna = {
        0: '#E31A1C',
        1: '#ff7400',
        2: '#ff7b7b',
        3: '#0f5e9c',
        4: '#9D5C0D',
        5: '#800026',
        6: '#063b00',
        7: '#854442',
        8: '#089000',
        9: '#be9b7b',
        10: '#0eff00',
        11: '#a98600',
        12: '#535353',
        13: '#e9d700',
        14: '#f8ed62',
        15: '#fff9ae',
        16: '#660066',
        17: '#00ffff',
        18: '#8E3200',
        19: '#ff0074'
    }

    const handleCluster = () => {
        const req = fetch(`http://127.0.0.1:8080/run_cluster`, {
            method: "POST",
        })
        Router.push({
            pathname: "/cluster",
            query: {generate: 1}
        })
        Router.reload()
    };

    const getColor = d => {
        return d > 25 ? '#800026' :
            d > 20 ? '#BD0026' :
                d > 15 ? '#E31A1C' :
                    d > 10 ? '#FC4E2A' :
                        d > 5 ? '#FD8D3C' :
                            '#FED976';
        // d > 1 ? '#FEB24C' :
        // d > 1 ? '#FED976' :
        // '#FFEDA0');
    }

    return (
        <>
            <div className="bg-[#343A40] h-full pb-2">
                <LoadingOverlay
                    active={loading}
                    spinner
                    text='Building cluster, please wait...'>
                    <MapContainer center={center || [-5.136143, 119.469370]} zoom={13} scrollWheelZoom={false}
                                  className={'cluster-mapid'} whenCreated={setMap}>
                        <TileLayer
                            attribution='&copy; <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {
                            Object.keys(statesData).map((state) => {
                                let jumlah_kasus = 0
                                let split_state = state.split(' ')
                                split_state.splice(-1)
                                let no_kota = split_state.join(' ')
                                for (let k in kec) {
                                    if (no_kota == k.split(' (')[0]) {
                                        jumlah_kasus = kec[k]['Jumlah TB']
                                        continue
                                    }
                                }
                                var coordinates = [];
                                if (statesData[state].type === 'MultiPolygon') {

                                    var tes = [];

                                    for (const i in statesData[state].coordinates) {
                                        const coord = statesData[state].coordinates[i][0].map((item) => [item[1], item[0]]);
                                        tes.push(coord);
                                        // console.log(tes);
                                    }
                                    coordinates = tes;
                                } else {
                                    coordinates = statesData[state].coordinates[0].map((item) => [item[1], item[0]]);
                                }

                                return (<Polygon
                                        pathOptions={{
                                            fillColor: getColor(jumlah_kasus),
                                            fillOpacity: 0.7,
                                            weight: 2,
                                            opacity: 1,
                                            dashArray: 3,
                                            graphicZIndex: 1,
                                            zIndex: 1,
                                            color: 'white'
                                        }}
                                        positions={coordinates}
                                        eventHandlers={{
                                            mouseover: (e) => {
                                                // setSelectedKec(state)
                                                // setShowLegend(true)
                                                const layer = e.target;
                                                layer.setStyle({
                                                    graphicZIndex: 9999999,
                                                    zIndex: 99999999,
                                                    weight: 4,
                                                    color: '#666',
                                                    dashArray: 3,
                                                    // fillOpacity: 0.5,
                                                })
                                            },
                                            mouseout: (e) => {
                                                // setShowLegend(false)
                                                const layer = e.target;
                                                layer.setStyle({
                                                    fillColor: getColor(jumlah_kasus),
                                                    fillOpacity: 0.7,
                                                    weight: 2,
                                                    opacity: 1,
                                                    dashArray: 3,
                                                    graphicZIndex: 1,
                                                    zIndex: 1,
                                                    color: 'white'
                                                });
                                            },
                                            click: (e) => {
                                                const layer = e.target;
                                                console.log('clicked ', layer)
                                            }
                                        }}
                                    >
                                        <Popup>
                                            <div className="text-center" style={{color: 'darkslategray',fontSize: '14px', }}>
                                                <b>Kecamatan {state}</b>
                                                    <br/>
                                                <br/>
                                                Jumlah TB anak : {jumlah_kasus}
                                            </div>
                                        </Popup>
                                    </Polygon>

                                )
                            })
                        }

                        {
                            data && <PointMarker data={data} selectedData={selectedData} selectedColor={selectedColor}/>
                        }

                        <Legend map={map}/>

                        {/*{*/}
                        {/*    selectedKec && showLegend ? <LegendClusterTop map={map} selectedKec={selectedKec}/> : null*/}
                        {/*}*/}
                    </MapContainer>
                </LoadingOverlay>
                <br/>

                {/*{*/}
                {/*    data &&*/}
                {/*    <div className="text-center">*/}
                {/*        <ClusterModal data={data} loading={loading}/>*/}
                {/*    </div>*/}
                {/*}*/}

                <div className="ml-2 grid grid-cols-1 gap-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1">
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[0])}>
                        <div className="col-span-1" style={{
                            color: '#E31A1C',
                            backgroundColor: '#E31A1C',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>
                        </div>
                        <div className="col-span-9" style={{color: 'white'}}> Jumlah TB terendah, Usia termuda</div>

                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[1])}>
                        <div className="col-span-1" style={{
                            color: '#ff7400',
                            backgroundColor: '#ff7400',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>

                        <div className="col-span-9" style={{color: 'white'}}> Jumlah TB tertinggi</div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[2])}>
                        <div className="col-span-1" style={{
                            color: '#ff7b7b',
                            backgroundColor: '#ff7b7b',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}>Jumlah TB kedua terendah, Usia tertua</div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[3])}>
                        <div className="col-span-1" style={{
                            color: '#0f5e9c',
                            backgroundColor: '#0f5e9c',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}>Persentase gizi baik tertinggi
                        </div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[4])}>
                        <div className="col-span-1" style={{
                            color: '#9D5C0D',
                            backgroundColor: '#9D5C0D',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}>Persentase gizi kurang tertinggi</div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[5])}>
                        <div className="col-span-1" style={{
                            color: warna[5],
                            backgroundColor: warna[5],
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}>Persentase gizi lebih tertinggi</div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[6])}>
                        <div className="col-span-1" style={{
                            color: '#063b00',
                            backgroundColor: '#063b00',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}>Pendapatan 5 - 10 juta tertinggi</div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[7])}>
                        <div className="col-span-1" style={{
                            color: '#854442',
                            backgroundColor: '#854442',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}>Pendapatan 2.5 - 5 juta kedua tertinggi
                        </div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[8])}>
                        <div className="col-span-1" style={{
                            color: '#089000',
                            backgroundColor: '#089000',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}> Pendapatan > 10 juta tertinggi</div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[9])}>
                        <div className="col-span-1" style={{
                            color: '#be9b7b',
                            backgroundColor: '#be9b7b',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}> {'Pendapatan < 2.5 juta tertinggi'}
                        </div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[10])}>
                        <div className="col-span-1" style={{
                            color: '#0eff00',
                            backgroundColor: '#0eff00',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}> Pendapatan 2.5 - 5 juta tertinggi</div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[11])}>
                        <div className="col-span-1" style={{
                            color: '#a98600',
                            backgroundColor: '#a98600',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}> {'Luas rumah < 36 m^2 tertinggi'}</div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[12])}>
                        <div className="col-span-1" style={{
                            color: '#535353',
                            backgroundColor: '#535353',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}> Luas rumah 54 - 120 m^2 kedua tertinggi
                        </div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[13])}>
                        <div className="col-span-1" style={{
                            color: '#e9d700',
                            backgroundColor: '#e9d700',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}> Luas rumah 36 - 54 m^2 tertinggi</div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[14])}>
                        <div className="col-span-1" style={{
                            color: '#f8ed62',
                            backgroundColor: '#f8ed62',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}> Luas rumah 54 - 120 m^2 tertinggi</div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[15])}>
                        <div className="col-span-1" style={{
                            color: '#fff9ae',
                            backgroundColor: '#fff9ae',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}> Luas rumah > 120 m^2 tertinggi</div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[16])}>
                        <div className="col-span-1" style={{
                            color: '#660066',
                            backgroundColor: '#660066',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>
                        </div>
                        <div className="col-span-9" style={{color: 'white'}}> Persentase telah BCG, keluarga diabetes,
                            TB serumah
                            kedua tertinggi
                        </div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[17])}>
                        <div className="col-span-1" style={{
                            color: '#00ffff',
                            backgroundColor: '#00ffff',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}> Persentase telah BCG terendah</div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[18])}>
                        <div className="col-span-1" style={{
                            color: '#8E3200',
                            backgroundColor: '#8E3200',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>

                        </div>
                        <div className="col-span-9" style={{color: 'white'}}> Persentase anak diabetes dan TB serumah
                            tertinggi
                        </div>
                    </div>
                    <div className="grid grid-cols-10 gap-1" onClick={() => onClickColor(warna[19])}>
                        <div className="col-span-1" style={{
                            color: '#ff0074',
                            backgroundColor: '#ff0074',
                            padding: 5,
                            borderRadius: 50,
                            width: '25px',
                            height: '25px'
                        }}>


                        </div>
                        <div className="col-span-9" style={{color: 'white'}}> Persentase telah BCG, ASI eksklusif dan
                            keluarga menderita diabetes tertinggi
                        </div>
                    </div>


                </div>

                <div className="flex items-center justify-center">
                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-5 mb-5"
                            onClick={() => onClickColor('')}>
                        Tampilkan semua cluster
                    </Button>
                    <Button
                        className="ml-8 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-5 mb-5"
                        onClick={() => setShowModal(true)}>
                        Interpretasi hasil cluster
                    </Button>
                </div>
            </div>

            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto h-5/6 my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div
                                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <InterpretasiCluster modalData={inter}/>
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
}

export default Map

