import {withMainLayout} from "../../src/components/MainLayout"
import React, {useEffect, useState} from "react";
import {Data_Table} from "../../src/components/Data_Table";
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
                    <button
                        type="button"
                        onClick={handleAddNewData}
                        className="mt-2 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded"
                    >
                        Add New Data
                    </button>
                    <div className="overflow-hidden">
                        <Data_Table data={data}/>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default withMainLayout(Panduan);
