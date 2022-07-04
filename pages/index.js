import React from 'react';
import Router from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { data } from 'autoprefixer';
import Uploader from '../src/components/Uploader';

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      files: null
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleGenerateData = this.handleGenerateData.bind(this)
  }

  // Callback~
  getFiles(file){
    this.setState({ files: file })
  }

  handleSubmit = async (event) => {
    const { files } = this.state
    event.preventDefault()
    const data = new FormData()
    data.append("uploaded_file", files)
    console.log(data)
    const req = fetch(`http://127.0.0.1:80/uploadfile/`, {
      method: "POST",
      body: data,

    })
    .then((req) => {
      this.handleGenerateData()
      // return req.json()
    })
    Router.push("/dashboard")
  }


  handleGenerateData = async () => {
    const req = fetch(`http://127.0.0.1:80/asosiasi/`, {
      method: "GET",
    })
    .then((req) => {
    console.log(req, req.json())
    return req.json()
    })
  }


  render(){
    return (
      <div className="flex flex-col items-center md:pt-20">
        <div className="grid p-5 justify-items-center	max-w-full">
          <div className='max-w-xl p-16 shadow-xl rounded-lg bg-white'>
            <form onSubmit={this.handleSubmit} className="grid grid-rows-1 place-content-center" encType='multipart/form-data'>
              <div className='m-2 bg-slate-100 box-content p-4 border-2 rounded-lg border-dashed'>
                <div className='flex place-items-center'>
                  <Uploader onUploaded={(file) => this.getFiles(file)}/>
                </div>
              </div>
              <div className='m-2 grid place-content-center'>
                 <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generate Data</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;

