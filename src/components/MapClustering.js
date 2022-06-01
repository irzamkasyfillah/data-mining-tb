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
        const [showModal, setShowModal] = React.useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        const resultKec = coord[kec]

        const keys = Object.keys(resultKec)
        let daftar_opname = []
        let daftar_penyakit_lain = []

        for (let i of keys) {
            if (i.includes("(opname)")) {
                daftar_opname.push(i)
            }
            if (i.includes("(org serumah)")) {
                daftar_penyakit_lain.push(i)
            }
        }

        // console.log(daftar_opname, daftar_penyakit_lain)

        let daftar_opname_ya = []
        let daftar_penyakit_lain_ya = []
        for (let i of daftar_opname) {
            for (let j in resultKec) {
                if (i === j) {
                    // console.log('resultClust[i]', resultClust[i], i,j)
                    // if (resultKec[i] === "Ya") {
                    //     daftar_opname_ya.push(i)
                    // }
                    if ('Ya'.includes(String(resultKec[i][0][1]))){
                        var delete_op = i.replace('(opname)', '')
                        daftar_opname_ya.push(delete_op + '(' + resultKec[i][1]['Ya'] + '), ')
                    }
                }
            }
        }
        if (daftar_opname_ya.length == 0) {
            daftar_opname_ya = '-'
        }

        for (let i of daftar_penyakit_lain) {
            for (let j in resultKec) {
                if (i === j) {
                    // console.log('resultClust[i]', resultKec[i], i,j)
                    // if (resultKec[i] === "Ya") {
                    //     daftar_penyakit_lain_ya.push(i)
                    // }
                    if ('Ya'.includes(String(resultKec[i][0][1]))){
                        // console.log(i, kec , resultKec[i][1]['Ya'])
                        var delete_op = i.replace('(org serumah)', '')
                        daftar_penyakit_lain_ya.push(delete_op + '(' + resultKec[i][1]['Ya'] + '), ')
                    }
                }
            }
        }
        if (daftar_penyakit_lain_ya.length == 0) {
            daftar_penyakit_lain_ya = '-'
        }

        // const index = resultKec?.index
        const position = [resultKec?.latitude, resultKec?.longitude]

        const kasus = resultKec?.Total
        const cluster = resultKec?.Segment
        const umur = Math.round(resultKec?.['Tahun (mean)'])
        const tinggi = Math.round(resultKec?.['Tinggi badan (dalam cm) (mean)'])
        const berat = Math.round(resultKec?.['Berat badan (dalam kg) (mean)'])

        // const jenis_kelamin = resultKec?.['Jenis Kelamin']
        let jenis_kelamin = []
        for (let i=0; i<resultKec?.['Jenis Kelamin'][0].length; i++) {
            let status = resultKec?.['Jenis Kelamin'][0][i]
            jenis_kelamin.push(status + ' (' + resultKec?.['Jenis Kelamin'][1][status] + '), ')
        }

        // const alamat = 'Kec. ' + resultKec?.['Alamat (Kecamatan)'] + ', Kel. ' + resultKec?.['Alamat (Kelurahan)']
        // const alamat = 'Kec. ' + resultKec?.['Alamat (Kecamatan)']

        const pekerjaan = resultKec?.['Pekerjaan Ayah'] + ' & ' + resultKec?.['Pekerjaan Ibu']

        // const pendapatan = resultKec?.['Pendapatan Orang Tua']
        let pendapatan = []
        for (let i=0; i<resultKec?.['Pendapatan Orang Tua'][0].length; i++) {
            let status = resultKec?.['Pendapatan Orang Tua'][0][i]
            pendapatan.push(status + ' (' + resultKec?.['Pendapatan Orang Tua'][1][status] + '), ')
        }

        let status_gizi = []
        for (let i=0; i<resultKec?.['Status Gizi'][0].length; i++) {
            let status = resultKec?.['Status Gizi'][0][i]
            status_gizi.push(status + ' (' + resultKec?.['Status Gizi'][1][status] + '), ')
        }

        // const diabetes_anak = resultKec?.['riwayat diabetes anak']
        let diabetes_anak = []
        for (let i=0; i<resultKec?.['riwayat diabetes anak'][0].length; i++) {
            let status = resultKec?.['riwayat diabetes anak'][0][i]
            diabetes_anak.push(status + ' (' + resultKec?.['riwayat diabetes anak'][1][status] + '), ')
        }

        const opname = resultKec?.['riwayat opname']

        // const asi_eksklusif = resultKec?.['ASI eksklusif']
        let asi_eksklusif = []
        for (let i=0; i<resultKec?.['ASI eksklusif'][0].length; i++) {
            let status = resultKec?.['ASI eksklusif'][0][i]
            asi_eksklusif.push(status + ' (' + resultKec?.['ASI eksklusif'][1][status] + '), ')
        }

        // const tb_orang_serumah = resultKec?.['riwayat TB orang serumah']
        let tb_orang_serumah = []
        for (let i=0; i<resultKec?.['riwayat TB orang serumah'][0].length; i++) {
            let status = resultKec?.['riwayat TB orang serumah'][0][i]
            tb_orang_serumah.push(status + ' (' + resultKec?.['riwayat TB orang serumah'][1][status] + '), ')
        }

        // const diabetes_keluarga = resultKec?.['riwayat diabetes keluarga']
        let diabetes_keluarga = []
        for (let i=0; i<resultKec?.['riwayat diabetes keluarga'][0].length; i++) {
            let status = resultKec?.['riwayat diabetes keluarga'][0][i]
            diabetes_keluarga.push(status + ' (' + resultKec?.['riwayat diabetes keluarga'][1][status] + '), ')
        }

        const penyakit_lain = resultKec?.['riwayat penyakit lain orang serumah']

        // const luas_rumah = resultKec?.['luas rumah']
        let luas_rumah = []
        for (let i=0; i<resultKec?.['luas rumah'][0].length; i++) {
            let status = resultKec?.['luas rumah'][0][i]
            luas_rumah.push(status + ' (' + resultKec?.['luas rumah'][1][status] + '), ')
        }

        const jumlah_kamar = Math.round(resultKec?.['jumlah kamar tidur (mean)'])
        const jumlah_orang = Math.round(resultKec?.['jumlah orang dalam rumah (mean)'])

        // const sistem_ventilasi = resultKec?.['sistem ventilasi']
        let sistem_ventilasi = []
        for (let i=0; i<resultKec?.['sistem ventilasi'][0].length; i++) {
            let status = resultKec?.['sistem ventilasi'][0][i]
            sistem_ventilasi.push(status + ' (' + resultKec?.['sistem ventilasi'][1][status] + '), ')
        }

        // const bcg = resultKec?.['riwayat vaksin BCG']
        let bcg = []
        for (let i=0; i<resultKec?.['riwayat vaksin BCG'][0].length; i++) {
            let status = resultKec?.['riwayat vaksin BCG'][0][i]
            bcg.push(status + ' (' + resultKec?.['riwayat vaksin BCG'][1][status] + '), ')
        }

        // console.log(position)
        const redOptions = {color: 'red'}

        return (
            <CircleMarker
                key={kec}
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
                    Jenis Kelamin <pre style={{display: 'inline', marginLeft: '18%'}}> : </pre> {jenis_kelamin[0]}<br/>
                    Pekerjaan Orang Tua <pre style={{display: 'inline', marginLeft: '5%'}}> : </pre> {pekerjaan} <br/>
                    Pendapatan Orang Tua <pre style={{display: 'inline', marginLeft: '1.5%'}}> : </pre> {pendapatan[0]}
                    <br/>
                    Status Gizi <pre style={{display: 'inline', marginLeft: '23.8%'}}> : </pre> {status_gizi[0]} <br/>
                    Luas Rumah <pre style={{display: 'inline', marginLeft: '20.5%'}}> : </pre> {luas_rumah[0]} <br/>
                    Jumlah Kamar <pre style={{display: 'inline', marginLeft: '17.5%'}}> : </pre> {jumlah_kamar} <br/>
                    Jumlah Orang <pre style={{display: 'inline', marginLeft: '18%'}}> : </pre> {jumlah_orang} <br/>
                    Sistem Ventilasi <pre style={{display: 'inline', marginLeft: '15%'}}> : </pre> {sistem_ventilasi[0]}
                    <br/>
                    Vaksin BCG <pre style={{display: 'inline', marginLeft: '21.8%'}}> : </pre> {bcg[0]} <br/>
                    <br/>

                    <div className="text-center">
                        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                variant="primary" onClick={() => setShowModal(true)}>
                            Lihat selengkapnya..
                        </Button>
                    </div>

                </Popup>

                {showModal ? (
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[1000] outline-none focus:outline-none"
                        >
                            <div className="relative w-auto my-6 mx-auto max-w-6xl">
                                {/*content*/}
                                <div
                                    className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div
                                        className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-3xl font-semibold">
                                            Kecamatan {kec}
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
                                    <div style={{maxHeight: 400, overflowY: "auto", overflowX: "auto"}}
                                         className="relative p-6 flex-auto m-2 text-center">
                                        <h2 className="font-semibold" style={{textAlign: "end"}}>CLUSTER
                                            : {cluster}</h2>
                                        <h3 className="font-semibold" style={{textAlign: "end"}}>TOTAL : {kasus}</h3>


                                        <h3 className="font-semibold" style={{textAlign: "start"}}>DATA ANAK</h3>
                                        <br/>
                                        <hr/>
                                        <table style={{border: 1}} className="table-auto">
                                            <thead>
                                            <tr>
                                                <th className="px-4 py-2">Umur</th>
                                                <th className="px-4 py-2">Jenis Kelamin</th>
                                                <th className="px-4 py-2">Pekerjaan</th>
                                                <th className="px-4 py-2">Pendapatan</th>
                                                <th className="px-4 py-2">Tinggi</th>
                                                <th className="px-4 py-2">Berat</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="border px-4 py-2">{umur}</td>
                                                <td className="border px-4 py-2">{jenis_kelamin}</td>
                                                <td className="border px-4 py-2">{pekerjaan}</td>
                                                <td className="border px-4 py-2">{pendapatan}</td>
                                                <td className="border px-4 py-2">{tinggi}</td>
                                                <td className="border px-4 py-2">{berat}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <br/>

                                        <h3 className="font-semibold" style={{textAlign: "start"}}>RIWAYAT KESEHATAN
                                            ANAK</h3>
                                        <br/>
                                        <hr/>
                                        <table className="table-auto">
                                            <thead>
                                            <tr>
                                                <th className="w-1/4 px-4 py-2">Status Gizi</th>
                                                <th className="w-1/4 px-4 py-2">Diabetes</th>
                                                <th className="w-1/4 px-4 py-2">Riwayat Penyakit</th>
                                                <th className="w-1/4 px-4 py-2">Vaksin BCG</th>
                                                <th className="w-1/4 px-4 py-2">ASI Eksklusif</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="border px-4 py-2">{status_gizi}</td>
                                                <td className="border px-4 py-2">{diabetes_anak}</td>
                                                <td className="border px-4 py-2">{daftar_opname_ya}</td>
                                                <td className="border px-4 py-2">{bcg}</td>
                                                <td className="border px-4 py-2">{asi_eksklusif}</td>
                                            </tr>
                                            </tbody>
                                        </table>

                                        <br/>
                                        <h3 className="font-semibold" style={{textAlign: "start"}}>RIWAYAT PENYAKIT
                                            ORANG SERUMAH</h3>
                                        <br/>
                                        <hr/>
                                        <table className="table-auto">
                                            <thead>
                                            <tr>
                                                <th className="w-1/6 px-4 py-2">Riwayat TB</th>
                                                <th className="w-1/6 px-4 py-2">Riwayat Diabetes Keluarga</th>
                                                <th className="w-1/6 px-4 py-2">Riwayat Penyakit Lain</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="border px-4 py-2">{tb_orang_serumah}</td>
                                                <td className="border px-4 py-2">{diabetes_keluarga}</td>
                                                <td className="border px-4 py-2">{daftar_penyakit_lain_ya}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <br/>
                                        <h3 className="font-semibold" style={{textAlign: "start"}}>KONDISI RUMAH</h3>
                                        <br/>
                                        <hr/>
                                        <table className="table-auto">
                                            <thead>
                                            <tr>
                                                <th className="w-1/4 px-4 py-2">Luas Rumah</th>
                                                <th className="w-1/4 px-4 py-2">Jumlah Kamar</th>
                                                <th className="w-1/4 px-4 py-2">Jumlah Orang</th>
                                                <th className="w-1/4 px-4 py-2">Sistem Ventilasi</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="border px-4 py-2">{luas_rumah}</td>
                                                <td className="border px-4 py-2">{jumlah_kamar}</td>
                                                <td className="border px-4 py-2">{jumlah_orang}</td>
                                                <td className="border px-4 py-2">{sistem_ventilasi}</td>
                                            </tr>
                                            </tbody>
                                        </table>


                                    </div>
                                    {/*footer*/}
                                    <div
                                        className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-white rounded bg-red-500 background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}


            </CircleMarker>
        )
    });
}

