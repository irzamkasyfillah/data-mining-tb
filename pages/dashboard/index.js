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
        fetchData()
    };

    const fetchData = async () => {
        const req = await fetch(`http://127.0.0.1:8080/get_data`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
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
                            <div className="text-center justify-items-center items w-full font-semibold mt-3 mb-2">
                              DATASET TUBERKULOSIS PADA ANAK
                            </div>
                            <hr/>
                            <button
                                type="button"
                                onClick={handleAddNewData}
                                className="float-center mt-2 ml-4 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 my-1 rounded"
                            >
                                Add New Data
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteAllData}
                                className="mt-2 mr-4 mb-4 bg-red-500 hover:bg-red-700 text-white font-bold text-sm py-2 px-4 my-1 rounded float-right"
                            >
                                Delete All Data
                            </button>
                            <DashboardTable data={data}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withMainLayout(Asosiasi);
