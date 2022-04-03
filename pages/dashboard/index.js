import React, {useState, useEffect} from 'react'
import { withMainLayout } from "../../src/components/MainLayout"
import Uploader from '../../src/components/Uploader';
import Router from 'next/router';
import Table from 'react-tailwind-table';


function Asosiasi() {
  const [files, setFiles] = useState(null);
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
 
  // Callback~
  const getFiles = (file) => {
    setFiles(file)
    setMessage(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!files) setMessage("Pilih dataset terlebih dahulu")
    else {
      setLoading(true)
      const data = new FormData()
      data.append("uploaded_file", files)
      console.log(data)
      const req = fetch(`http://127.0.0.1:8080/uploadfile/`, {
        method: "POST",
        body: data,
        
      })
      .then((req) => {
        setLoading(false)
        
        // return req.json()
      })
      // Router.push("/dashboard")
    }
    
  }

  const handleGenerate = () => {
    Router.push({
      pathname: "/asosiasi",
      query: {generate: 1}
    })
  }

  const fetchData = async () => {
    const req = fetch(`http://127.0.0.1:8080/get_data/`, {
      method: "GET",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setData(data)
      setLoading(false)
    // return req.json()
    })
  }

  useEffect(() => {
    fetchData() 
  }, [])

  
  const handleGenerateData = async () => {
    const req = fetch(`http://127.0.0.1:80/asosiasi/`, {
      method: "GET",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setLoading(false)
      Router.push({
        pathname: "/asosiasi",
        query: {generate: 1}
      })
    // return req.json()
    })
  }

  const columns = [
    {
      field: "timestamp",
      use: "Timestamp",
    },
    {
      field: "umur",
      use: "Umur",
    },
    {
      field: "tinggi_badan",
      use: "Tinggi Badan (cm)",
    },
    {
      field: "berat_badan",
      use: "Berat Badan (kg)",
    },
    {
      field: "jenis_kelamin",
      use: "Jenis Kelamin",
    },
    {
      field: "alamat_kelurahan",
      use: "Kelurahan",
    },
    {
      field: "alamat_kecamatan",
      use: "Kecamatan",
    },
     {
      field: "alamat_kota",
      use: "Kab/Kota",
    },
     {
      field: "pekerjaan_ayah",
      use: "Pekerjaan Ayah",
    },
     {
      field: "pekerjaan_ibu",
      use: "Pekerjaan Ibu",
    },
     {
      field: "pendapatan",
      use: "Pendapatan Orang Tua",
    },
     {
      field: "pernah_sedang_tb",
      use: "Pernah/Sedang Tuberkulosis",
    },
     {
      field: "diabetes_anak",
      use: "Diabetes Anak",
    },
     {
      field: "vaksin_bcg",
      use: "Riwayat Vaksin BCG",
    },
     {
      field: "riwayat_opname_anak",
      use: "Riwayat Opname",
    },
     {
      field: "penyakit_anak",
      use: "Penyakit Saat Opname",
    },
     {
      field: "asi_ekslusif",
      use: "ASI Eksklusif",
    },
     {
      field: "tb_serumah",
      use: "Riwayat Tuberkulosis Orang Serumah",
    },
     {
      field: "diabetes_serumah",
      use: "Riwayat Diabetes Orang Tua",
    },
     {
      field: "penyakit_lainnya",
      use: "Penyakit Lainnya",
    },
     {
      field: "luas_rumah",
      use: "Luas Rumah",
    },
     {
      field: "jumlah_kamar",
      use: "Jumlah Kamar Tidur",
    },
     {
      field: "jumlah_orang",
      use: "Jumlah Orang Serumah",
    },
     {
      field: "sistem_ventilasi",
      use: "Sistem Ventilasi",
    },
  ]

  const data2 = [
    {
        id: 1,
        code: 'Beetlejuice',
        timestamp: '1988',
        umur: '20',
        tinggi_badan: '165',
        berat_badan: '60',
    },
]

    return (
      <div>
        <div className="grid">
            <div className="flex flex-col items-center">
              <div className="grid p-5 justify-items-center	max-w-full">
                <div className='max-w-7xl p-2 shadow-xl rounded-lg bg-white'>
                  <form onSubmit={handleSubmit} className="grid grid-rows-1 place-content-center" encType='multipart/form-data'>
                    <div className='grid grid-cols-2'>
                      <div className='m-2 bg-slate-100 box-content p-4 border-2 rounded-lg border-dashed'>
                        <div className='flex place-items-center'>
                          <Uploader onUploaded={(file) => getFiles(file)}/>
                          <div className='grid grid-rows-1 place-content-center'>
                          {message && <p>{message}</p>}
                        </div>
                        </div>
                      </div>
                      <div className='m-2 grid place-content-center'>
                        <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Upload Data</button>
                        <button type='button' onClick={handleGenerate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded">Generate Data</button>
                        {loading && <p>Please Wait...</p>}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>     
            <div className="flex flex-col items-center">
              <div className="grid p-5 justify-items-center p-3 lg:p-5 flex flex-col md:flex-row w-full">
                  <div className='bg-white rounded-2xl shadow-lg max-w-full dasboardTable px-8 py-0 overflow-x-auto overflow-y-hidden' style={{maxHeight: "93.5vh"}}>
            <Table className="" columns={columns} rows={data} show_search={false} should_export={false} bordered={true}/>
              
                  </div>
              </div>
            </div>     
      </div>
        
      </div>
    )
  }
  
  export default withMainLayout(Asosiasi)