import React, {useState} from 'react'
import { withMainLayout } from "../../src/components/MainLayout"
import Uploader from '../../src/components/Uploader';
import Router from 'next/router';

function Asosiasi() {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
 
  // Callback~
  const getFiles = (file) => {
    setFiles(file)
    setMessage(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!files) setMessage("Upload dataset terlebih dahulu")
    else {
      setLoading(true)
      const data = new FormData()
      data.append("uploaded_file", files)
      console.log(data)
      const req = fetch(`http://127.0.0.1:80/uploadfile/`, {
        method: "POST",
        body: data,
        
      })
      .then((req) => {
        setLoading(false)
        Router.push({
          pathname: "/asosiasi",
          query: {generate: 1}
        })
        // return req.json()
      })
      // Router.push("/dashboard")
    }
    
  }

  
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

    return (
      <div>
        <div className="flex flex-col items-center md:pt-20">
          <div className="grid p-5 justify-items-center	max-w-full">
            <div className='max-w-xl p-16 shadow-xl rounded-lg bg-white'>
              <form onSubmit={handleSubmit} className="grid grid-rows-1 place-content-center" encType='multipart/form-data'>
                <div className='m-2 bg-slate-100 box-content p-4 border-2 rounded-lg border-dashed'>
                  <div className='flex place-items-center'>
                    <Uploader onUploaded={(file) => getFiles(file)}/>
                  </div>
                </div>
                <div className='grid grid-rows-1 place-content-center'>
                  {message && <p>{message}</p>}
                </div>
                <div className='m-2 grid place-content-center'>
                  <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generate Data</button>
                  {loading && <p>Please Wait...</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default withMainLayout(Asosiasi)