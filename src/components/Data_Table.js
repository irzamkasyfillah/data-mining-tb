import DataTable from "react-data-table-component";
import React, {useState} from "react";
import Router from 'next/router';


/**
 * Table to render data on dashboard
 * @param data {any[]}
 * @constructor
 */

export function Data_Table({data = []}) {
    const [showModal, setShowModal] = useState(false);
    let i = 0;
    const handleEdit = (id) => {
        Router.push({
            pathname: "/panduan/edit",
            query: {'id': id}
        });
    }

    const handleDelete = (id) => {
        console.log(id)
        const req = fetch(`http://127.0.0.1:8080/delete/${id}`, {
            method: "DELETE"
        })
        Router.reload(window.location.pathname)
    }

    const columns = [
            {
                selector: (row) => i++,
                name: "No",
            },
            {
                selector: (row) => row.nama,
                name: "Nama",
            },
            {
                selector: (row) => row.kelas,
                name: "Kelas",
            },
            {
                selector: (row) =>
                    <>
                        <button
                            type="button"
                            className="mt-2 ml-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 my-1 rounded"
                            onClick={() => handleEdit(row.id)}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="mt-2 ml-2 mb-2 bg-red-500 hover:bg-red-700 text-white py-2 px-4 my-1 rounded"
                            // onClick={() => handleDelete(row.id)}
                            onClick={() => setShowModal(true)}
                        >
                            Delete
                        </button>
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
                name: 'Action'
            }
        ]
    ;

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