import {withMainLayout} from "../../src/components/MainLayout"
import React, {useEffect, useState} from "react";
import Router, {useRouter} from 'next/router';


function Panduan() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [state, setState] = useState({
        umur: "",
        tinggi: "",
        berat: "",
        jenis_kelamin: "",
        kelurahan: "",
        kecamatan: "",
        kab_kota: "",
        pekerjaan_ayah: "",
        pekerjaan_ibu: "",
        pendapatan: "",
        diabetes_anak: "",
        vaksin_bcg: "",
        riwayat_opname: "",
        daftar_penyakit_opname: "",
        asi_eksklusif: "",
        tb_serumah: "",
        diabetes_ortu: "",
        riwayat_penyakit_serumah: "",
        daftar_penyakit_serumah: "",
        luas_rumah: "",
        jumlah_kamar: 0,
        jumlah_orang: 0,
        sistem_ventilasi: "",
    });

    const router = useRouter()

    const fetchData = async () => {
        const req = await fetch(`http://127.0.0.1:8080/data-edit/${router.query.id}`, {
            method: "GET",
        })
            .then((res) => res.json()
            )
            .then((data) => {
                console.log(data, 'ini datanya')
                // setState(data);
                setState({
                    umur : data['umur'],
                    tinggi : data['tinggi_badan'],
                    berat : data['berat_badan'],
                    jenis_kelamin : data['jenis_kelamin'],
                    kelurahan : data['alamat_kelurahan'],
                    kecamatan : data['alamat_kecamatan'],
                    kab_kota : data['alamat_kota'],
                    pekerjaan_ayah : data['pekerjaan_ayah'],
                    pekerjaan_ibu : data['pekerjaan_ibu'],
                    pendapatan : data['pendapatan'],
                    diabetes_anak : data['diabetes_anak'],
                    vaksin_bcg : data['vaksin_bcg'],
                    riwayat_opname : data['riwayat_opname_anak'],
                    daftar_penyakit_opname : data['penyakit_anak'],
                    asi_eksklusif : data['asi_ekslusif'],
                    tb_serumah : data['tb_serumah'],
                    diabetes_ortu : data['diabetes_serumah'],
                    riwayat_penyakit_serumah : data['penyakit_lainnya'],
                    daftar_penyakit_serumah : data['penyakit_serumah'],
                    luas_rumah : data['luas_rumah'],
                    jumlah_kamar : 0,
                    jumlah_orang : 0,
                    sistem_ventilasi : ''
                })
            })
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {}

        for (let [key, value] of Object.entries(state)) {
            data[key] = value
        }

        console.log(data, 'data')

        const req = fetch(`http://127.0.0.1:8080/data-update/${router.query.id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        })
            .then(() => {
                router.push({
                    pathname: "/dashboard",
                });
            })
    };

    function handleChange(e) {
        setState({...state, [e.target.name]: e.target.value});
    }

    const handleBack = async (event) => {
        Router.push({
            pathname: "/dashboard",
        });
    };

    return (
        <div className="m-5">
            <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={handleSubmit}>

                <button
                    type="button"
                    onClick={handleBack}
                    className="float-right mt-2 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded"
                >
                    Back
                </button>
                <h2 className="block text-gray-700 text-lg font-bold mb-4">EDIT DATA</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="umur">
                        Umur
                    </label>
                    <input
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="umur"
                        name="umur"
                        type="text"
                        placeholder="Umur"
                        onChange={handleChange}
                        value={state.umur}>
                    </input>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tinggi">
                        Tinggi Badan (cm)
                    </label>
                    <input
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="tinggi"
                        name="tinggi"
                        type="number"
                        placeholder=""
                        onChange={handleChange}
                        value={state.tinggi}>
                    </input>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="berat">
                        Berat Badan (kg)
                    </label>
                    <input
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="berat"
                        name="berat"
                        type="number"
                        placeholder=""
                        onChange={handleChange}
                        value={state.berat}>
                    </input>
                </div>
                <div className="mb-6 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jenis_kelamin">
                        Jenis Kelamin
                    </label>
                    <select value={state.jenis_kelamin} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="jenis_kelamin" id="jenis_kelamin">
                        <option value="" disabled selected>Pilih Jenis Kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kelurahan">
                        Kelurahan
                    </label>
                    <input
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="kelurahan"
                        name="kelurahan"
                        type="text"
                        placeholder=""
                        onChange={handleChange}
                        value={state.kelurahan}>
                    </input>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kecamatan">
                        Kecamatan
                    </label>
                    <input
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="kecamatan"
                        name="kecamatan"
                        type="text"
                        placeholder=""
                        onChange={handleChange}
                        value={state.kecamatan}>
                    </input>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kab_kota">
                        Kabupaten / Kota
                    </label>
                    <input
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="kab_kota"
                        name="kab_kota"
                        type="text"
                        placeholder=""
                        onChange={handleChange}
                        value={state.kab_kota}>
                    </input>
                </div>
                <div className="mb-6 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pekerjaan_ayah">
                        Pekerjaan Ayah
                    </label>
                    <select value={state.pekerjaan_ayah} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="pekerjaan_ayah" id="pekerjaan_ayah">
                        <option value="" disabled selected>Pilih Pekerjaan Ayah</option>
                        <option value="PNS">PNS</option>
                        <option value="TNI / POLRI">TNI / POLRI</option>
                        <option value="Karyawan Swasta">Karyawan Swasta</option>
                        <option value="Wiraswasta">Wiraswasta</option>
                        <option value="ASN">ASN</option>
                        <option value="Tidak bekerja">Tidak bekerja</option>
                    </select>
                </div>
                <div className="mb-6 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pekerjaan_ibu">
                        Pekerjaan Ibu
                    </label>
                    <select value={state.pekerjaan_ibu} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="pekerjaan_ibu" id="pekerjaan_ibu">
                        <option value="" disabled selected>Pilih Pekerjaan Ibu</option>
                        <option value="PNS">PNS</option>
                        <option value="TNI / POLRI">TNI / POLRI</option>
                        <option value="Karyawan Swasta">Karyawan Swasta</option>
                        <option value="Wiraswasta">Wiraswasta</option>
                        <option value="ASN">ASN</option>
                        <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
                        <option value="Tidak bekerja">Tidak bekerja</option>
                    </select>
                </div>
                <div className="mb-6 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pendapatan">
                        Pendapatan Orang Tua
                    </label>
                    <select value={state.pendapatan} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="pendapatan" id="pendapatan">
                        <option value="" disabled selected>Pilih Pendapatan</option>
                        <option value="< 2.500.000">{'< 2.500.000'}</option>
                        <option value="2.500.000 - 5.000.000">2.500.000 - 5.000.000</option>
                        <option value="5.000.001 - 10.000.000">5.000.001 - 10.000.000</option>
                        <option value="> 10.000.000">> 10.000.000</option>
                    </select>
                </div>
                <div className="mb-6 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="diabetes_anak">
                        Apakah anak pernah mengalami penyakit diabetes selama menderita tuberkulosis?
                    </label>
                    <select value={state.diabetes_anak} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="diabetes_anak" id="diabetes_anak">
                        <option value="" disabled selected>Pilih</option>
                        <option value="Ya">Ya</option>
                        <option value="Tidak">Tidak</option>
                    </select>
                </div>
                <div className="mb-6 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vaksin_bcg">
                        Apakah anak telah menerima imunisasi BCG (Bacillus Calmette-Guérin, imunisasi untuk mencegah penyakit TB)?
                    </label>
                    <select value={state.vaksin_bcg} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="vaksin_bcg" id="vaksin_bcg">
                        <option value="" disabled selected>Pilih</option>
                        <option value="Ya">Ya</option>
                        <option value="Tidak">Tidak</option>
                    </select>
                </div>
                <div className="mb-6 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="riwayat_opname">
                        Apakah anak pernah di opname sebelumnya?
                    </label>
                    <select value={state.riwayat_opname} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="riwayat_opname" id="riwayat_opname">
                        <option value="" disabled selected>Pilih</option>
                        <option value="Ya">Ya</option>
                        <option value="Tidak">Tidak</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="daftar_penyakit_opname">
                        Jika pernah, anak diopname karena penyakit apa saja?
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="daftar_penyakit_opname"
                        name="daftar_penyakit_opname"
                        type="text"
                        placeholder=""
                        onChange={handleChange}
                        value={state.daftar_penyakit_opname}>
                    </input>
                </div>
                <div className="mb-6 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="asi_eksklusif">
                        Apakah anak mengkonsumsi ASI secara eksklusif? (ASI Eksklusif adalah pemberian ASI tanpa makanan/minuman (susu formula) tambahan hingga berusia 6 bulan)
                    </label>
                    <select value={state.asi_eksklusif} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="asi_eksklusif" id="asi_eksklusif">
                        <option value="" disabled selected>Pilih</option>
                        <option value="Ya">Ya</option>
                        <option value="Tidak">Tidak</option>
                    </select>
                </div>
                <div className="mb-6 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tb_serumah">
                        Apakah ada riwayat penyakit tuberkulosis dalam orang serumah?
                    </label>
                    <select value={state.tb_serumah} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="tb_serumah" id="tb_serumah">
                        <option value="" disabled selected>Pilih</option>
                        <option value="Ya">Ya</option>
                        <option value="Tidak">Tidak</option>
                    </select>
                </div>
                <div className="mb-6 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="diabetes_ortu">
                        Apakah ada riwayat penyakit diabetes dalam keluarga (orang tua)?
                    </label>
                    <select value={state.diabetes_ortu} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="diabetes_ortu" id="diabetes_ortu">
                        <option value="" disabled selected>Pilih</option>
                        <option value="Ya">Ya</option>
                        <option value="Tidak">Tidak</option>
                    </select>
                </div>
                <div className="mb-6 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="riwayat_penyakit_serumah">
                        Apakah ada riwayat penyakit lainnya selain tuberkulosis, diabetes dalam orang  serumah?
                    </label>
                    <select value={state.riwayat_penyakit_serumah} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="riwayat_penyakit_serumah" id="riwayat_penyakit_serumah">
                        <option value="" disabled selected>Pilih</option>
                        <option value="Ya">Ya</option>
                        <option value="Tidak">Tidak</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="daftar_penyakit_serumah">
                        Jika ada, penyakit apa saja?
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="daftar_penyakit_serumah"
                        name="daftar_penyakit_serumah"
                        type="text"
                        placeholder=""
                        onChange={handleChange}
                        value={state.daftar_penyakit_serumah}>
                    </input>
                </div>
                <div className="mb-6 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="luas_rumah">
                        Berapa luas rumah tempat anak tinggal?
                    </label>
                    <select value={state.luas_rumah} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="luas_rumah" id="luas_rumah">
                        <option value="" disabled selected>Pilih Luas Rumah</option>
                        <option value="< 36 m^2">{'< 36 m^2'}</option>
                        <option value="36 - 54 m^2">36 - 54 m^2</option>
                        <option value="54 - 120 m^2">54 - 120 m^2</option>
                        <option value="> 120 m^2">> 120 m^2</option>
                    </select>
                </div>
                <div className="flex items-center justify-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default withMainLayout(Panduan);