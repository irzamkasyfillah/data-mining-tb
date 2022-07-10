import React, {useEffect, useState} from "react";
import {withMainLayout} from "../../src/components/MainLayout";
import Uploader from "../../src/components/Uploader";
import {DashboardTable} from "../../src/components/DashboardTable";
import Router from 'next/router';


function Asosiasi() {
    const [files, setFiles] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);


    // Callback~
    const getFiles = (file) => {
        setFiles(file);
        setMessage(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!files) setMessage("Pilih dataset terlebih dahulu");
        else {
            setLoading(true);
            const data = new FormData();
            data.append("uploaded_file", files);
            const req = await fetch(`http://127.0.0.1:8080/uploadfile`, {
                method: "POST",
                body: data,
            }).then((req) => {
                setLoading(false);

                // return req.json()
            });
            fetchData()
        }
    };

    const handleAsosiasi = () => {
        const req = fetch(`http://127.0.0.1:8080/run_asosiasi`, {
            method: "POST",
        })
        // Router.push({
        //   pathname: "/asosiasi",
        //   query: { generate: 1 },
        // });
    };

    const handleCluster = () => {
        const req = fetch(`http://127.0.0.1:8080/run_cluster`, {
            method: "POST",
        })
        Router.push({
            pathname: "/cluster",
        });
    };

    const handleAddNewData = () => {
        Router.push({
            pathname: "/dashboard/create",
        });
    };

    const handleDeleteAllData = () => {
        const req = fetch(`http://127.0.0.1:8080/data-delete-all`, {
            method: "DELETE"
        })
            .then(() => {
                // fetchData()
                setShowModal(false)
                Router.reload(window.location.pathname)
            })
    };

    const fetchData = async () => {
        const req = await fetch(`http://127.0.0.1:8080/get_data`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, 'ini data dashobard table')
                setData(data)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="grid">
                <div className="flex flex-col items-center">
                    <div className="grid p-5 justify-items-center	max-w-full">
                        <div className="max-w-7xl p-2 shadow-xl rounded-lg bg-white">
                            <form
                                onSubmit={handleSubmit}
                                className="grid grid-rows-1 place-content-center"
                                encType="multipart/form-data"
                            >
                                <div className="grid grid-cols-2">
                                    <div className="m-2 bg-slate-100 box-content p-4 border-2 rounded-lg border-dashed">
                                        <div className="flex place-items-center">
                                            <Uploader onUploaded={(file) => getFiles(file)}/>
                                            <div className="grid grid-rows-1 place-content-center">
                                                {message && <p>{message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="m-2 grid place-content-center">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded"
                                            onClick={handleSubmit}
                                        >
                                            Upload Data
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAsosiasi}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded"
                                        >
                                            Generate Data Asosiasi
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCluster}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded"
                                        >
                                            Generate Data Cluster
                                        </button>
                                        {loading && <p>Please Wait...</p>}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="grid justify-items-center p-3 lg:p-5 flex flex-col md:flex-row w-full">
                        <div
                            className="bg-white rounded-md shadow-lg max-w-full dasboardTable overflow-x-auto overflow-y-hidden">
                            <div className="text-center justify-items-center items w-full font-semibold mt-3 mb-2" style={{fontSize: "20px"}}>
                                DATASET TUBERKULOSIS PADA ANAK
                            </div>
                            <hr/>
                            <button
                                type="button"
                                onClick={handleAddNewData}
                                className="float-center mt-2 ml-4 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 my-1 rounded"
                            >
                                Tambah Data
                            </button>
                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={() => setShowModal(true)}*/}
                            {/*    className="mt-2 mr-4 mb-4 bg-red-500 hover:bg-red-700 text-white font-bold text-sm py-2 px-4 my-1 rounded float-right"*/}
                            {/*>*/}
                            {/*    Hapus Semua Data*/}
                            {/*</button>*/}
                            {/*{showModal ? (*/}
                            {/*    <>*/}
                            {/*        <div*/}
                            {/*            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[1000] outline-none focus:outline-none"*/}
                            {/*        >*/}
                            {/*            <div className="relative w-auto my-6 mx-auto max-w-6xl">*/}
                            {/*                /!*content*!/*/}
                            {/*                <div*/}
                            {/*                    className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">*/}
                            {/*                    /!*header*!/*/}
                            {/*                    <div*/}
                            {/*                        className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">*/}
                            {/*                        <p className="text-lg font-semibold">*/}
                            {/*                            Konfirmasi Hapus Data*/}
                            {/*                        </p>*/}
                            {/*                    </div>*/}
                            {/*                    /!*body*!/*/}
                            {/*                    <div style={{maxHeight: 400, overflowY: "auto", overflowX: "auto"}}*/}
                            {/*                         className="table-modal relative p-6 flex-auto m-2 text-sm">*/}
                            {/*                        <p>*/}
                            {/*                            Apakah Anda yakin ingin menghapus semua data?*/}
                            {/*                        </p>*/}

                            {/*                    </div>*/}
                            {/*                    /!*footer*!/*/}
                            {/*                    <div*/}
                            {/*                        className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">*/}
                            {/*                        <button*/}
                            {/*                            className="mr-4 text-white rounded bg-blue-500 hover:bg-blue-700 background-transparent uppercase px-6 py-2 text-xsm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"*/}
                            {/*                            type="button"*/}
                            {/*                            onClick={() => setShowModal(false)}*/}
                            {/*                        >*/}
                            {/*                            Tutup*/}
                            {/*                        </button>*/}
                            {/*                        <button*/}
                            {/*                            className="text-white rounded bg-red-500 hover:bg-red-700 background-transparent uppercase px-6 py-2 text-xsm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"*/}
                            {/*                            type="button"*/}
                            {/*                            onClick={handleDeleteAllData}*/}
                            {/*                        >*/}
                            {/*                            Hapus*/}
                            {/*                        </button>*/}
                            {/*                    </div>*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>*/}
                            {/*    </>*/}
                            {/*) : null}*/}
                            <DashboardTable data={data}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withMainLayout(Asosiasi);