import {withMainLayout} from "../../src/components/MainLayout"
import React, {useEffect, useState} from "react";
import Router from 'next/router';


function Panduan() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [state, setState] = useState({
        nama: "",
        kelas: ""
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {}

        for (let [key, value] of Object.entries(state)) {
            data[key] = value
        }

        console.log(JSON.stringify(data), 'data')

        const req = fetch(`http://127.0.0.1:8080/create`, {
            method: "POST",
            // headers: {'Content-type': 'application/json'},
            body: JSON.stringify(data),
        })
        // Router.push("/dashboard")
        // }
    };

    const fetchData = async () => {
        const req = await fetch(`http://127.0.0.1:8080/read`, {
            method: "GET",
        })
            .then((res) => res.json()
            )
            .then((data) => {
                setData(data)
            })
    }

    useEffect(() => {
        fetchData();
    }, []);

    function handleChange(e) {
        setState({...state, [e.target.name]: e.target.value});
    }

    const handleAddNewData = () => {
        Router.push({
            pathname: "/panduan/create",
        });
    };

    return (
        <div className="m-5 flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                    {/*<button*/}
                    {/*    type="button"*/}
                    {/*    onClick={handleAddNewData}*/}
                    {/*    className="mt-2 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded"*/}
                    {/*>*/}
                    {/*    Add New Data*/}
                    {/*</button>*/}
                    {/*<div className="overflow-hidden">*/}
                    {/*    <Data_Table data={data}/>*/}
                    {/*</div>*/}
                    <div className="bg-white rounded-md shadow-lg max-w-full dasboardTable overflow-x-auto">
                        <div className="mt-4 ml-2">
                            <h3 className="font-semibold text-lg mt-2 justify-center text-center">PANDUAN PENGGUNAAN
                                WEBSITE</h3>
                            <div className="mt-4 ml-2 mr-2">
                                <p>Website ini terdiri atas 4 halaman, yaitu Halaman Beranda, Halaman Asosiasi, Halaman
                                    Clustering, dan Halaman Panduan.</p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/sidebar.png" className="h-48"/>
                                </div>
                            </div>
                            <div className="mt-5 ml-2 mr-2">
                                <p className="font-semibold">1. Halaman Beranda</p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/beranda.png" className="h-80"/>
                                </div>
                                <p className="mt-4 ml-4 mr-4">
                                    Pada halaman beranda menampilkan tabel yang berisi dataset tuberkulosis pada anak.
                                    Pada halaman ini, user dapat melakukan beberapa hal, yaitu:
                                </p>
                                <p className="ml-10 font-semibold">
                                    a. Menambah Data
                                </p>
                                <p className="ml-14">
                                    Langkah-langkah untuk menambah data yaitu:<br/>
                                </p>
                                <p className="ml-14">
                                    1. Klik tombol 'Tambah Data', maka akan diarahkan ke halaman tambah data.
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/tambah-data-1.png" className="h-40"/>
                                </div>
                                <p className="ml-14">
                                    2. Isi semua form yang diperlukan. Lalu klik tombol 'Submit'
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/submit.png" className="h-32"/>
                                </div>

                                <p className="ml-10 mt-4 font-semibold">
                                    b. Mengedit Data
                                </p>
                                <p className="ml-14">
                                    1. Pada kolom aksi di tabel, klik tombol 'Edit', maka akan diarahkan ke halaman edit
                                    data.
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/edit.png" className="h-64"/>
                                </div>
                                <p className="ml-14">
                                    2. Lalu isi form yang akan di-edit. Setelah itu klik tombol 'Submit'.
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/hal-edit.png" className="h-40"/>
                                </div>

                                <p className="ml-10 mt-4 font-semibold">
                                    c. Menghapus Data
                                </p>
                                <p className="ml-14">
                                    1. Pada kolom aksi di tabel, klik tombol 'Hapus',
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/edit.png" className="h-64"/>
                                </div>

                                <p className="ml-10 mt-4 font-semibold">
                                    d. Melakukan Asosiasi dan Clustering
                                </p>
                                <p className="ml-14">
                                    Untuk melakukan proses data mining asosiasi dan clustering, klik tombol 'Generate
                                    Data Asosiasi' dan
                                    'Generate Data Cluster'. Hasil dari asosiasi dan clustering dapat dilihat pada
                                    Halaman Asosiasi dan
                                    Halaman Clustering.
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/generate.png" className="h-32"/>
                                </div>
                            </div>
                            <div className="mt-5 ml-2 mr-2">
                                <p className="font-semibold">2. Halaman Asosiasi</p>
                                <p className="mt-4 ml-4 mr-4">
                                    1. Setelah menekan tombol Generate Data Asosiasi pada Halaman Beranda.
                                    Tekan tombol asosiasi pada sidebar dan akan diarahkan ke halaman asosiasi
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/sidebar.png" className="h-40"/>
                                </div>
                                <p className="mt-4 ml-4 mr-4">
                                    2. Pada halaman asosiasi, terdapat dua bagian yaitu bagian daftar kecamatan dan
                                    bagian peta
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/hal-asosiasi.png" className="h-80"/>
                                </div>

                                <p className="mt-4 ml-4 mr-4">
                                    3. Pada bagian kecamatan, tekan pada salah satu kecamatan untuk menampilkan
                                    kecamatan pada peta dan hasil aturan asosiasi.
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/poly-asosiasi.png" className="h-80"/>
                                </div>

                                <p className="mt-4 ml-4 mr-4">
                                    4. Terdapat fitur pencarian untuk mencari kecamatan tertentu
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/search.png" className="h-40"/>
                                </div>

                                <p className="mt-4 ml-4 mr-4">
                                    5. Terdapat juga tombol Tampilkan Semua Aturan untuk menampilkan semua aturan
                                    asosiasi di setiap kecamatan
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/tampilkan-aturan.png" className="h-14"/>
                                </div>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/tabel-aturan.png" style={{height: '600px'}}/>
                                </div>

                                <p className="mt-4 ml-4 mr-4">
                                    6. Hasil aturan asosiasi yang tampil pada peta suatu kecamatan merupakan variabel
                                    yang sangat berpengaruh terhadap Tuberkulosis Anak di kecamatan tersebut.
                                    Misalnya pada kecamatan Panakkukang
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/1poly.png" className="h-80"/>
                                </div>

                                <p className="mt-4 ml-8 mr-4">
                                    Variabel yang berkaitan terhadapat Tuberkulosis anak:
                                    Tidak Ada (Penyakit Opname Anak), Ya Anak Telah BCG, Tidak Ada (penyakit lainnya
                                    orang serumah), berhubungan dengan Ya ASI Ekslusif.
                                    Variabel yang sangat berpengaruh terhadap Tuberkulosis Anak di kecamatan Panakkukang
                                    yaitu Tidak ada penyakit opname anak, Anak telah Vaksin BCG, Tidak ada penyakit
                                    lainnya orang serumah, dan ASI eksklusif.
                                </p>
                                <p className="mt-4 ml-4 mr-4">
                                    7. Halaman peta untuk setiap kecamatan memiliki tingkatan warna yang berbeda sesuai
                                    dengan banyaknya kasus tuberkulosis pada kecamatan tersebut.
                                </p>


                            </div>
                            <div className="mt-5 ml-2 mr-2">
                                <p className="font-semibold">3. Halaman Cluster</p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/hal-cluster.png" className="h-96"/>
                                </div>
                                <p className="mt-4 ml-4 mr-4">
                                    Halaman clustering terdiri dari 3 bagian, yaitu pada bagian kanan atas terdapat
                                    peta,
                                    sebelah kiri terdapat daftar kecamatan, dan pada bagian kanan bawah terdapat daftar
                                    klaster
                                </p>
                                <p className="ml-10 font-semibold">
                                    a. Peta
                                </p>
                                <p className="ml-14 mr-4">
                                    Menampilkan peta hasil klasterisasi dataset tuberkulosis pada anak.
                                    Peta yang ditampilkan menunjukkan polygon batasan-batasan untuk setiap kecamatan,
                                    dimana setiap kecamatan memiliki warna polygon yang berbeda tergantung dari jumlah
                                    kasus TB di kecamatan tersebut. Keterangan warna - warna polygon dan jumlah kasusnya
                                    dapat dilihat di sudut kanan bawah.<br/><br/>
                                    Dalam peta ini juga terdapat beberapa simbol lingkaran kecil dengan warna yang
                                    berbeda-beda. Lingkaran ini menunjukkan klaster apa saja yang termasuk dalam
                                    suatu kecamatan.
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/peta.png" className="h-80"/>
                                </div>
                                <p className="ml-10 mt-4 font-semibold">
                                    b. Daftar Klaster
                                </p>
                                <p className="ml-14 mr-4">
                                    Menampilkan seluruh klaster yang terbentuk dengan ciri-ciri yang berbeda-beda untuk
                                    setiap
                                    klaster. Misalnya lingkaran warna orange adalah klaster dengan jumlah TB tertinggi.
                                    Dalam
                                    peta di atas, setiap kecamatan dapat termasuk dalam satu klaster atau lebih yang
                                    menunjukkan
                                    klaster apa saja yang berpengaruh terhadap kasus TB anak di kecamatan tersebut.

                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/klaster.png" className="h-64"/>
                                </div>
                                <p className="ml-14 mt-4 mr-4">
                                    Apabila salah satu lingkaran/klaster di daftar klaster diklik maka dalam petanya
                                    akan menampilkan kecamatan apa saja
                                    yang termasuk dalam klaster tersebut. Untuk menampilkan semua klaster klik tombol
                                    'Tampilkan semua klaster'.
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/klik-klaster.png" className="h-64"/>
                                </div>
                                <p className="ml-14 mt-4 mr-4">
                                    Apabila salah satu lingkaran/klaster di peta diklik, maka akan menampilkan informasi
                                    detil untuk
                                    klaster tersebut seperti pada gambar:
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/panakkukang2.png" className="h-48"/>
                                </div>
                                <p className="ml-14 mt-4 mr-4">
                                    Untuk melihat interpretasi hasil klaster dan rekomendasi yang dapat diberikan dari
                                    hasil clustering, klik tombol 'Interpretasi hasil cluster'.
                                </p>
                                <p className="ml-10 mt-4 font-semibold">
                                    b. Daftar kecamatan
                                </p>
                                <p className="ml-14">
                                    Menampilkan seluruh kecamatan yang ada dalam dataset.
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/daftar-kec.png" className="h-64"/>
                                </div>
                                <p className="ml-14 mt-4">
                                    Apabila salah satu kecamatan diklik, misalnya kecamatan Panakukkang, maka dalam
                                    tampilan peta akan menampilkan klaster-klaster apa saja yang termasuk dalam kecamatan
                                    Panakkukang seperti pada gambar di bawah. Untuk menampilkan semua daftar kecamatan,
                                    klik tombol 'Tampilkan semua kecamatan'.
                                </p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/panakkukang.png" className="h-64"/>
                                </div>
                            </div>
                            <div className="mt-5 ml-2 mr-2">
                                <p className="font-semibold">4. Halaman Panduan</p>
                                <div className="mt-4 flex items-center justify-center">
                                    <img src="/images/hal-panduan.png" className="h-80"/>
                                </div>
                                <p className="mt-4 ml-4 mr-4 mb-4">
                                    Halaman ini berisi panduan penggunaan website, dimulai dari cara menambah, mengedit,
                                    dan menghapus data. Lalu panduan penggunaan fitur-fitur pada Halaman Asosiasi dan
                                    Halaman Clustering.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default withMainLayout(Panduan);