function ClusterModal(props) {
    const {data, selectedData, center, loading} = props
    console.log("data", data)
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
        const keys = Object.keys(resultClust)
        let daftar_opname = []
        let daftar_penyakit_lain = []

        for (let i of keys) {
            if (i.includes("(opname)")) {
                daftar_opname.push(i)
            }
            if (i.includes("(org serumah)")) {
                daftar_penyakit_lain.push(i)
            }
        }

        // console.log(daftar_opname, daftar_penyakit_lain)

        let daftar_opname_ya = []
        let daftar_penyakit_lain_ya = []
        for (let i of daftar_opname) {
            for (let j in resultClust) {
                if (i === j) {
                    // console.log('resultClust[i]', resultClust[i], i,j)
                    // if (resultClust[i] === "Ya") {
                    //     daftar_opname_ya.push(i)
                    // }
                    // console.log(resultClust[i][0][1])
                    if ('Ya'.includes(String(resultClust[i][0][1]))){
                        var delete_op = i.replace('(opname)', '')
                        daftar_opname_ya.push(delete_op + '(' + resultClust[i][1]['Ya'] + '), ')
                    }
                }
            }
        }

        for (let i of daftar_penyakit_lain) {
            for (let j in resultClust) {
                if (i === j) {
                    // console.log('resultClust[i]', resultClust[i], i,j)
                    // if (resultClust[i] === "Ya") {
                    //     daftar_penyakit_lain_ya.push(i)
                    // }
                    if ('Ya'.includes(String(resultClust[i][0][1]))){
                        // console.log(i, clust , resultClust[i][1]['Ya'])
                        var delete_op = i.replace('(org serumah)', '')
                        daftar_penyakit_lain_ya.push(delete_op + '(' + resultClust[i][1]['Ya'] + '), ')
                    }
                }
            }
        }

        const kasus = resultClust?.Total
        const cluster = resultClust?.Segment
        const umur = Math.round(resultClust?.['Tahun (mean)'])
        const tinggi = Math.round(resultClust?.['Tinggi badan (dalam cm) (mean)'])
        const berat = Math.round(resultClust?.['Berat badan (dalam kg) (mean)'])

        // const jenis_kelamin = resultClust?.['Jenis Kelamin']
        let jenis_kelamin = []
        for (let i=0; i<resultClust?.['Jenis Kelamin'][0].length; i++) {
            let status = resultClust?.['Jenis Kelamin'][0][i]
            jenis_kelamin.push(status + ' (' + resultClust?.['Jenis Kelamin'][1][status] + '), ')
        }

        // const alamat = 'Kec. ' + resultClust?.['Alamat (Kecamatan)'] + ', Kel. ' + resultClust?.['Alamat (Kelurahan)']
        // const alamat = 'Kec. ' + resultClust?.['Alamat (Kecamatan)']
        let alamat = []
        for (let i=0; i<resultClust?.['Alamat (Kecamatan)'][0].length; i++) {
            let status = resultClust?.['Alamat (Kecamatan)'][0][i]
            alamat.push(status + ' (' + resultClust?.['Alamat (Kecamatan)'][1][status] + '), ')
        }

        const pekerjaan = resultClust?.['Pekerjaan Ayah'] + ' & ' + resultClust?.['Pekerjaan Ibu']

        // const pendapatan = resultClust?.['Pendapatan Orang Tua']
        let pendapatan = []
        for (let i=0; i<resultClust?.['Pendapatan Orang Tua'][0].length; i++) {
            let status = resultClust?.['Pendapatan Orang Tua'][0][i]
            pendapatan.push(status + ' (' + resultClust?.['Pendapatan Orang Tua'][1][status] + '), ')
        }

        let status_gizi = []
        for (let i=0; i<resultClust?.['Status Gizi'][0].length; i++) {
            let status = resultClust?.['Status Gizi'][0][i]
            status_gizi.push(status + ' (' + resultClust?.['Status Gizi'][1][status] + '), ')
        }

        // const diabetes_anak = resultClust?.['riwayat diabetes anak']
        let diabetes_anak = []
        for (let i=0; i<resultClust?.['riwayat diabetes anak'][0].length; i++) {
            let status = resultClust?.['riwayat diabetes anak'][0][i]
            diabetes_anak.push(status + ' (' + resultClust?.['riwayat diabetes anak'][1][status] + '), ')
        }

        const opname = resultClust?.['riwayat opname']

        // const asi_eksklusif = resultClust?.['ASI eksklusif']
        let asi_eksklusif = []
        for (let i=0; i<resultClust?.['ASI eksklusif'][0].length; i++) {
            let status = resultClust?.['ASI eksklusif'][0][i]
            asi_eksklusif.push(status + ' (' + resultClust?.['ASI eksklusif'][1][status] + '), ')
        }

        // const tb_orang_serumah = resultClust?.['riwayat TB orang serumah']
        let tb_orang_serumah = []
        for (let i=0; i<resultClust?.['riwayat TB orang serumah'][0].length; i++) {
            let status = resultClust?.['riwayat TB orang serumah'][0][i]
            tb_orang_serumah.push(status + ' (' + resultClust?.['riwayat TB orang serumah'][1][status] + '), ')
        }

        // const diabetes_keluarga = resultClust?.['riwayat diabetes keluarga']
        let diabetes_keluarga = []
        for (let i=0; i<resultClust?.['riwayat diabetes keluarga'][0].length; i++) {
            let status = resultClust?.['riwayat diabetes keluarga'][0][i]
            diabetes_keluarga.push(status + ' (' + resultClust?.['riwayat diabetes keluarga'][1][status] + '), ')
        }

        const penyakit_lain = resultClust?.['riwayat penyakit lain orang serumah']

        // const luas_rumah = resultClust?.['luas rumah']
        let luas_rumah = []
        for (let i=0; i<resultClust?.['luas rumah'][0].length; i++) {
            let status = resultClust?.['luas rumah'][0][i]
            luas_rumah.push(status + ' (' + resultClust?.['luas rumah'][1][status] + '), ')
        }

        const jumlah_kamar = Math.round(resultClust?.['jumlah kamar tidur (mean)'])
        const jumlah_orang = Math.round(resultClust?.['jumlah orang dalam rumah (mean)'])

        // const sistem_ventilasi = resultClust?.['sistem ventilasi']
        let sistem_ventilasi = []
        for (let i=0; i<resultClust?.['sistem ventilasi'][0].length; i++) {
            let status = resultClust?.['sistem ventilasi'][0][i]
            sistem_ventilasi.push(status + ' (' + resultClust?.['sistem ventilasi'][1][status] + '), ')
        }

        // const bcg = resultClust?.['riwayat vaksin BCG']
        let bcg = []
        for (let i=0; i<resultClust?.['riwayat vaksin BCG'][0].length; i++) {
            let status = resultClust?.['riwayat vaksin BCG'][0][i]
            bcg.push(status + ' (' + resultClust?.['riwayat vaksin BCG'][1][status] + '), ')
        }

        return (
            <>
                <div className="inline">
                    <Button style={{backgroundColor: months[i]}}
                            className="text-white font-bold py-2 px-4 rounded mx-3 d-inline-block"
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
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[1000] outline-none focus:outline-none"
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
                                    <div style={{maxHeight: 400, overflowY: "auto", overflowX: "auto"}}
                                         className="table-modal relative p-6 flex-auto m-2 text-sm">
                                        <h3 className="font-semibold" style={{textAlign: "end"}}>TOTAL : {kasus}</h3>
                                        <h3 className="font-semibold" style={{textAlign: "start"}}>DATA ANAK</h3>
                                        <br/>
                                        <hr/>
                                        <table style={{border: 1}} className="table-auto">
                                            <thead>
                                            <tr>
                                                <th className="px-4 py-2">Umur</th>
                                                <th className="px-4 py-2">Jenis Kelamin</th>
                                                <th className="px-4 py-2">Alamat</th>
                                                <th className="px-4 py-2">Pekerjaan</th>
                                                <th className="px-4 py-2">Pendapatan</th>
                                                <th className="px-4 py-2">Tinggi</th>
                                                <th className="px-4 py-2">Berat</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="border px-4 py-2">{umur}</td>
                                                <td className="border px-4 py-2">{jenis_kelamin}</td>
                                                <td className="border px-4 py-2">{alamat}</td>
                                                <td className="border px-4 py-2">{pekerjaan}</td>
                                                <td className="border px-4 py-2">{pendapatan}</td>
                                                <td className="border px-4 py-2">{tinggi}</td>
                                                <td className="border px-4 py-2">{berat}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <br/>

                                        <h3 className="font-semibold" style={{textAlign: "start"}}>RIWAYAT KESEHATAN
                                            ANAK</h3>
                                        <br/>
                                        <hr/>
                                        <table className="table-auto">
                                            <thead>
                                            <tr>
                                                <th className="w-1/4 px-4 py-2">Status Gizi</th>
                                                <th className="w-1/4 px-4 py-2">Diabetes</th>
                                                <th className="w-1/4 px-4 py-2">Riwayat Penyakit</th>
                                                <th className="w-1/4 px-4 py-2">Vaksin BCG</th>
                                                <th className="w-1/4 px-4 py-2">ASI Eksklusif</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="border px-4 py-2">{status_gizi}</td>
                                                <td className="border px-4 py-2">{diabetes_anak}</td>
                                                <td className="border px-4 py-2">{daftar_opname_ya}</td>
                                                <td className="border px-4 py-2">{bcg}</td>
                                                <td className="border px-4 py-2">{asi_eksklusif}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <br/>
                                        <h3 className="font-semibold" style={{textAlign: "start"}}>RIWAYAT PENYAKIT
                                            ORANG SERUMAH</h3>
                                        <br/>
                                        <hr/>
                                        <table className="table-auto">
                                            <thead>
                                            <tr>
                                                <th className="w-1/6 px-4 py-2">Riwayat TB</th>
                                                <th className="w-1/6 px-4 py-2">Riwayat Diabetes Keluarga</th>
                                                <th className="w-1/6 px-4 py-2">Riwayat Penyakit Lain</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="border px-4 py-2">{tb_orang_serumah}</td>
                                                <td className="border px-4 py-2">{diabetes_keluarga}</td>
                                                <td className="border px-4 py-2">{daftar_penyakit_lain_ya}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <br/>
                                        <h3 className="font-semibold" style={{textAlign: "start"}}>KONDISI RUMAH</h3>
                                        <br/>
                                        <hr/>
                                        <table className="table-auto">
                                            <thead>
                                            <tr>
                                                <th className="w-1/5 px-4 py-2">Luas Rumah</th>
                                                <th className="w-1/5 px-4 py-2">Jumlah Kamar</th>
                                                <th className="w-1/5 px-4 py-2">Jumlah Orang</th>
                                                <th className="w-1/5 px-4 py-2">Sistem Ventilasi</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="border px-4 py-2">{luas_rumah}</td>
                                                <td className="border px-4 py-2">{jumlah_kamar}</td>
                                                <td className="border px-4 py-2">{jumlah_orang}</td>
                                                <td className="border px-4 py-2">{sistem_ventilasi}</td>
                                            </tr>
                                            </tbody>
                                        </table>


                                    </div>
                                    {/*footer*/}
                                    <div
                                        className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-white rounded bg-red-500 background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Tutup
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

    // function reloadData() {
    //     setReg(true);
    //     Router.push({
    //         pathname: "/cluster",
    //         query: {generate: 1}
    //     })
    //     // Router.reload()
    // }

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

    return (
        <>
            <div className="bg-[#343A40] h-screen">
                <LoadingOverlay
                    active={loading}
                    spinner
                    text='Building cluster, please wait...'>
                    <MapContainer center={center || [-5.136143, 119.469370]} zoom={12} scrollWheelZoom={false}
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
                        <ClusterModal data={data} loading={loading}/>
                    </div>
                }
                <br/><br/>
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        variant="primary" onClick={() => handleCluster()}>
                    REGENERATE DATA
                </Button>
            </div>
        </>
    )
}

export default Map


