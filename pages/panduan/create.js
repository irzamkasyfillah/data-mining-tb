import {withMainLayout} from "../../src/components/MainLayout"
import React, {useState} from "react";
import Router from 'next/router';


function Panduan() {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        nama: "",
        kelas: ""
    });

    const handleSubmit = (event) => {
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

        Router.push({
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
                <h2 className="block text-gray-700 text-lg font-bold mb-4">TAMBAH DATA</h2>
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
                    <fieldset className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <select value={state.kelas} onChange={handleChange} required className="" name="kelas" id="kelas">
                            <option value="" disabled selected>Pilih Jenis Kelamin</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </fieldset>
                    {/*<input*/}
                    {/*    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"*/}
                    {/*    id="kelas"*/}
                    {/*    name="kelas"*/}
                    {/*    type="text"*/}
                    {/*    placeholder="Kelas"*/}
                    {/*    onChange={handleChange}*/}
                    {/*    value={state.kelas}>*/}
                    {/*</input>*/}
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