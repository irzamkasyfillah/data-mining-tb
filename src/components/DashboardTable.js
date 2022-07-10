import DataTable from "react-data-table-component";
import React, {useState} from "react";
import Router from 'next/router';


/**
 * Table to render data on dashboard
 * @param data {any[]}
 * @constructor
 */
export function DashboardTable({data = []}) {
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleEdit = (id) => {
        Router.push({
            pathname: "/dashboard/edit",
            query: {'id': id}
        });
    }

    const handleDelete = (id) => {
        const req = fetch(`http://127.0.0.1:8080/data-delete/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                Router.reload(window.location.pathname)
            })
    }

    const columns = [
        // {
        //     selector: (row) => row.timestamp,
        //     name: "Timestamp",
        // },
        {
            selector: (row) => row.umur,
            name: "Umur",
        },
        {
            selector: (row) => row.tinggi_badan,
            name: "Tinggi Badan (cm)",
        },
        {
            selector: (row) => row.berat_badan,
            name: "Berat Badan (kg)",
        },
        {
            selector: (row) => row.jenis_kelamin,
            name: "Jenis Kelamin",
            width: "130px",
        },
        {
            selector: (row) => row.alamat_kelurahan,
            name: "Kelurahan",
            width: "130px",
        },
        {
            selector: (row) => row.alamat_kecamatan,
            name: "Kecamatan",
            width: "140px",
        },
        {
            selector: (row) => row.alamat_kota,
            name: "Kab/Kota",
            width: "130px",
        },
        {
            selector: (row) => row.pekerjaan_ayah,
            name: "Pekerjaan Ayah",
            width: "130px",
        },
        {
            selector: (row) => row.pekerjaan_ibu,
            name: "Pekerjaan Ibu",
            width: "130px",
        },
        {
            selector: (row) => row.pendapatan,
            name: "Pendapatan Orang Tua",
            width: "140px",
        },
        {
            selector: (row) => row.diabetes_anak,
            name: "Diabetes Anak",
        },
        {
            selector: (row) => row.vaksin_bcg,
            name: "Riwayat Vaksin BCG",
        },
        {
            selector: (row) => row.riwayat_opname_anak,
            name: "Riwayat Opname",
        },
        {
            selector: (row) => row.penyakit_anak,
            name: "Penyakit Saat Opname",
            width: "185px",
        },
        {
            selector: (row) => row.asi_ekslusif,
            name: "ASI Eksklusif",
        },
        {
            selector: (row) => row.tb_serumah,
            name: "Riwayat Tuberkulosis Orang Serumah",
            width: "140px",
        },
        {
            selector: (row) => row.diabetes_serumah,
            name: "Riwayat Diabetes Orang Tua",
        },
        // {
        //     selector: (row) => row.penyakit_lainnya,
        //     name: "Penyakit Lainnya",
        // },
        {
            selector: (row) => row.penyakit_serumah,
            name: "Penyakit Orang Serumah",
            width: "130px",
        },
        {
            selector: (row) => row.luas_rumah,
            name: "Luas Rumah",
            width: "150px",
        },
        // {
        //     selector: (row) => row.jumlah_kamar,
        //     name: "Jumlah Kamar Tidur",
        // },
        // {
        //     selector: (row) => row.jumlah_orang,
        //     name: "Jumlah Orang Serumah",
        // },
        // {
        //     selector: (row) => row.sistem_ventilasi,
        //     name: "Sistem Ventilasi",
        // },
        {
            selector: (row) =>
                <>
                    <button
                        type="button"
                        className=" flex text-xsm mt-2 ml-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 my-1 rounded"
                        onClick={() => handleEdit(row.id)}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        className="flex text-xsm mt-2 ml-2 mb-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-1 my-1 rounded"
                        style={{fontSize: "16px"}}
                        onClick={() => {
                            setSelectedId(row.id)
                            setShowModal(true)
                        }}
                    >
                        Hapus
                    </button>
                    {row.id === selectedId && showModal ? (
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
                                            <p className="text-lg font-semibold">
                                                Konfirmasi Hapus Data
                                            </p>
                                        </div>
                                        {/*body*/}
                                        <div style={{maxHeight: 400, overflowY: "auto", overflowX: "auto"}}
                                             className="table-modal relative p-6 flex-auto m-2 text-sm">
                                            <p>
                                                Apakah Anda yakin ingin menghapus data ini?
                                            </p>

                                        </div>
                                        {/*footer*/}
                                        <div
                                            className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                            <button
                                                className="mr-4 text-white rounded bg-blue-500 hover:bg-blue-700 background-transparent uppercase px-6 py-2 text-xsm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Tutup
                                            </button>
                                            <button
                                                className="text-white rounded bg-red-500 hover:bg-red-700 background-transparent uppercase px-6 py-2 text-xsm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => handleDelete(row.id)}
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                        </>
                    ) : null}
                </>
            ,
            name: 'Aksi'
        }
    ];

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: "#f3f3f3",
                padding: "0.5rem 0",
            },
        },
        cells: {
            style: {
                lineHeight: "1.5em",
            },
        },
        rows: {
            style: {
                padding: "0.5rem 0",
            },
        },
        pagination: {
            style: {
                color: "rgb(59 130 246)",
            },
        },
    };

    return (
        <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
            pagination
            highlightOnHover
        />
    );
}