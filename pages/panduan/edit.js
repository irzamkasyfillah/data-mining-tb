import {withMainLayout} from "../../src/components/MainLayout"
import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router';


function Panduan() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [state, setState] = useState({
        nama: "",
        kelas: ""
    });

    const router = useRouter()

    const fetchData = async () => {
        const req = await fetch(`http://127.0.0.1:8080/edit/${router.query.id}`, {
            method: "GET",
        })
            .then((res) => res.json()
            )
            .then((data) => {
                setState(data);
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

        console.log(JSON.stringify(data), 'data')

        console.log(router.query.id, 'ini id')

        const req = fetch(`http://127.0.0.1:8080/update/${router.query.id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        })

        router.push({
            pathname: "/panduan",
        });
    };

    function handleChange(e) {
        setState({...state, [e.target.name]: e.target.value});
    }

    return (
        <div className="m-5">
            <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={handleSubmit}>
                <h2 className="block text-gray-700 text-lg font-bold mb-4">EDIT DATA</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama">
                        Nama
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="nama"
                        name="nama"
                        type="text"
                        placeholder="Nama"
                        onChange={handleChange}
                        value={state.nama}>
                    </input>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kelas">
                        Kelas
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="kelas"
                        name="kelas"
                        type="text"
                        placeholder="Kelas"
                        onChange={handleChange}
                        value={state.kelas}>
                    </input>
                </div>
                <div className="flex items-center justify-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default withMainLayout(Panduan);